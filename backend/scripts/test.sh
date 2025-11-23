#!/bin/bash

# Script para ejecutar tests del backend SGC Ultimate
# Uso: ./scripts/test.sh [opciones]
# Opciones:
#   --unit       : Solo tests unitarios
#   --integration: Solo tests de integración
#   --coverage   : Generar reporte de cobertura
#   --watch      : Modo watch (re-ejecutar en cambios)

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           SGC ULTIMATE - TEST RUNNER                      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./scripts/test.sh [opciones]"
    echo ""
    echo "Opciones:"
    echo "  --unit          Ejecutar solo tests unitarios"
    echo "  --integration   Ejecutar solo tests de integración"
    echo "  --coverage      Generar reporte de cobertura"
    echo "  --watch         Modo watch (re-ejecutar en cambios)"
    echo "  --class <name>  Ejecutar una clase de test específica"
    echo "  --help          Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/test.sh                           # Todos los tests"
    echo "  ./scripts/test.sh --unit                    # Solo unitarios"
    echo "  ./scripts/test.sh --coverage                # Con cobertura"
    echo "  ./scripts/test.sh --class ReservaServiceTest # Test específico"
}

# Parsear argumentos
TEST_TYPE="all"
COVERAGE=false
WATCH=false
TEST_CLASS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_TYPE="unit"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --class)
            TEST_CLASS="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opción desconocida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Verificar Maven
if [ ! -f "./mvnw" ]; then
    echo -e "${RED}❌ Maven wrapper no encontrado${NC}"
    exit 1
fi

# Construir comando Maven
MVN_CMD="./mvnw test"

if [ "$TEST_CLASS" != "" ]; then
    echo -e "${YELLOW}🎯 Ejecutando test: ${TEST_CLASS}${NC}"
    MVN_CMD="$MVN_CMD -Dtest=${TEST_CLASS}"
elif [ "$TEST_TYPE" = "unit" ]; then
    echo -e "${YELLOW}🧪 Ejecutando tests unitarios...${NC}"
    MVN_CMD="$MVN_CMD -Dtest=**/*Test"
elif [ "$TEST_TYPE" = "integration" ]; then
    echo -e "${YELLOW}🔗 Ejecutando tests de integración...${NC}"
    MVN_CMD="$MVN_CMD -Dtest=**/*IntegrationTest"
else
    echo -e "${YELLOW}🧪 Ejecutando todos los tests...${NC}"
fi

if [ "$COVERAGE" = true ]; then
    echo -e "${BLUE}📊 Generando reporte de cobertura...${NC}"
    MVN_CMD="$MVN_CMD jacoco:report"
fi

# Ejecutar tests
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$WATCH" = true ]; then
    echo -e "${YELLOW}👀 Modo watch activado. Presiona Ctrl+C para salir.${NC}"
    while true; do
        $MVN_CMD
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}⏳ Esperando cambios... (Ctrl+C para salir)${NC}"
        sleep 5
    done
else
    $MVN_CMD
    TEST_RESULT=$?
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ $TEST_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Todos los tests pasaron exitosamente!${NC}"
        
        if [ "$COVERAGE" = true ]; then
            echo -e "${BLUE}📊 Reporte de cobertura generado en: target/site/jacoco/index.html${NC}"
            
            # Intentar abrir el reporte automáticamente
            if command -v xdg-open &> /dev/null; then
                xdg-open target/site/jacoco/index.html &> /dev/null &
            elif command -v open &> /dev/null; then
                open target/site/jacoco/index.html &> /dev/null &
            fi
        fi
    else
        echo -e "${RED}❌ Algunos tests fallaron${NC}"
        exit 1
    fi
fi
