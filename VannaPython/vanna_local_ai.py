from vanna.openai import OpenAI_Chat
from vanna.qdrant import Qdrant_VectorStore
from qdrant_client import QdrantClient
import psycopg2
import pandas as pd
import requests
from dotenv import load_dotenv
import os
import json
from logger_config import get_logger 

load_dotenv()

class MyVanna(Qdrant_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        Qdrant_VectorStore.__init__(self, config=config)
        OpenAI_Chat.__init__(self, config=config)
        self.postgres_conn_str = config.get('postgres_conn_str') if config else None
        self.logger = get_logger("vanna_local_ai") 
        
        if self.postgres_conn_str:
            self.logger.info(f"Connection string configured: {self.postgres_conn_str[:50]}...")
        else:
            self.logger.error("No postgres_conn_str provided in config")
            raise ValueError("No postgres_conn_str provided in config")


    def initialize(self):
        self.train_schema()
        rules = self.get_active_rules()
        for rid, text in rules.items():
            if not self.is_rule_trained(rid):  
                self.train(documentation=f"RULE {rid}: {text}")
        
        #self.train_examples_from_json()

    def train_examples_from_json(self):
        try:
            json_path = os.path.join(os.path.dirname(__file__), "training_examples.json")
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    examples = json.load(f)
                
                for example in examples:
                    question = example.get('question')
                    sql = example.get('sql')
                    if question and sql:
                        if not self.is_example_trained(question, sql):
                            self.train(question=question, sql=sql)
        except Exception as e:
            self.logger.error(f"Error loading training examples: {str(e)}")

    def get_active_rules(self):
        rules = {}
        try:
            conn = psycopg2.connect(self.postgres_conn_str)
            cursor = conn.cursor()
            cursor.execute("SELECT id, text FROM sql_generation_rule WHERE is_active = TRUE")
            for rid, text in cursor.fetchall():
                rules[rid] = text
            conn.close()
        except Exception as e:
            self.logger.error(f"Error loading rules: {str(e)}")
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
                columns = cursor.fetchall()
                self.logger.info(f"Found {len(columns)} columns for table {table_name}: {columns}")
                
                ddl = f"CREATE TABLE {table_name} (\n"
                column_definitions = []
                for column in columns:
                    col_name, data_type, max_length, precision, scale = column
                    if data_type in ['character varying', 'varchar', 'character', 'char']:
                        data_type = f"{data_type}({max_length})" if max_length else data_type
                    elif data_type in ['numeric', 'decimal']:
                        data_type = f"{data_type}({precision},{scale})" if precision and scale else data_type
                    column_definitions.append(f"    {col_name} {data_type}")
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
            print(f"Error checking DDL: {str(e)}")
            return False

    def is_rule_trained(self, rule_id):
        try:
            points = self.get_training_data("documentation")
            rule_text = f"RULE {rule_id}"
            return any(rule_text == point.get('payload', {}).get('documentation', '') for point in points)
        except Exception as e:
            print(f"Error checking rule: {str(e)}")
            return False  
        
    def is_example_trained(self, question, sql):
        try:
            training_data = self.get_training_data()
            return any(
                question in str(data.get('question', '')) and sql in str(data.get('sql', ''))
                for data in training_data
            )
        except Exception as e:
            self.logger.error(f"Error checking example: {str(e)}")
            return False

    def generate_sql(self, question: str, chat_id: int = None, **kwargs) -> str:
        self.logger.info(f"SQL generation request: {question}, chat_id: {chat_id}")

        chat_history = []
        if chat_id:
            chat_history = self.get_chat_history(chat_id)

        chat_history_str = "\n".join(
            [f"{message['role'].capitalize()}: {message['content']}" for message in chat_history]
        )

        enhanced_question = f"""
            You are a helpful assistant. Below is the chat history and the user's question.
            Chat History:
            {chat_history_str}

            User's Question:
            {question}

            Generate ONLY SELECT statements using PostgreSQL syntax.
            Consider joining related tables when necessary.
        """
        self.logger.info(f"Enhanced prompt: {enhanced_question}")

        if chat_history:
            kwargs['chat_history'] = chat_history
            self.logger.info(f"Chat history added: {len(chat_history)} messages")

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
        
        context = ""
        rules = "" 
        question = ""
        
        self.logger.debug(f"Raw prompt received: {prompt}")

        if isinstance(prompt, list):
            system_content = ""
            user_question = ""
            for message in prompt:
                if message.get("role") == "system":
                    system_content = message.get("content", "")
                elif message.get("role") == "user":
                    user_question = message.get("content", "")
            question = user_question
            self.logger.info(f"Extracted question from list: {question}")
        else:
            question = str(prompt)
            system_content = ""
            self.logger.info(f"Direct question: {question}")
        lines = system_content.split("\n")
        in_table_definition = False
        for line in lines:
            line = line.strip()
            if line.startswith("CREATE TABLE"):
                in_table_definition = True
                context += line + "\n"
            elif in_table_definition:
                context += line + "\n"
                if line.endswith(");"):
                    in_table_definition = False
            elif line.startswith("RULE"):
                rules += line + "\n"

        self.logger.debug(f"Extracted context length: {len(context)} characters")
        self.logger.debug(f"Extracted rules length: {len(rules)} characters")
        self.logger.info(f"Context: {context[:200]}..." if len(context) > 200 else f"Context: {context}")
        self.logger.info(f"Rules: {rules[:200]}..." if len(rules) > 200 else f"Rules: {rules}")

        final_prompt = f"""
            ### Database Schema
            {context if context else '-- No schema provided'}
            ### Business Rules
            {rules if rules else '-- No business rules provided'}
            ### Question
            {question}
            ### Instructions
            1. Generate ONLY the SQL query.
            2. Strictly follow ALL business rules listed in the "Business Rules" section.
            3. Use proper JOINs as specified in the business rules.
            4. Ensure the query is valid for the provided schema.
            5. Do NOT include explanations, comments, or markdown formatting.
            ### SQL Query
        """

        data = {
            "inputs": final_prompt.strip(),
            "parameters": {
                "max_new_tokens": 1024, 
                "temperature": 0.5,     
                "top_p": 0.75,         
                "do_sample": True,      
                "repetition_penalty": 1.1,
                "stop": ["```", ";", "Question:", "###"],
                "return_full_text": False,  
                "truncate": 8192,       
                "frequency_penalty": 0.3,   
                "details": True     
            }
        }

        api_url = f"{os.getenv('API_LOCAL_MODEL', 'https://ml-nlp2sql-prod-dgzae.westus.inference.ml.azure.com/generate')}"
        self.logger.debug(f"Sending request to API: {api_url}")
        self.logger.debug(f"Request data: {json.dumps(data, indent=2, ensure_ascii=False)}")

        headers = {
            "Authorization": f"Bearer {os.getenv('API_KEY_AI_MODEL')}",
            "Content-Type": "application/json"
        }

        try:
            self.logger.info("Making API request...")
            response = requests.post(api_url, json=data, headers=headers)
            response.raise_for_status()
            
            self.logger.info(f"API response status: {response.status_code}")
            result = response.json()
            self.logger.debug(f"API response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            self.logger.info(f"API response: {result}")
            
            if "generated_text" in result:
                sql_query = result["generated_text"].strip()
                
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

config = {
    'client': QdrantClient(api_key=os.getenv('QDRANT_API_KEY'), url=os.getenv('QDRANT_HOST')),
    'api_key': f"{os.getenv('OPENAI_API_KEY')}",
    'model': f"{os.getenv('OPENAI_MODEL', 'gpt-3.5')}",
    'postgres_conn_str': (
        f"host={os.getenv('POSTGRES_HOST')} "
        f"port={os.getenv('POSTGRES_PORT')} "
        f"dbname={os.getenv('POSTGRES_DB')} "
        f"user={os.getenv('POSTGRES_USER')} "
        f"password={os.getenv('POSTGRES_PASSWORD')} "
        f"sslmode={os.getenv('POSTGRES_SSLMODE', 'require')}"
    )
}

def get_vanna_local(custom_config=None):
    if custom_config:
        return MyVanna(config=custom_config)
    return MyVanna(config=config)