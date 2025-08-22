from vanna.openai import OpenAI_Chat
from vanna.qdrant import Qdrant_VectorStore
from qdrant_client import QdrantClient
import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
import json
from logger_config import get_logger

load_dotenv()

class MyVanna(Qdrant_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        Qdrant_VectorStore.__init__(self, config=config)
        OpenAI_Chat.__init__(self, config=config)
        
        self.logger = get_logger("vanna_openai")
        
        self.postgres_conn_str = config.get('postgres_conn_str')
        if self.postgres_conn_str:
            self.logger.info(f"Connection string: {self.postgres_conn_str[:50]}...")
        else:
            self.logger.error("No postgres_conn_str provided in config")
            raise ValueError("No postgres_conn_str provided in config")
    
    def generate_sql(self, question: str, chat_id: int = None, **kwargs) -> str:
        self.logger.info(f"SQL generation request: {question}, chat_id: {chat_id}")

        enhanced_question = f"""
            You are a helpful assistant. Below is the chat history and the user's question.

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
    
    def get_relevant_context(self, question: str):
        try:
            self.logger.info(f"Getting relevant context for question: {question}")

            ddl_results = []
            try:
                ddl_data = self.get_related_ddl(question)
                if ddl_data:
                    for ddl in ddl_data:
                        if isinstance(ddl, dict) and 'ddl' in ddl:
                            ddl_results.append(ddl['ddl'])
                        elif isinstance(ddl, str):
                            ddl_results.append(ddl)
                self.logger.info(f"Found {len(ddl_results)} relevant DDL statements")
            except Exception as e:
                self.logger.warning(f"Error getting DDL: {str(e)}")

            documentation_results = []
            try:
                doc_data = self.get_related_documentation(question)
                if doc_data:
                    for doc in doc_data:
                        if isinstance(doc, dict) and 'documentation' in doc:
                            documentation_results.append(doc['documentation'])
                        elif isinstance(doc, str):
                            documentation_results.append(doc)
                self.logger.info(f"Found {len(documentation_results)} relevant documentation items")
            except Exception as e:
                self.logger.warning(f"Error getting documentation: {str(e)}")
            
            result = {
                "ddl": ddl_results,
                "documentation": documentation_results,
                "question": question
            }
            
            self.logger.info(f"Returning context with {len(ddl_results)} DDL and {len(documentation_results)} documentation items")
            return result
            
        except Exception as e:
            self.logger.error(f"Error getting relevant context: {str(e)}")
            return {
                "ddl": [],
                "documentation": [],
                "question": question,
                "error": str(e)
            }
    
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
            print(f"Error loading training examples: {str(e)}")

    def get_active_rules(self):
        rules = {}
        try:
            conn = psycopg2.connect(self.postgres_conn_str)
            cursor = conn.cursor()
            cursor.execute("SELECT id, text FROM sql_generation_rule WHERE is_active = TRUE")
            for rid, text in cursor.fetchall():
                print(f"Show rules: {text}")
                rules[rid] = text
            conn.close()
        except Exception as e:
            print(f"Error loading rules: {str(e)}")
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
            print(f"Error checking example: {str(e)}")
            return False
        
config = {
    'client': QdrantClient(api_key=os.getenv('QDRANT_API_KEY'), url=os.getenv('QDRANT_HOST')),
    'api_key': f"{os.getenv('OPENAI_API_KEY')}",
    'model': f"{os.getenv('OPENAI_MODEL', 'gpt-4')}",
    'postgres_conn_str': (
        f"host={os.getenv('POSTGRES_HOST')} "
        f"port={os.getenv('POSTGRES_PORT')} "
        f"dbname={os.getenv('POSTGRES_DB')} "
        f"user={os.getenv('POSTGRES_USER')} "
        f"password={os.getenv('POSTGRES_PASSWORD')} "
        f"sslmode={os.getenv('POSTGRES_SSLMODE', 'require')}"
    )
}

def get_vanna_open_ai(custom_config=None):
    if custom_config:
        return MyVanna(config=custom_config)
    return MyVanna(config=config)