@echo off
REM Verification Script for Bibliotheque Network Configuration

echo.
echo ========================================
echo Verification de la Configuration Reseau
echo ========================================
echo.

echo [1] Configuration Frontend:
echo.
if exist "frontend\src\shared\config\env.ts" (
    echo  API_URL dans env.ts:
    findstr "192.168" "frontend\src\shared\config\env.ts"
) else (
    echo  [ERROR] env.ts non trouve
)

echo.
echo [2] Configuration .env:
if exist "frontend\.env" (
    echo  REACT_APP_API_URL:
    findstr "192.168" "frontend\.env"
) else (
    echo  [ERROR] .env non trouve
)

echo.
echo [3] Configuration Backend:
if exist "backend\src\main\resources\application.properties" (
    echo  Server port:
    findstr "server.port=" "backend\src\main\resources\application.properties"
    echo  Server address:
    findstr "server.address=" "backend\src\main\resources\application.properties"
) else (
    echo  [ERROR] application.properties non trouve
)

echo.
echo [4] Configuration Reseau Actuelle (ipconfig):
echo.
ipconfig | findstr /R "IPv4 Address.*192"

echo.
echo ========================================
