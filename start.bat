@echo off
echo Starting MERN E-commerce Application...
echo.

rem Start backend server in a new window
echo Starting Backend Server...
start "Backend Server" cmd /k "npm run server"

rem Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

rem Start frontend client in a new window  
echo Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
