@echo off
REM Script para iniciar la aplicación SGC Ultimate Backend en Windows
REM Uso: scripts\start.bat [perfil]
REM Ejemplo: scripts\start.bat dev

setlocal enabledelayedexpansion

REM Colores (limitados en CMD)
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

REM Banner
echo %BLUE%
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           SGC ULTIMATE - BACKEND STARTER                  ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo %NC%

REM Verificar perfil
set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=dev
echo %YELLOW%📋 Perfil seleccionado: %PROFILE%%NC%

REM Verificar Java
echo %BLUE%☕ Verificando Java...%NC%
java -version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Java no está instalado. Por favor instala Java 21 o superior.%NC%
    exit /b 1
)
echo %GREEN%✅ Java detectado%NC%

REM Verificar Maven wrapper
echo %BLUE%📦 Verificando Maven...%NC%
if not exist "mvnw.cmd" (
    echo %RED%❌ Maven wrapper no encontrado%NC%
    exit /b 1
)
echo %GREEN%✅ Maven wrapper encontrado%NC%

REM Verificar archivo .env
echo %BLUE%🔧 Verificando configuración...%NC%
if not exist ".env" (
    echo %YELLOW%⚠️  Archivo .env no encontrado. Creando desde .env.example...%NC%
    if exist ".env.example" (
        copy .env.example .env >nul
        echo %GREEN%✅ Archivo .env creado. Por favor configura tus variables de entorno.%NC%
    ) else (
        echo %RED%❌ Archivo .env.example no encontrado%NC%
        exit /b 1
    )
)

REM Verificar MongoDB
echo %BLUE%🍃 Verificando MongoDB...%NC%
if not "%PROFILE%"=="test" (
    mongosh --eval "db.adminCommand('ping')" --quiet >nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%⚠️  No se puede conectar a MongoDB.%NC%
        echo %YELLOW%¿Deseas iniciar MongoDB con Docker? (S/N)%NC%
        set /p response=
        if /i "!response!"=="S" (
            echo %BLUE%🐳 Iniciando MongoDB con Docker Compose...%NC%
            docker-compose up -d mongodb
            echo %GREEN%✅ MongoDB iniciado%NC%
            timeout /t 5 /nobreak >nul
        ) else (
            echo %RED%❌ MongoDB no está disponible. La aplicación puede fallar al iniciar.%NC%
        )
    ) else (
        echo %GREEN%✅ MongoDB está disponible%NC%
    )
)

REM Limpiar y compilar
echo %BLUE%🔨 Compilando aplicación...%NC%
call mvnw.cmd clean package -DskipTests -q
if errorlevel 1 (
    echo %RED%❌ Error en la compilación%NC%
    exit /b 1
)
echo %GREEN%✅ Compilación exitosa%NC%

REM Iniciar aplicación
echo %BLUE%🚀 Iniciando aplicación en modo %PROFILE%...%NC%
echo %YELLOW%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%

if "%PROFILE%"=="dev" (
    REM Modo desarrollo con hot reload
    call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
) else if "%PROFILE%"=="prod" (
    REM Modo producción
    for %%f in (target\*.jar) do (
        java -jar %%f --spring.profiles.active=prod
    )
) else (
    REM Perfil personalizado
    call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=%PROFILE%
)

endlocal
