@echo off
REM Script para ejecutar tests del backend SGC Ultimate en Windows
REM Uso: scripts\test.bat [opciones]

setlocal enabledelayedexpansion

set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

REM Banner
echo %BLUE%
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           SGC ULTIMATE - TEST RUNNER                      ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo %NC%

REM Valores por defecto
set TEST_TYPE=all
set COVERAGE=false
set TEST_CLASS=

REM Parsear argumentos
:parse_args
if "%~1"=="" goto end_parse
if "%~1"=="--unit" (
    set TEST_TYPE=unit
    shift
    goto parse_args
)
if "%~1"=="--integration" (
    set TEST_TYPE=integration
    shift
    goto parse_args
)
if "%~1"=="--coverage" (
    set COVERAGE=true
    shift
    goto parse_args
)
if "%~1"=="--class" (
    set TEST_CLASS=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--help" (
    goto show_help
)
echo %RED%❌ Opción desconocida: %~1%NC%
goto show_help

:end_parse

REM Verificar Maven
if not exist "mvnw.cmd" (
    echo %RED%❌ Maven wrapper no encontrado%NC%
    exit /b 1
)

REM Construir comando Maven
set MVN_CMD=mvnw.cmd test

if not "%TEST_CLASS%"=="" (
    echo %YELLOW%🎯 Ejecutando test: %TEST_CLASS%%NC%
    set MVN_CMD=%MVN_CMD% -Dtest=%TEST_CLASS%
) else if "%TEST_TYPE%"=="unit" (
    echo %YELLOW%🧪 Ejecutando tests unitarios...%NC%
    set MVN_CMD=%MVN_CMD% -Dtest=**/*Test
) else if "%TEST_TYPE%"=="integration" (
    echo %YELLOW%🔗 Ejecutando tests de integración...%NC%
    set MVN_CMD=%MVN_CMD% -Dtest=**/*IntegrationTest
) else (
    echo %YELLOW%🧪 Ejecutando todos los tests...%NC%
)

if "%COVERAGE%"=="true" (
    echo %BLUE%📊 Generando reporte de cobertura...%NC%
    set MVN_CMD=%MVN_CMD% jacoco:report
)

REM Ejecutar tests
echo %BLUE%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%

call %MVN_CMD%
set TEST_RESULT=%ERRORLEVEL%

echo %BLUE%━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%NC%

if %TEST_RESULT% EQU 0 (
    echo %GREEN%✅ Todos los tests pasaron exitosamente!%NC%
    
    if "%COVERAGE%"=="true" (
        echo %BLUE%📊 Reporte de cobertura generado en: target\site\jacoco\index.html%NC%
        start target\site\jacoco\index.html
    )
) else (
    echo %RED%❌ Algunos tests fallaron%NC%
    exit /b 1
)

goto :eof

:show_help
echo Uso: scripts\test.bat [opciones]
echo.
echo Opciones:
echo   --unit          Ejecutar solo tests unitarios
echo   --integration   Ejecutar solo tests de integración
echo   --coverage      Generar reporte de cobertura
echo   --class ^<name^>  Ejecutar una clase de test específica
echo   --help          Mostrar esta ayuda
echo.
echo Ejemplos:
echo   scripts\test.bat                           # Todos los tests
echo   scripts\test.bat --unit                    # Solo unitarios
echo   scripts\test.bat --coverage                # Con cobertura
echo   scripts\test.bat --class ReservaServiceTest # Test específico
exit /b 0

endlocal
