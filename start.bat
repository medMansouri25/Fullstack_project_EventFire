@echo off
echo Lancement EventFire...

start "Backend - EventFire" cmd /k "cd /d "d:\4A-2025.2026\4A-Mansouri\Dev_fullstack\Projet_full_stack_EventFire\EventFire\backend" && node src/server.js"

timeout /t 3 /nobreak > nul

start "Frontend - EventFire" cmd /k "cd /d "d:\4A-2025.2026\4A-Mansouri\Dev_fullstack\Projet_full_stack_EventFire\EventFire\frontend" && npm run dev"

echo.
echo Les deux serveurs sont en cours de demarrage...
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
