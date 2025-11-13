@echo off
echo Starting MERN E-commerce Development Environment...
echo.

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "npm run server"

echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak > nul

echo Starting Frontend Client (Port 3000)...
start "Frontend Client" cmd /k "npm run client"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)...
pause > nul
