@echo off
echo Lancement EventFire...

:: ── 1. Démarrer MongoDB via Docker ────────────────────────────────────────
echo Démarrage de MongoDB (Docker)...
docker start mongodb >nul 2>&1
if %errorlevel% neq 0 (
    echo Conteneur "mongodb" inexistant, création...
    docker run -d --name mongodb -p 27017:27017 mongo:latest
)
echo MongoDB prêt.

:: ── 2. Démarrer le Backend ─────────────────────────────────────────────────
timeout /t 3 /nobreak > nul
start "Backend - EventFire" cmd /k "cd /d "d:\4A-2025.2026\4A-Mansouri\Dev_fullstack\Projet_full_stack_EventFire\EventFire\backend" && npm run dev"

:: ── 3. Démarrer le Frontend ────────────────────────────────────────────────
timeout /t 3 /nobreak > nul
start "Frontend - EventFire" cmd /k "cd /d "d:\4A-2025.2026\4A-Mansouri\Dev_fullstack\Projet_full_stack_EventFire\EventFire\frontend" && npm run dev"

echo.
echo Les serveurs sont en cours de demarrage...
echo MongoDB:  mongodb://localhost:27017
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
