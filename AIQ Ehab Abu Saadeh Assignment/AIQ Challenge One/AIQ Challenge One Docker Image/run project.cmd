@echo off
cd /d "%~dp0"

REM Unzip AIQ REST image
echo Unzipping aiq-rest image...
powershell Expand-Archive -Path aiq-rest.zip -DestinationPath aiq-rest

REM Unzip AIQ REST DB image
echo Unzipping aiq-rest-db image...
powershell Expand-Archive -Path aiq-rest-db.zip -DestinationPath aiq-rest-db

echo Loading aiq-rest image...
docker load -i aiq-rest\aiq-rest.tar

echo Loading aiq-rest-db image...
docker load -i aiq-rest-db\aiq-rest-db.tar

echo Starting aiq-rest-db container...
docker run -d --name aiq-rest-db aiq-rest-db:latest

echo Waiting for aiq-rest-db container to be ready...
:check_db
docker exec aiq-rest-db pg_isready -U postgres -h localhost >/dev/null 2>&1
if %errorlevel% neq 0 (
    echo Database container is not ready yet, retrying in 5 seconds...
    timeout /t 5 > nul
    goto check_db
)

echo Starting aiq-rest container, linking to aiq-rest-db...
docker run -d --name aiq-rest --link aiq-rest-db -p 8080:8080 aiq-rest:latest

echo Waiting for aiq-rest container to start...
timeout /t 10 > nul

echo Opening Swagger UI...
start http://localhost:8080/api-docs

echo Docker containers are now running.
pause
