@echo off
REM TravelPartner Platform - Windows Run Script

echo ======================================
echo   TravelPartner Platform Launcher
echo ======================================
echo.

REM Check if dependencies are installed
if not exist "api-main\node_modules" (
    echo ERROR: Dependencies not installed for API Service. Please run setup.bat first.
    pause
    exit /b 1
)

if not exist "admin-panel-main\node_modules" (
    echo ERROR: Dependencies not installed for Admin Panel. Please run setup.bat first.
    pause
    exit /b 1
)

if not exist "user-panel-main\node_modules" (
    echo ERROR: Dependencies not installed for User Panel. Please run setup.bat first.
    pause
    exit /b 1
)

echo Starting all services...
echo.
echo NOTE: This will open three separate windows for each service
echo Press CTRL+C in any window to stop that service
echo.

REM Start API Service in a new window
start "API Service - Port 3005" cmd /k "cd api-main && npm run dev"

REM Wait a moment for API to start
timeout /t 3 /nobreak >nul

REM Start Admin Panel in a new window
start "Admin Panel - Port 3000" cmd /k "cd admin-panel-main && npm run dev"

REM Start User Panel in a new window
start "User Panel - Port 3001" cmd /k "cd user-panel-main && set PORT=3001 && npm run dev"

echo.
echo ======================================
echo   All Services Started!
echo ======================================
echo.
echo Access the services at:
echo   - API Service:  http://localhost:3005
echo   - Admin Panel:  http://localhost:3000
echo   - User Panel:   http://localhost:3001
echo.
echo To stop services, close the respective windows or press CTRL+C in each window
echo.
pause
