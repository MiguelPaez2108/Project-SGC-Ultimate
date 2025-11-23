#!/bin/bash

# Script para ejecutar tests del backend
# Uso: ./scripts/test.sh [opciones]

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   SGC Ultimate Test Runner            ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Verificar Maven
if [ -f "./mvnw" ]; then
    MVN_CMD="./mvnw"
else
    MVN_CMD="mvn"
fi

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./scripts/test.sh [opción]"
    echo ""
    echo "Opciones:"
    echo "  all         - Ejecutar todos los tests (default)"
    echo "  unit        - Solo tests unitarios"
    echo "  integration - Solo tests de integración"
    echo "  coverage    - Tests con reporte de cobertura"
    echo "  specific    - Ejecutar test específico (requiere nombre)"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/test.sh"
    echo "  ./scripts/test.sh unit"
    echo "  ./scripts/test.sh coverage"
    echo "  ./scripts/test.sh specific ReservaServiceTest"
}

# Función para ejecutar todos los tests
run_all_tests() {
    echo -e "${YELLOW}Ejecutando todos los tests...${NC}\n"
    $MVN_CMD test
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Todos los tests pasaron exitosamente${NC}"
    else
        echo -e "\n${RED}✗ Algunos tests fallaron${NC}"
        exit 1
    fi
}

# Función para ejecutar tests unitarios
run_unit_tests() {
    echo -e "${YELLOW}Ejecutando tests unitarios...${NC}\n"
    $MVN_CMD test -Dtest="*Test"
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Tests unitarios pasaron${NC}"
    else
        echo -e "\n${RED}✗ Tests unitarios fallaron${NC}"
        exit 1
    fi
}

# Función para ejecutar tests de integración
run_integration_tests() {
    echo -e "${YELLOW}Ejecutando tests de integración...${NC}\n"
    $MVN_CMD test -Dtest="*IntegrationTest"
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Tests de integración pasaron${NC}"
    else
        echo -e "\n${RED}✗ Tests de integración fallaron${NC}"
        exit 1
    fi
}

# Función para ejecutar tests con cobertura
run_coverage() {
    echo -e "${YELLOW}Ejecutando tests con cobertura...${NC}\n"
    $MVN_CMD clean test jacoco:report
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Tests completados${NC}"
        echo -e "${BLUE}Reporte de cobertura generado en: target/site/jacoco/index.html${NC}"
        
        # Intentar abrir el reporte automáticamente
        if command -v xdg-open &> /dev/null; then
            xdg-open target/site/jacoco/index.html
        elif command -v open &> /dev/null; then
            open target/site/jacoco/index.html
        fi
    else
        echo -e "\n${RED}✗ Tests fallaron${NC}"
        exit 1
    fi
}

# Función para ejecutar test específico
run_specific_test() {
    if [ -z "$2" ]; then
        echo -e "${RED}Error: Debes especificar el nombre del test${NC}"
        echo "Ejemplo: ./scripts/test.sh specific ReservaServiceTest"
        exit 1
    fi
    
    echo -e "${YELLOW}Ejecutando test: $2${NC}\n"
    $MVN_CMD test -Dtest="$2"
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ Test pasó exitosamente${NC}"
    else
        echo -e "\n${RED}✗ Test falló${NC}"
        exit 1
    fi
}

# Procesar argumentos
case "${1:-all}" in
    all)
        run_all_tests
        ;;
    unit)
        run_unit_tests
        ;;
    integration)
        run_integration_tests
        ;;
    coverage)
        run_coverage
        ;;
    specific)
        run_specific_test "$@"
        ;;
    help)
        show_help
        ;;
    *)
        echo -e "${RED}Opción no válida: $1${NC}"
        show_help
        exit 1
        ;;
esac

echo -e "\n${GREEN}Tests completados${NC}"
