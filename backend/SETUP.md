# Setup Guide - SGC Ultimate Backend

Guía completa de configuración e instalación del backend.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Configuración Detallada](#configuración-detallada)
- [Ejecución](#ejecución)
- [Verificación](#verificación)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

### Software Requerido

- **Java 21** o superior
  - Verificar: `java -version`
  - Descargar: https://adoptium.net/

- **Maven 3.8+** (incluido como wrapper)
  - Verificar: `./mvnw -version`

- **MongoDB 6.0+**
  - Opción 1: Instalación local
  - Opción 2: Docker (recomendado)
  - Verificar: `mongosh --version`

- **Git**
  - Verificar: `git --version`

### Software Opcional

- **Docker & Docker Compose** (recomendado)
  - Para ejecutar MongoDB y la aplicación en contenedores
  - Verificar: `docker --version` y `docker-compose --version`

- **IDE** (recomendado)
  - IntelliJ IDEA
  - Eclipse
  - VS Code con extensiones Java

## 🚀 Instalación Rápida

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd backend

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Iniciar todo con Docker Compose
docker-compose up -d

# 4. Ver logs
docker-compose logs -f backend
```

La aplicación estará disponible en: http://localhost:8080

### Opción 2: Instalación Local

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd backend

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Iniciar MongoDB (si no está corriendo)
# En Windows:
net start MongoDB
# En Linux/Mac:
sudo systemctl start mongod

# 4. Compilar y ejecutar
./mvnw spring-boot:run

# En Windows:
mvnw.cmd spring-boot:run
```

## ⚙️ Configuración Detallada

### 1. Variables de Entorno

Edita el archivo `.env` con tus configuraciones:

```env
# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_segura_de_al_menos_32_caracteres
JWT_EXPIRATION=86400000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/project_sgc_ultimate

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Perfiles de Spring

El proyecto incluye tres perfiles:

#### Desarrollo (dev)
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
- Logs detallados
- Hot reload habilitado
- Datos de prueba iniciales
- Swagger UI habilitado

#### Producción (prod)
```bash
java -jar target/*.jar --spring.profiles.active=prod
```
- Logs optimizados
- Seguridad reforzada
- Sin datos de prueba
- Swagger UI deshabilitado

#### Testing (test)
```bash
./mvnw test -Dspring.profiles.active=test
```
- MongoDB embebido
- Logs mínimos
- Datos de prueba

### 3. Base de Datos MongoDB

#### Opción A: Docker (Recomendado)

```bash
# Iniciar solo MongoDB
docker-compose up -d mongodb

# Verificar que está corriendo
docker-compose ps

# Acceder a MongoDB shell
docker exec -it sgc-mongodb mongosh
```

#### Opción B: Instalación Local

**Windows:**
```bash
# Descargar desde: https://www.mongodb.com/try/download/community
# Instalar y ejecutar como servicio
net start MongoDB
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Verificar Conexión

```bash
# Usando mongosh
mongosh mongodb://localhost:27017

# Verificar base de datos
use project_sgc_ultimate
show collections
```

### 4. Configuración del IDE

#### IntelliJ IDEA

1. Abrir el proyecto (File > Open > seleccionar carpeta backend)
2. Esperar a que Maven descargue dependencias
3. Configurar JDK 21 (File > Project Structure > Project SDK)
4. Instalar plugins recomendados:
   - Lombok
   - Spring Boot
   - MongoDB

#### VS Code

1. Instalar extensiones:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support
2. Abrir carpeta backend
3. Configurar Java 21 en settings.json

#### Eclipse

1. Importar proyecto Maven (File > Import > Maven > Existing Maven Projects)
2. Instalar Lombok:
   - Descargar lombok.jar
   - Ejecutar: `java -jar lombok.jar`
3. Configurar JDK 21

## 🏃 Ejecución

### Usando Scripts (Recomendado)

**Linux/Mac:**
```bash
# Iniciar aplicación
./scripts/start.sh dev

# Ejecutar tests
./scripts/test.sh --coverage

# Compilar
./scripts/build.sh --clean
```

**Windows:**
```cmd
REM Iniciar aplicación
scripts\start.bat dev

REM Ejecutar tests
scripts\test.bat --coverage

REM Compilar
scripts\build.bat --clean
```

### Usando Maven Directamente

```bash
# Limpiar y compilar
./mvnw clean install

# Ejecutar aplicación
./mvnw spring-boot:run

# Ejecutar tests
./mvnw test

# Generar JAR
./mvnw package

# Ejecutar JAR
java -jar target/sgc-ultimate-1.0.0.jar
```

### Usando Docker

```bash
# Construir imagen
docker build -t sgc-ultimate-backend .

# Ejecutar contenedor
docker run -p 8080:8080 --env-file .env sgc-ultimate-backend

# O usar Docker Compose
docker-compose up
```

## ✅ Verificación

### 1. Verificar que la aplicación está corriendo

```bash
# Health check
curl http://localhost:8080/api/health

# Respuesta esperada:
# {"status":"UP","timestamp":"2024-01-15T10:00:00Z","version":"1.0.0"}
```

### 2. Acceder a Swagger UI

Abrir en navegador: http://localhost:8080/swagger-ui.html

### 3. Probar endpoints básicos

```bash
# Registrar usuario
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "telefono": "123456789"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Verificar MongoDB

```bash
# Conectar a MongoDB
mongosh mongodb://localhost:27017/project_sgc_ultimate

# Verificar colecciones
show collections

# Ver usuarios
db.usuarios.find().pretty()
```

### 5. Verificar Logs

```bash
# Ver logs en tiempo real
tail -f logs/sgc-dev.log

# En Docker
docker-compose logs -f backend
```

## 🐛 Troubleshooting

### Error: "Port 8080 already in use"

**Solución 1:** Cambiar puerto en `.env`
```env
SERVER_PORT=8081
```

**Solución 2:** Matar proceso en puerto 8080
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Error: "MongoDB connection refused"

**Verificar que MongoDB está corriendo:**
```bash
# Docker
docker-compose ps mongodb

# Local (Windows)
net start MongoDB

# Local (Linux/Mac)
sudo systemctl status mongod
```

**Verificar URI de conexión:**
```env
# En .env
MONGODB_URI=mongodb://localhost:27017/project_sgc_ultimate
```

### Error: "Java version mismatch"

**Verificar versión de Java:**
```bash
java -version
# Debe ser 21 o superior
```

**Configurar JAVA_HOME:**
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-21

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
```

### Error: "Maven dependencies not downloading"

**Limpiar cache de Maven:**
```bash
./mvnw dependency:purge-local-repository
./mvnw clean install
```

### Error: "Tests failing"

**Ejecutar tests con más información:**
```bash
./mvnw test -X
```

**Verificar MongoDB de test:**
```bash
# Asegurarse de usar perfil test
./mvnw test -Dspring.profiles.active=test
```

### Error: "Out of memory"

**Aumentar memoria de JVM:**
```bash
# En .env o como variable de entorno
export JAVA_OPTS="-Xms512m -Xmx1024m"

# O al ejecutar
java -Xms512m -Xmx1024m -jar target/*.jar
```

### Logs no se generan

**Verificar permisos:**
```bash
# Crear directorio de logs
mkdir -p logs
chmod 755 logs
```

**Verificar configuración:**
```properties
# En application.properties
logging.file.name=logs/sgc-dev.log
```

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación principal
- [API.md](API.md) - Documentación de API
- [TESTING.md](TESTING.md) - Guía de testing
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de contribución
- [CHANGELOG.md](CHANGELOG.md) - Historial de cambios

## 🆘 Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Revisa los [Issues en GitHub](https://github.com/tu-repo/issues)
2. Consulta la [documentación de Spring Boot](https://spring.io/projects/spring-boot)
3. Contacta al equipo: support@sgcultimate.com

## ✨ Próximos Pasos

Una vez que la aplicación esté corriendo:

1. ✅ Explorar la API con Swagger UI
2. ✅ Ejecutar los tests
3. ✅ Revisar la documentación de API
4. ✅ Configurar el frontend
5. ✅ Comenzar a desarrollar nuevas funcionalidades

¡Feliz desarrollo! 🚀
