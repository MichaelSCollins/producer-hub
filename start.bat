@echo off
echo Checking Docker...

docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo Starting services...
docker compose down
docker compose up --build -d

echo Waiting for services to start...
timeout /t 10 /nobreak

echo Services should be running at:
echo Frontend: http://localhost:3000
echo Project Storage API: http://localhost:8081
echo Audio Storage API: http://localhost:8080

echo To check logs, use: docker compose logs 