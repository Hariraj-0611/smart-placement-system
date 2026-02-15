@echo off
echo ========================================
echo Smart Placement Management System Setup
echo ========================================
echo.

echo Step 1: Installing Python packages...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install packages
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Creating database migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Step 3: Creating superuser...
python manage.py createsuperuser

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the backend server:
echo   cd backend
echo   python manage.py runserver
echo.
echo To start the frontend (in new terminal):
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
pause