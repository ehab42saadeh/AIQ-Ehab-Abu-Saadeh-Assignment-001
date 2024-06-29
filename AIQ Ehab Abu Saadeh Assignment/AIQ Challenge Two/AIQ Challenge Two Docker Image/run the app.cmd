@echo off
echo Starting application setup...

REM Change directory to the script's directory
cd /d "%~dp0"

REM Unzip Docker image files
echo Unzipping aiqchallengetwo-server Docker image...
powershell Expand-Archive -Path aiqchallengetwo-server.zip -DestinationPath aiqchallengetwo-server
echo aiqchallengetwo-server Docker image unzipped successfully.

echo Unzipping postgres Docker image...
powershell Expand-Archive -Path postgres.zip -DestinationPath postgres
echo postgres Docker image unzipped successfully.

REM Load Docker images
echo Loading aiqchallengetwo-server Docker image...
docker load -i aiqchallengetwo-server\aiqchallengetwo-server.tar
echo aiqchallengetwo-server Docker image loaded successfully.

echo Loading postgres Docker image...
docker load -i postgres\postgres.tar
echo postgres Docker image loaded successfully.

REM Run Docker containers
echo Starting postgres container...
docker run -d --name postgres postgres:latest
echo postgres container started successfully.

echo Starting aiqchallengetwo-server container...
docker run -d --name aiqchallengetwo-server --link postgres -p 5000:5000 aiqchallengetwo-server:latest
echo aiqchallengetwo-server container started successfully.

REM Open Swagger UI in default web browser
echo Opening Swagger UI in default web browser...
start http://localhost:5000/swagger-ui

echo Application setup completed.
