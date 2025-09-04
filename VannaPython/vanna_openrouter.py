import os
import json
import psycopg2
import pandas as pd
import requests
from dotenv import load_dotenv
from vanna.openai import OpenAI_Chat
from vanna.qdrant import Qdrant_VectorStore
from qdrant_client import QdrantClient
from logger_config import get_logger
import psycopg2
from psycopg2 import pool
import threading
import os
import json
import requests

load_dotenv()

class MyVanna(Qdrant_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        Qdrant_VectorStore.__init__(self, config=config)
        OpenAI_Chat.__init__(self, config=config)
        self.postgres_conn_str = config.get('postgres_conn_str') if config else None
        self.logger = get_logger("vanna_openrouter")
        
        if self.postgres_conn_str:
            self.logger.info(f"Connection string configured: {self.postgres_conn_str[:50]}...")
            
            try:
                self.connection_pool = pool.ThreadedConnectionPool(
                    minconn=1,
                    maxconn=10,
                    dsn=self.postgres_conn_str
                )
                self.logger.info("Connection pool initialized successfully")
            except Exception as e:
                self.logger.error(f"Failed to initialize connection pool: {e}")
                raise
            
            try:
                self.connect_to_postgres(
                    host=os.getenv('POSTGRES_HOST'),
                    dbname=os.getenv('POSTGRES_DB'),
                    user=os.getenv('POSTGRES_USER'),
                    password=os.getenv('POSTGRES_PASSWORD'),
                    port=os.getenv('POSTGRES_PORT'),
                )
                self.logger.info("Vanna connected to PostgreSQL successfully")
            except Exception as e:
                self.logger.error(f"Failed to connect Vanna to PostgreSQL: {e}")
                
        else:
            self.logger.error("No postgres_conn_str provided in config")
            raise ValueError("No postgres_conn_str provided in config")
        
        self.db_lock = threading.Lock()
        
        self.model = config.get('model') if config and 'model' in config else os.getenv('OPENROUTER_MODEL', 'cloudflare@cf-meta-llama-3-8b-instruct')
        if not self.model:
            self.logger.error("No model specified in configuration or environment variables")
            raise ValueError("Model must be specified in configuration or environment variables")

        self.api_url = os.getenv('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
        if not self.api_url:
            self.logger.error("No API URL specified in environment variables")
            raise ValueError("API URL must be specified in environment variables")
    
    def get_connection(self):
        return self.connection_pool.getconn()

    def release_connection(self, conn):
        self.connection_pool.putconn(conn)

    def initialize(self):
        self.train_schema()
        self.train_examples_from_sql_table()
        rules = self.get_active_rules()
        for rid, text in rules.items():
            if not self.is_rule_trained(rid):
                self.train(documentation=f"RULE {rid}: {text}")

    def train_examples_from_sql_table(self):
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT natural_language_query, generated_sql
                FROM sql_training_data
            """)
            rows = cursor.fetchall()
            for nlq, gensql in rows:
                if not nlq or not gensql:
                    continue
                if self.is_example_trained(nlq, gensql):
                    self.logger.debug("Skipping already trained example (DB): %s", nlq[:80])
                    continue
                try:
                    self.train(question=nlq, sql=gensql)
                    self.logger.info("Trained example from DB: %s", nlq[:80])
                except Exception as ex:
                    self.logger.warning("Failed to train example: %s; error: %s", nlq[:80], str(ex))
            cursor.close()
        except Exception as e:
            self.logger.error(f"Error loading training examples from sql_training_data: {e}", exc_info=True)
        finally:
            if conn:
                self.release_connection(conn)
                
    def get_active_rules(self):
        rules = {}
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, text FROM sql_generation_rule WHERE is_active = TRUE")
            for rid, text in cursor.fetchall():
                rules[rid] = text
            cursor.close()
        except Exception as e:
            self.logger.error(f"Error loading rules: {str(e)}")
        finally:
            if conn:
                self.release_connection(conn)
        return rules

    def train_schema(self):
        try:
            self.logger.info("Starting schema training...")
            conn = psycopg2.connect(self.postgres_conn_str)
            self.logger.info("Database connection established.")
            cursor = conn.cursor()

            self.logger.info("Fetching table names from service_table...")
            cursor.execute("SELECT name FROM service_table WHERE is_active = TRUE")
            table_names = [row[0] for row in cursor.fetchall()]
            self.logger.info(f"Found {len(table_names)} tables: {table_names}")

            for table_name in table_names:
                self.logger.info(f"Processing table: {table_name}")
                
                self.logger.info(f"Fetching column details for table: {table_name}")
                cursor.execute(f"""
                    SELECT column_name, data_type, character_maximum_length,
                        numeric_precision, numeric_scale
                    FROM information_schema.columns
                    WHERE table_name = %s
                """, (table_name,))
                columns_info = cursor.fetchall()
                self.logger.info(f"Found {len(columns_info)} columns for table {table_name}: {columns_info}")
                
                self.logger.info(f"Fetching display names for table: {table_name}")
                cursor.execute(f"""
                    SELECT stf.column_name, stf.display_name
                    FROM service_table_field stf
                    JOIN service_table st ON stf.service_table_id = st.id
                    WHERE st.name = %s
                """, (table_name,))
                display_names_data = cursor.fetchall()
                self.logger.info(f"Found {len(display_names_data)} display names for table {table_name}: {display_names_data}")
                
                display_names_dict = {col_name: display_name for col_name, display_name in display_names_data}

                ddl = f"CREATE TABLE {table_name} (\n"
                column_definitions = []
                for column in columns_info:
                    col_name, data_type, max_length, precision, scale = column
                    if data_type in ['character varying', 'varchar', 'character', 'char']:
                        data_type = f"{data_type}({max_length})" if max_length else data_type
                    elif data_type in ['numeric', 'decimal']:
                        data_type = f"{data_type}({precision},{scale})" if precision and scale else data_type
                    
                    display_name = display_names_dict.get(col_name, col_name)
                    column_definitions.append(f"    Name field: {col_name} , Display name: {display_name}, Type:{data_type}")
                ddl += ",\n".join(column_definitions)
                ddl += "\n);"
                self.logger.info(f"Generated DDL for table {table_name}: {ddl}")
                
                if not self.is_ddl_trained(ddl):
                    self.logger.info(f"Training DDL for table {table_name}...")
                    self.train(ddl=ddl)
                else:
                    self.logger.info(f"DDL for table {table_name} is already trained.")
            
            conn.close()
            self.logger.info("Schema training completed successfully.")
        except psycopg2.OperationalError as e:
            self.logger.error(f"Database connection error: {str(e)}")
            raise
        except Exception as e:
            self.logger.error(f"Unexpected error during schema training: {str(e)}")
            raise

    def is_ddl_trained(self, ddl):
        try:
            points = self.get_training_data("ddl")
            return any(ddl == point.get('payload', {}).get('ddl', '') for point in points)
        except Exception as e:
            self.logger.error(f"Error checking DDL: {str(e)}")
            return False

    def is_rule_trained(self, rule_id):
        try:
            points = self.get_training_data("documentation")
            rule_text = f"RULE {rule_id}"
            return any(rule_text == point.get('payload', {}).get('documentation', '') for point in points)
        except Exception as e:
            self.logger.error(f"Error checking rule: {str(e)}")
            return False

    def is_example_trained(self, question, sql):
        try:
            training_data = self.get_training_data()
            for data in training_data:
                payload = data.get('payload', {}) if isinstance(data, dict) else {}
                existing_q = str(payload.get('question', '')).strip()
                existing_s = str(payload.get('sql', '')).strip()
                if question.strip() == existing_q and sql.strip() == existing_s:
                    return True
            return False
        except Exception as e:
            self.logger.warning(f"Error checking example: {e}")
            return False
    
    def get_related_training_data(self, question: str, limit: int = 5):
        try:
            similar_questions = self.get_similar_question_sql(question)
            if similar_questions:
                return similar_questions[:limit]

            training_data = self.get_training_data()
            sql_examples = []
            for data in training_data:
                payload = data.get('payload', {}) if isinstance(data, dict) else {}
                if payload.get('question') and payload.get('sql'):
                    sql_examples.append(data)
                    if len(sql_examples) >= limit:
                        break
            
            return sql_examples
        except Exception as e:
            self.logger.warning(f"Error getting related training data: {e}")
            return []
        
    def generate_sql(self, question: str, chat_id: int = None, **kwargs) -> str:
        self.logger.info(f"SQL generation request: {question}, chat_id: {chat_id}")

        enhanced_question = f"""
            You are a helpful assistant.

            User's Question:
            {question}

            Generate ONLY SELECT statements using PostgreSQL syntax.
            Use display names (aliases with AS) for column names in the SELECT clause when available.
            Consider joining related tables when necessary.
            
            Important: Always use display names (aliases) for columns in the SELECT clause.
            Format for display names: column_name AS "Display Name"
        """
        self.logger.info(f"Enhanced prompt: {enhanced_question}")

        result = super().generate_sql(enhanced_question, allow_llm_to_see_data=True, **kwargs)
        self.logger.info(f"Generated SQL: {result}")
        return result

    def get_chat_history(self, chat_id: int):
        try:
            self.logger.info(f"Fetching chat history for chat_id: {chat_id}")
            conn = psycopg2.connect(self.postgres_conn_str)
            cursor = conn.cursor()

            query = """
                SELECT m.text, m.is_user, sm.sql, sm.text as sql_text, sm.model
                FROM message m
                LEFT JOIN sql_message sm ON m.id = sm.message_id
                WHERE m.chat_id = %s AND m.text IS NOT NULL
                ORDER BY m.created_at DESC
                LIMIT 14
            """
            cursor.execute(query, (chat_id,))
            results = cursor.fetchall()
            conn.close()
            
            chat_history = []
            
            for text, is_user, sql, sql_text, model in reversed(results):
                if is_user:
                    chat_history.append({
                        "role": "user",
                        "content": text
                    })
                else:
                    if sql == "Processing your query with multiple AI models...":
                        continue
                    
                    if sql:
                        content = f"SQL: {sql}"
                    else:
                        content = text if text else "Request processed"
                    
                    chat_history.append({
                        "role": "assistant", 
                        "content": content
                    })
            
            self.logger.info(f"Retrieved {len(chat_history)} messages for chat history")
            return chat_history
            
        except Exception as e:
            self.logger.error(f"Error fetching chat history: {str(e)}")
            return []

    def submit_prompt(self, prompt, **kwargs):
        self.logger.info("=== Starting prompt processing ===")

        messages = []
        sql_examples = ""
        user_question = ""
        
        if isinstance(prompt, list):
            for message in prompt:
                if isinstance(message, dict) and 'role' in message and 'content' in message:
                    messages.append(message)
                    if message.get('role') == 'user':
                        user_question = message.get('content', '')
            if not messages or messages[-1].get('role') != 'user':
                prompt_text = "\n".join([str(item) for item in prompt])
                messages.append({"role": "user", "content": prompt_text})
                user_question = prompt_text
        else:
            messages.append({"role": "user", "content": str(prompt)})
            user_question = str(prompt)
        
        try:
            if user_question:
                related_sql_examples = self.get_related_training_data(user_question)
                if related_sql_examples:
                    sql_examples = "\n### SQL Examples:\n"
                    for i, example in enumerate(related_sql_examples[:3], 1):  # Ограничиваем 3 примерами
                        payload = example.get('payload', {}) if isinstance(example, dict) else {}
                        question = payload.get('question', '')
                        sql = payload.get('sql', '')
                        if question and sql:
                            sql_examples += f"Example {i}:\nQuestion: {question}\nSQL: {sql}\n\n"
                    self.logger.info(f"Added {len(related_sql_examples)} SQL examples to prompt")
        except Exception as e:
            self.logger.warning(f"Error getting SQL examples: {e}")
        
        if sql_examples and messages:
            system_message_found = False
            for i, message in enumerate(messages):
                if message.get('role') == 'system':
                    messages[i]['content'] += sql_examples
                    system_message_found = True
                    break
            
            if not system_message_found:
                system_message = {
                    "role": "system",
                    "content": f"You are a helpful SQL assistant.{sql_examples}"
                }
                messages.insert(0, system_message)
        
        self.logger.info(f"Final prompt with {len(messages)} messages")
        self.logger.info(f"Model use: {self.model}")
        
        data = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 1024,
            "temperature": 0.5,
            "top_p": 0.75,
            "frequency_penalty": 0.3
        }

        self.logger.debug(f"Sending request to OpenRouter API: {self.api_url}")
        self.logger.debug(f"Request data: {json.dumps(data, indent=2, ensure_ascii=False)}")

        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        }

        try:
            self.logger.info("Making API request to OpenRouter...")
            response = requests.post(self.api_url, json=data, headers=headers)
            response.raise_for_status()
            
            self.logger.info(f"API response status: {response.status_code}")
            result = response.json()
            self.logger.debug(f"API response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
            if "choices" in result and len(result["choices"]) > 0:
                sql_query = result["choices"][0]["message"]["content"].strip()
                
                for stop_word in ["###", "```sql", "```", "<SQL>", "</SQL>"]:
                    sql_query = sql_query.replace(stop_word, "")
                
                self.logger.info(f"Generated SQL: {sql_query}")
                self.logger.info("=== Prompt processing completed successfully ===")
                return sql_query
            else:
                error_msg = result.get("error", "Unknown response format")
                self.logger.error(f"API returned unexpected format: {error_msg}")
                raise Exception(f"Invalid API response: {error_msg}")
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"API request failed: {str(e)}")
            self.logger.error("=== Prompt processing failed ===")
            raise
        except Exception as e:
            self.logger.error(f"Unexpected error in submit_prompt: {str(e)}")
            self.logger.error("=== Prompt processing failed ===")
            raise

def get_vanna_openrouter(custom_config=None):
    config = {
        'client': QdrantClient(api_key=os.getenv('QDRANT_API_KEY'), url=os.getenv('QDRANT_HOST')),
        'api_key': f"{os.getenv('OPENROUTER_API_KEY')}",
        'model': os.getenv('OPENROUTER_MODEL', 'cloudflare@cf-meta-llama-3-8b-instruct'),
        'postgres_conn_str': (
            f"host={os.getenv('POSTGRES_HOST')} "
            f"port={os.getenv('POSTGRES_PORT')} "
            f"dbname={os.getenv('POSTGRES_DB')} "
            f"user={os.getenv('POSTGRES_USER')} "
            f"password={os.getenv('POSTGRES_PASSWORD')} "
            f"sslmode={os.getenv('POSTGRES_SSLMODE', 'require')}"
        )
    }
    if custom_config:
        config.update(custom_config)
    return MyVanna(config=config)