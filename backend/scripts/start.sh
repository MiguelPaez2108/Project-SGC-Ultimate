#!/bin/bash

# Script para iniciar el backend de SGC Ultimate
# Uso: ./scripts/start.sh [perfil]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║   SGC Ultimate Backend Starter        ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Obtener perfil (default: dev)
PROFILE=${1:-dev}
echo -e "${YELLOW}Perfil seleccionado: ${PROFILE}${NC}"

# Verificar Java
echo -e "\n${YELLOW}Verificando Java...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java no está instalado${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 21 ]; then
    echo -e "${RED}Error: Se requiere Java 21 o superior${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java $(java -version 2>&1 | head -n 1)${NC}"

# Verificar Maven
echo -e "\n${YELLOW}Verificando Maven...${NC}"
if [ -f "./mvnw" ]; then
    MVN_CMD="./mvnw"
    echo -e "${GREEN}✓ Usando Maven Wrapper${NC}"
elif command -v mvn &> /dev/null; then
    MVN_CMD="mvn"
    echo -e "${GREEN}✓ Maven instalado${NC}"
else
    echo -e "${RED}Error: Maven no está disponible${NC}"
    exit 1
fi

# Verificar MongoDB
echo -e "\n${YELLOW}Verificando MongoDB...${NC}"
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
        echo -e "${GREEN}✓ MongoDB está corriendo${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB no está corriendo. Intentando iniciar con Docker...${NC}"
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d mongodb
            echo -e "${GREEN}✓ MongoDB iniciado con Docker${NC}"
            sleep 5
        else
            echo -e "${RED}Error: MongoDB no está corriendo y Docker Compose no está disponible${NC}"
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠ mongosh no está instalado, asumiendo MongoDB está corriendo${NC}"
fi

# Verificar archivo .env
echo -e "\n${YELLOW}Verificando configuración...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Archivo .env no encontrado, creando desde .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Archivo .env creado${NC}"
        echo -e "${YELLOW}⚠ Por favor, revisa y actualiza las variables en .env${NC}"
    else
        echo -e "${RED}Error: .env.example no encontrado${NC}"
        exit 1
    fi
fi

# Limpiar y compilar
echo -e "\n${YELLOW}Compilando proyecto...${NC}"
$MVN_CMD clean package -DskipTests
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Compilación exitosa${NC}"
else
    echo -e "${RED}Error en la compilación${NC}"
    exit 1
fi

# Iniciar aplicación
echo -e "\n${GREEN}Iniciando aplicación con perfil: ${PROFILE}${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}\n"

# Cargar variables de entorno
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Ejecutar aplicación
$MVN_CMD spring-boot:run -Dspring-boot.run.profiles=$PROFILE
