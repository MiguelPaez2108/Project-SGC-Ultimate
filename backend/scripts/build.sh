#!/bin/bash

# Script para compilar la aplicación SGC Ultimate Backend
# Uso: ./scripts/build.sh [opciones]

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
echo "║           SGC ULTIMATE - BUILD SCRIPT                     ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./scripts/build.sh [opciones]"
    echo ""
    echo "Opciones:"
    echo "  --skip-tests    Omitir ejecución de tests"
    echo "  --clean         Limpiar antes de compilar"
    echo "  --docker        Construir imagen Docker"
    echo "  --prod          Compilar para producción"
    echo "  --help          Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/build.sh                    # Compilación normal"
    echo "  ./scripts/build.sh --skip-tests       # Sin tests"
    echo "  ./scripts/build.sh --docker           # Con imagen Docker"
    echo "  ./scripts/build.sh --clean --prod     # Limpio para producción"
}

# Valores por defecto
SKIP_TESTS=false
CLEAN=false
BUILD_DOCKER=false
PROD=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --docker)
            BUILD_DOCKER=true
            shift
            ;;
        --prod)
            PROD=true
            shift
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
echo -e "${BLUE}📦 Verificando Maven...${NC}"
if [ ! -f "./mvnw" ]; then
    echo -e "${RED}❌ Maven wrapper no encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Maven wrapper encontrado${NC}"

# Construir comando Maven
MVN_CMD="./mvnw"

if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}🧹 Limpiando proyecto...${NC}"
    MVN_CMD="$MVN_CMD clean"
fi

MVN_CMD="$MVN_CMD package"

if [ "$SKIP_TESTS" = true ]; then
    echo -e "${YELLOW}⏭️  Omitiendo tests...${NC}"
    MVN_CMD="$MVN_CMD -DskipTests"
fi

if [ "$PROD" = true ]; then
    echo -e "${YELLOW}🏭 Compilando para producción...${NC}"
    MVN_CMD="$MVN_CMD -Pprod"
fi

# Ejecutar compilación
echo -e "${BLUE}🔨 Compilando aplicación...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

$MVN_CMD

if [ $? -eq 0 ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Compilación exitosa!${NC}"
    
    # Mostrar información del JAR
    JAR_FILE=$(find target -name "*.jar" -not -name "*-sources.jar" -not -name "*-javadoc.jar" | head -n 1)
    if [ -f "$JAR_FILE" ]; then
        JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
        echo -e "${BLUE}📦 JAR generado: ${JAR_FILE} (${JAR_SIZE})${NC}"
    fi
    
    # Construir imagen Docker si se solicitó
    if [ "$BUILD_DOCKER" = true ]; then
        echo -e "${BLUE}🐳 Construyendo imagen Docker...${NC}"
        
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker no está instalado${NC}"
            exit 1
        fi
        
        docker build -t sgc-ultimate-backend:latest .
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Imagen Docker construida exitosamente!${NC}"
            echo -e "${BLUE}🏷️  Tag: sgc-ultimate-backend:latest${NC}"
            
            # Mostrar tamaño de la imagen
            IMAGE_SIZE=$(docker images sgc-ultimate-backend:latest --format "{{.Size}}")
            echo -e "${BLUE}📦 Tamaño de imagen: ${IMAGE_SIZE}${NC}"
        else
            echo -e "${RED}❌ Error al construir imagen Docker${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 Build completado exitosamente!${NC}"
    
else
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Error en la compilación${NC}"
    exit 1
fi
