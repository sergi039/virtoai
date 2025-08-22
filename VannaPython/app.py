from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import threading
from logger_config import get_logger
from vanna_open_ai import get_vanna_open_ai
from vanna_local_ai import get_vanna_local
from vanna_gemini import get_vanna_gemini
from vanna_openrouter import get_vanna_openrouter
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
logger = get_logger("flask_vanna_server")

logger.info("=== Vanna Flask Server Starting ===")
logger.info(f"Python version: {os.sys.version}")
logger.info(f"Flask app name: {app.name}")

ALLOWED_ORIGIN = os.getenv('ALLOWED_ORIGIN')
if not ALLOWED_ORIGIN:
    logger.error("ALLOWED_ORIGIN not set in environment variables!")
    raise ValueError("ALLOWED_ORIGIN must be set in environment variables")
logger.info(f"ALLOWED_ORIGIN configured: {ALLOWED_ORIGIN}")

API_KEY_HEADER = os.getenv('API_KEY_HEADER', 'X-API-Key')
DOTNET_API_KEY = os.getenv('DOTNET_API_KEY')
if not DOTNET_API_KEY:
    logger.error("DOTNET_API_KEY not set in environment variables!")
    raise ValueError("DOTNET_API_KEY must be set in environment variables")
logger.info(f"API authentication configured with header: {API_KEY_HEADER}")

vn_initalize = get_vanna_gemini()
vn_initalize.reinitialize()

CORS(app, 
     origins=[ALLOWED_ORIGIN],
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'X-API-Key'],
     supports_credentials=True)

def validate_api_key():
    provided_key = request.headers.get(API_KEY_HEADER)
    if not provided_key:
        logger.warning(f"Missing {API_KEY_HEADER} header in request from {request.remote_addr}")
        return False
    if provided_key != DOTNET_API_KEY:
        logger.warning(f"Invalid API key provided from {request.remote_addr}: {provided_key}")
        return False
    logger.info(f"Valid API key provided from {request.remote_addr}")
    return True

def validate_origin():
    origin = request.headers.get('Origin')
    referer = request.headers.get('Referer')
    if origin and origin != ALLOWED_ORIGIN:
        logger.warning(f"Request from unauthorized origin: {origin}")
        return False
    if referer and not referer.startswith(ALLOWED_ORIGIN):
        logger.warning(f"Request from unauthorized referer: {referer}")
        return False
    return True

server_shutdown_event = threading.Event()

model_locks = {
    'gemini': threading.Lock(),
    'local': threading.Lock(),
    'openai': threading.Lock(),
    'openrouter': threading.Lock(),
}
model_instances = {
    'openai': get_vanna_open_ai(),
    'gemini': get_vanna_gemini(),
    'local': get_vanna_local(),
    'openrouter': get_vanna_openrouter()
}

def get_model_instance(model_type):
    return model_instances[model_type]

def generate_sql_safe(model_type, query, chat_id=None):
    with model_locks[model_type]:
        try:
            if chat_id and hasattr(model_instances[model_type], 'get_chat_history'):
                return model_instances[model_type].generate_sql(query, chat_id=chat_id)
            else:
                return model_instances[model_type].generate_sql(query)
        except OSError as e:
            if e.errno == 22:
                logger.warning("Console output blocked, using fallback")
                try:
                    if chat_id and hasattr(model_instances[model_type], 'get_chat_history'):
                        return model_instances[model_type].generate_sql(query, chat_id=chat_id)
                    else:
                        return model_instances[model_type].generate_sql(query)
                except Exception as final_error:
                    logger.error(f"Final SQL generation attempt failed: {final_error}", exc_info=True)
                    raise
            else:
                raise

def reinitialize_model(model_type):
    with model_locks[model_type]:
        model_instances[model_type].reinitialize()
    
@app.route('/')
def health_check():
    html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Server Health Check</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f4f4f9;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #fff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                    font-size: 18px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>AI Server is Running</h1>
                <p>This server is designed to handle AI-related tasks and queries.</p>
            </div>
        </body>
        </html>
    """
    return html_content, 200

@app.route('/generate-sql', methods=['POST'])
def generate_sql():
    if not validate_origin():
        return jsonify({"error": "Forbidden", "message": "Request from unauthorized origin"}), 403

    if not validate_api_key():
        return jsonify({"error": "Unauthorized", "message": "Invalid or missing API key"}), 401
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided", "sql": None, "model": None}), 400
        
        query = data.get('query')
        model_type = data.get('model', 'openai')
        chatId = data.get('chatId')
        
        logger.info(f"Received request for model {model_type} with chatId {chatId} from {request.remote_addr}")
        
        if not query:
            return jsonify({"error": "Query is required", "sql": None, "model": model_type}), 400
        
        if model_type not in ['openai', 'gemini', 'local', 'openrouter']:
            model_type = 'openai'
        
        logger.info(f"Processing request - Model: {model_type}, Query: {query} from {request.remote_addr}")
        
        try:
            sql = generate_sql_safe(model_type, query, chatId)
            logger.info(f"Successfully generated SQL for model {model_type} from {request.remote_addr}")
            return jsonify({
                "model": model_type, 
                "sql": sql, 
                "error": None
            })
        except Exception as e:
            logger.error(f"Error processing request for model {model_type}: {e}", exc_info=True)
            return jsonify({"model": model_type, "sql": None, "error": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in generate_sql endpoint: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}", "sql": None, "model": None}), 500

@app.route('/get-context', methods=['POST'])
def get_context():
    if not validate_origin():
        return jsonify({"error": "Forbidden", "message": "Request from unauthorized origin"}), 403

    if not validate_api_key():
        return jsonify({"error": "Unauthorized", "message": "Invalid or missing API key"}), 401
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided", "ddl": [], "documentation": []}), 400
        
        query = data.get('query')
        model_type = 'openai'
        
        logger.info(f"Received context request for model {model_type} from {request.remote_addr}")
        
        if not query:
            return jsonify({"error": "Query is required", "ddl": [], "documentation": []}), 400
        
        logger.info(f"Processing context request - Model: {model_type}, Query: {query}")
        
        try:
            with model_locks[model_type]:
                context = model_instances[model_type].get_relevant_context(query)
            
            logger.info(f"Successfully retrieved context for model {model_type} from {request.remote_addr}")
            return jsonify({
                "model": model_type,
                "query": query,
                "ddl": context.get("ddl", []),
                "documentation": context.get("documentation", []),
                "error": context.get("error", None)
            })
        except Exception as e:
            logger.error(f"Error processing context request for model {model_type}: {e}", exc_info=True)
            return jsonify({
                "model": model_type, 
                "query": query,
                "ddl": [], 
                "documentation": [], 
                "error": str(e)
            }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_context endpoint: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}", "ddl": [], "documentation": []}), 500

@app.route('/reinitialize-models', methods=['POST'])
def reinitialize_models():
    if not validate_api_key():
        return jsonify({"error": "Unauthorized"}), 401
    try:
        reinitialize_model('gemini')
        logger.info("All models reinitialized successfully")
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Error reinitializing models: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    logger.info("=== Starting Flask development server ===")
    app.run()
else:
    logger.info("=== Flask app initialized for production (gunicorn) ===")
    logger.info("Application ready to serve requests")