#!/bin/bash

# Script para iniciar la aplicación SGC Ultimate Backend
# Uso: ./scripts/start.sh [perfil]
# Ejemplo: ./scripts/start.sh dev

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           SGC ULTIMATE - BACKEND STARTER                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar perfil
PROFILE=${1:-dev}
echo -e "${YELLOW}📋 Perfil seleccionado: ${PROFILE}${NC}"

# Verificar Java
echo -e "${BLUE}☕ Verificando Java...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java no está instalado. Por favor instala Java 21 o superior.${NC}"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 21 ]; then
    echo -e "${RED}❌ Se requiere Java 21 o superior. Versión actual: ${JAVA_VERSION}${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java ${JAVA_VERSION} detectado${NC}"

# Verificar Maven
echo -e "${BLUE}📦 Verificando Maven...${NC}"
if [ ! -f "./mvnw" ]; then
    echo -e "${RED}❌ Maven wrapper no encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Maven wrapper encontrado${NC}"

# Verificar archivo .env
echo -e "${BLUE}🔧 Verificando configuración...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Creando desde .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Archivo .env creado. Por favor configura tus variables de entorno.${NC}"
    else
        echo -e "${RED}❌ Archivo .env.example no encontrado${NC}"
        exit 1
    fi
fi

# Cargar variables de entorno
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Verificar MongoDB
echo -e "${BLUE}🍃 Verificando MongoDB...${NC}"
if [ "$PROFILE" != "test" ]; then
    if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
        echo -e "${YELLOW}⚠️  MongoDB CLI no encontrado. Intentando conectar de todas formas...${NC}"
    else
        # Intentar conectar a MongoDB
        MONGO_CMD=$(command -v mongosh || command -v mongo)
        if ! $MONGO_CMD --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
            echo -e "${YELLOW}⚠️  No se puede conectar a MongoDB. ¿Deseas iniciar MongoDB con Docker? (y/n)${NC}"
            read -r response
            if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
                echo -e "${BLUE}🐳 Iniciando MongoDB con Docker Compose...${NC}"
                docker-compose up -d mongodb
                echo -e "${GREEN}✅ MongoDB iniciado${NC}"
                sleep 5
            else
                echo -e "${RED}❌ MongoDB no está disponible. La aplicación puede fallar al iniciar.${NC}"
            fi
        else
            echo -e "${GREEN}✅ MongoDB está disponible${NC}"
        fi
    fi
fi

# Limpiar y compilar
echo -e "${BLUE}🔨 Compilando aplicación...${NC}"
./mvnw clean package -DskipTests -q
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Compilación exitosa${NC}"
else
    echo -e "${RED}❌ Error en la compilación${NC}"
    exit 1
fi

# Iniciar aplicación
echo -e "${BLUE}🚀 Iniciando aplicación en modo ${PROFILE}...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$PROFILE" = "dev" ]; then
    # Modo desarrollo con hot reload
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
elif [ "$PROFILE" = "prod" ]; then
    # Modo producción
    java -jar target/*.jar --spring.profiles.active=prod
else
    # Perfil personalizado
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=$PROFILE
fi
