@echo off
cd /d "%~dp0"

echo Installing Python dependencies for Flask Vanna Server...

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing/Updating dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo Setup completed successfully!
echo You can now start the .NET application, which will automatically launch the Flask server.
pause
