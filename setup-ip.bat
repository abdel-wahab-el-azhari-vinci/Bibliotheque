@echo off
REM Configuration IP Script for Bibliotheque Project
REM Usage: setup-ip.bat <NEW_IP>

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo Usage: setup-ip.bat ^<NEW_IP^>
    echo.
    echo Example: setup-ip.bat 192.168.129.6
    echo.
    echo Current configuration:
    findstr "192.168.129.6" "frontend\src\shared\config\env.ts"
    exit /b 1
)

set NEW_IP=%1
set OLD_IP_REGEX=192\.168\.129\.6

echo Mise a jour de la configuration IP vers %NEW_IP%...

REM Update env.ts
if exist "frontend\src\shared\config\env.ts" (
    powershell -Command "(Get-Content 'frontend\src\shared\config\env.ts') -replace '192\.168\.129\.6', '%NEW_IP%' | Set-Content 'frontend\src\shared\config\env.ts'"
    echo [OK] env.ts mis a jour
) else (
    echo [ERROR] env.ts non trouve
    exit /b 1
)

REM Update .env
if exist "frontend\.env" (
    powershell -Command "(Get-Content 'frontend\.env') -replace '192\.168\.129\.6', '%NEW_IP%' | Set-Content 'frontend\.env'"
    echo [OK] .env mis a jour
) else (
    echo [ERROR] .env non trouve
    exit /b 1
)

echo.
echo ==================================================
echo [SUCCESS] Configuration IP mise a jour vers %NEW_IP%
echo ==================================================
echo.
echo Verification:
findstr "%NEW_IP%" "frontend\src\shared\config\env.ts"
echo.
