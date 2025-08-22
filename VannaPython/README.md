# VannaPython - AI SQL Generation Service

This project is a Flask-based service for generating SQL queries using various AI models (OpenAI, Google Gemini, Local AI) integrated with .NET application.

## Project Description

The project consists of the following components:

- **app.py** - main Flask API server for handling HTTP requests
- **vanna_open_ai.py** - integration with OpenAI GPT models
- **vanna_gemini.py** - integration with Google Gemini AI
- **vanna_openrouter.py** - integration with Claude 3.7 from openrouter
- **vanna_local_ai.py** - integration with local AI model
- **logger_config.py** - setting for logger

## Requirements

- Python 3.11+
- Flask and dependencies (see requirements.txt)
- PostgreSQL database
- API keys for OpenAI and/or Google Gemini

## Installation

### 1. Quick Setup

**Windows (Command Prompt):**
```cmd
setup.bat
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

### 2. Manual Setup

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment variables setup

Create a `.env` file in the project root directory:

```env
OPENAI_API_KEY=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_SSLMODE=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
GOOGLE_API_KEY=
OPENAI_MODEL=
API_LOCAL_MODEL=
API_KEY_AI_MODEL=
QDRANT_API_KEY=
QDRANT_HOST=
ALLOWED_ORIGIN=
DOTNET_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
OPENROUTER_API_URL=
```

## Running

The Flask server is automatically started by the .NET application. Simply run:

```cmd
dotnet run
```

### Usage Example

Send HTTP POST request to generate SQL:

```bash
curl -X POST http://127.0.0.1:5000/generate-sql \
  -H "Content-Type: application/json" \
  -d '{"query": "Show all users older than 25 years", "model": "openai"}'
```

Available models:
- `"openai"` - uses OpenAI GPT model
- `"openrouter"` - uses Claude 3.7 from openrouter
- `"gemini"` - uses Google Gemini model  
- `"local"` - uses local AI model

### Server Response

```json
{
    "model": "openai",
    "sql": "SELECT * FROM users WHERE age > 25;",
    "error": null
}
```
## Troubleshooting

### Flask Server Not Stopping
If the Flask server doesn't stop when .NET application closes:

1. Check for processes using port 5000: `netstat -ano | findstr :5000`
2. Kill processes manually: `taskkill /PID <process_id> /F`