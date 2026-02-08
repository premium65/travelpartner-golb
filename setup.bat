@echo off
REM TravelPartner Platform - Windows Setup Script

echo ======================================
echo   TravelPartner Platform Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js v18.12.1 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed. Please install npm v8.19.2 or higher.
    pause
    exit /b 1
)

echo Prerequisites check passed
echo Node.js version:
node -v
echo npm version:
npm -v
echo.

REM Setup API Service
echo ======================================
echo Setting up API Service (Backend)
echo ======================================
cd api-main
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env
        echo Created .env from .env.example
    )
)
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
cd ..
echo.

REM Setup Admin Panel
echo ======================================
echo Setting up Admin Panel (Frontend)
echo ======================================
cd admin-panel-main
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo Created .env.local from .env.example
    )
)
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
cd ..
echo.

REM Setup User Panel
echo ======================================
echo Setting up User Panel (Frontend)
echo ======================================
cd user-panel-main
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo Created .env.local from .env.example
    )
)
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
cd ..
echo.

echo ======================================
echo   Setup Complete!
echo ======================================
echo.
echo Next Steps:
echo   1. Review and update environment variables
echo   2. Make sure MongoDB is running
echo   3. Run services with: run.bat
echo.
echo Default URLs:
echo   - API Service:  http://localhost:3005
echo   - Admin Panel:  http://localhost:3000
echo   - User Panel:   http://localhost:3001
echo.
pause
