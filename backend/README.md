# SGC Ultimate - Backend

Sistema de Gestión de Canchas - API REST Backend

## 📋 Descripción

Backend del sistema SGC Ultimate, una aplicación para la gestión integral de canchas deportivas. Incluye gestión de reservas, pagos, usuarios, horarios, notificaciones y auditoría.

## 🚀 Tecnologías

- **Java 21**
- **Spring Boot 3.5.7**
- **MongoDB** - Base de datos NoSQL
- **Spring Security** - Autenticación y autorización
- **JWT** - JSON Web Tokens para autenticación
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate
- **SpringDoc OpenAPI** - Documentación de API
- **JaCoCo** - Cobertura de código

## 📦 Requisitos Previos

- Java 21 o superior
- Maven 3.8+ (o usar el wrapper incluido)
- MongoDB 6.0+ (o usar Docker Compose)
- Git

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd backend
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
MONGODB_URI=mongodb://localhost:27017/project_sgc_ultimate
JWT_SECRET=tu_clave_secreta_muy_segura_de_al_menos_32_caracteres
SERVER_PORT=8080
```

### 3. Iniciar MongoDB

**Opción A: Usando Docker Compose (Recomendado)**

```bash
docker-compose up -d
```

**Opción B: MongoDB local**

Asegúrate de tener MongoDB corriendo en `localhost:27017`

### 4. Compilar el proyecto

```bash
./mvnw clean install
```

O en Windows:

```cmd
mvnw.cmd clean install
```

### 5. Ejecutar la aplicación

**Modo desarrollo:**

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Modo producción:**

```bash
java -jar target/sgc-ultimate-1.0.0.jar --spring.profiles.active=prod
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t sgc-ultimate-backend .
```

### Ejecutar con Docker Compose

```bash
docker-compose up
```

Esto iniciará:
- MongoDB en puerto 27017
- Backend en puerto 8080

## 📚 Documentación de API

Una vez iniciada la aplicación, accede a:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🔐 Autenticación

La API usa JWT para autenticación. Para acceder a endpoints protegidos:

1. **Registrarse**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Usar el token**: Incluir en header `Authorization: Bearer <token>`

### Ejemplo de registro:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "123456789"
  }'
```

### Ejemplo de login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

## 🛣️ Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Canchas
- `GET /api/canchas` - Listar canchas
- `GET /api/canchas/{id}` - Obtener cancha
- `POST /api/canchas` - Crear cancha (ADMIN)
- `PUT /api/canchas/{id}` - Actualizar cancha (ADMIN)
- `DELETE /api/canchas/{id}` - Eliminar cancha (ADMIN)

### Reservas
- `GET /api/reservas` - Listar reservas
- `GET /api/reservas/{id}` - Obtener reserva
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/{id}` - Actualizar reserva
- `DELETE /api/reservas/{id}` - Cancelar reserva

### Pagos
- `GET /api/pagos` - Listar pagos
- `GET /api/pagos/{id}` - Obtener pago
- `POST /api/pagos` - Registrar pago
- `PUT /api/pagos/{id}/confirmar` - Confirmar pago (ADMIN)

### Usuarios (ADMIN)
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/{id}` - Obtener usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Horarios (ADMIN)
- `GET /api/horarios` - Listar horarios
- `POST /api/horarios` - Crear horario
- `PUT /api/horarios/{id}` - Actualizar horario
- `DELETE /api/horarios/{id}` - Eliminar horario

### Notificaciones
- `GET /api/notificaciones` - Listar notificaciones
- `PUT /api/notificaciones/{id}/leida` - Marcar como leída

### Auditoría (ADMIN)
- `GET /api/auditorias` - Listar registros de auditoría

### Health Check
- `GET /api/health` - Estado de la aplicación
- `GET /actuator/health` - Actuator health endpoint

## 🧪 Testing

### Ejecutar todos los tests

```bash
./mvnw test
```

### Ejecutar tests con cobertura

```bash
./mvnw test jacoco:report
```

Ver reporte en: `target/site/jacoco/index.html`

### Ejecutar test específico

```bash
./mvnw test -Dtest=ReservaServiceTest
```

### Ejecutar tests de integración

```bash
./mvnw verify
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/project_sgc_ultimate/
│   │   │   ├── config/           # Configuraciones
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── exception/        # Manejo de excepciones
│   │   │   ├── model/            # Modelos de dominio
│   │   │   ├── repository/       # Repositorios MongoDB
│   │   │   ├── security/         # Seguridad y JWT
│   │   │   └── service/          # Lógica de negocio
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/
│       └── java/com/project_sgc_ultimate/
│           ├── controller/       # Tests de controladores
│           └── service/          # Tests de servicios
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── pom.xml
├── README.md
└── TESTING.md
```

## 🔒 Seguridad

- **JWT**: Tokens con expiración de 24 horas
- **BCrypt**: Encriptación de contraseñas
- **CORS**: Configurado para frontend en localhost:5173
- **HTTPS**: Recomendado en producción
- **Rate Limiting**: Implementar en producción

### Variables de entorno sensibles

**NUNCA** commitear:
- `JWT_SECRET`
- Credenciales de MongoDB
- API keys de servicios externos

## 🌍 Perfiles de Spring

### Desarrollo (dev)
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
- Logs detallados
- MongoDB local
- Hot reload habilitado

### Producción (prod)
```bash
java -jar target/sgc-ultimate-1.0.0.jar --spring.profiles.active=prod
```
- Logs optimizados
- MongoDB remoto
- Seguridad reforzada

### Testing (test)
```bash
./mvnw test -Dspring.profiles.active=test
```
- MongoDB embebido
- Datos de prueba

## 📊 Monitoreo

### Actuator Endpoints

- `/actuator/health` - Estado de salud
- `/actuator/info` - Información de la aplicación
- `/actuator/metrics` - Métricas

## 🐛 Troubleshooting

### Error: MongoDB connection refused

```bash
# Verificar que MongoDB esté corriendo
docker-compose ps

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Error: Port 8080 already in use

```bash
# Cambiar puerto en application<create_file>
<path>backend/README.md</path>
<content>
# SGC Ultimate Backend

Sistema de Gestión de Canchas - Backend API REST desarrollado con Spring Boot 3.5.7

## 📋 Descripción

SGC Ultimate es una plataforma completa para la gestión de reservas de canchas deportivas. Este backend proporciona una API RESTful que maneja autenticación, reservas, pagos, notificaciones y auditoría del sistema.

## 🚀 Características Principales

- **Autenticación JWT** - Sistema seguro de autenticación y autorización
- **Gestión de Canchas** - CRUD completo de canchas deportivas
- **Sistema de Reservas** - Reserva y gestión de horarios
- **Procesamiento de Pagos** - Integración con sistema de pagos
- **Notificaciones** - Sistema de notificaciones push
- **Auditoría** - Registro completo de todas las operaciones
- **API Documentada** - Documentación OpenAPI/Swagger
- **Base de Datos MongoDB** - Almacenamiento NoSQL escalable

## 🛠️ Tecnologías Utilizadas

- **Java 21** - Lenguaje de programación
- **Spring Boot 3.5.7** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT (JJWT)** - Tokens de autenticación
- **MongoDB** - Base de datos NoSQL
- **Spring Data MongoDB** - ORM para MongoDB
- **Spring Validation** - Validación de datos
- **SpringDoc OpenAPI** - Documentación de API
- **Lombok** - Reducción de código boilerplate
- **JUnit 5** - Testing framework
- **JaCoCo** - Cobertura de código
- **Maven** - Gestión de dependencias

## 📋 Prerrequisitos

- **Java 21** o superior
- **Maven 3.6+**
- **MongoDB 4.4+** (local o Docker)
- **Git**

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd backend
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Ejecutar con Docker (Recomendado)
```bash
# Levantar MongoDB y la aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f backend
```

### 4. Ejecutar localmente
```bash
# Instalar dependencias
./mvnw clean install

# Ejecutar aplicación
./mvnw spring-boot:run
```

### 5. Ejecutar tests
```bash
# Ejecutar todos los tests
./mvnw test

# Ejecutar con cobertura
./mvnw test jacoco:report

# Ver reporte de cobertura en target/site/jacoco/index.html
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# JWT Configuration
JWT_SECRET=tu_clave_jwt_muy_segura_de_al_menos_32_caracteres

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/project_sgc_ultimate

# Server Configuration
SERVER_PORT=8080

# Logging
LOG_LEVEL=DEBUG
```

### Perfiles de Spring

- **dev** - Desarrollo (logs detallados, H2 si es necesario)
- **prod** - Producción (logs optimizados, configuraciones seguras)
- **test** - Testing (base de datos en memoria)

```bash
# Ejecutar con perfil específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📚 API Documentation

Una vez ejecutada la aplicación, accede a la documentación:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh` - Refrescar token

#### Canchas
- `GET /api/canchas` - Listar canchas
- `POST /api/canchas` - Crear cancha (Admin)
- `PUT /api/canchas/{id}` - Actualizar cancha (Admin)
- `DELETE /api/canchas/{id}` - Eliminar cancha (Admin)

#### Reservas
- `GET /api/reservas` - Mis reservas
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/{id}` - Actualizar reserva
- `DELETE /api/reservas/{id}` - Cancelar reserva

#### Usuarios
- `GET /api/usuarios` - Listar usuarios (Admin)
- `GET /api/usuarios/{id}` - Detalles de usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario

#### Pagos
- `GET /api/pagos` - Mis pagos
- `POST /api/pagos` - Procesar pago
- `GET /api/pagos/{id}` - Detalles de pago

#### Notificaciones
- `GET /api/notificaciones` - Mis notificaciones
- `PUT /api/notificaciones/{id}/read` - Marcar como leída

#### Auditoría (Admin)
- `GET /api/auditoria` - Ver logs de auditoría

## 🏗️ Arquitectura

```
src/main/java/com/project_sgc_ultimate/
├── config/           # Configuraciones de Spring
├── controller/       # Controladores REST
├── dto/             # Objetos de Transferencia de Datos
├── exception/       # Manejo global de excepciones
├── model/           # Modelos de dominio
├── repository/      # Repositorios de datos
├── security/        # Configuración de seguridad
└── service/         # Lógica de negocio
```

### Capas de la Arquitectura

1. **Controller Layer** - Maneja requests HTTP, validación de entrada
2. **Service Layer** - Contiene la lógica de negocio
3. **Repository Layer** - Acceso a datos con MongoDB
4. **DTO Layer** - Transferencia de datos entre capas
5. **Security Layer** - Autenticación y autorización JWT
6. **Exception Layer** - Manejo centralizado de errores

## 🧪 Testing

### Estrategia de Testing

- **Unit Tests** - Servicios y utilidades
- **Integration Tests** - Controladores y repositorios
- **Coverage Goal** - 80%+ cobertura de código

### Ejecutar Tests

```bash
# Tests unitarios
./mvnw test -Dtest="*Test"

# Tests de integración
./mvnw test -Dtest="*IntegrationTest"

# Tests con cobertura
./mvnw clean verify
```

## 🚀 Despliegue

### Docker

```bash
# Construir imagen
docker build -t sgc-ultimate-backend .

# Ejecutar contenedor
docker run -p 8080:8080 --env-file .env sgc-ultimate-backend
```

### Docker Compose (Completo)

```bash
# Ambiente completo (Backend + MongoDB)
docker-compose up -d

# Solo backend
docker-compose up -d backend

# Ver logs
docker-compose logs -f
```

### Producción

1. Configurar variables de entorno de producción
2. Usar perfil `prod`
3. Configurar reverse proxy (nginx)
4. Configurar SSL/TLS
5. Configurar monitoring (actuator endpoints)

## 🔒 Seguridad

- **JWT Authentication** - Tokens seguros con expiración
- **Role-based Access Control** - Control de acceso por roles
- **Password Encryption** - BCrypt para hashes de contraseña
- **CORS Configuration** - Configuración de orígenes permitidos
- **Security Headers** - Headers de seguridad HTTP
- **Input Validation** - Validación de entrada con Bean Validation
- **SQL Injection Protection** - Uso de MongoDB queries seguras

## 📊 Monitoreo

### Spring Boot Actuator

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

### Logs

- Configuración de logging en `application.properties`
- Niveles configurables por paquete
- Formato estructurado para análisis

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Seguir estándares de código Java
- Escribir tests para nuevas funcionalidades
- Actualizar documentación
- Usar commits descriptivos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Equipo SGC Ultimate** - Desarrollo inicial

## 🙏 Agradecimientos

- Spring Boot por el excelente framework
- MongoDB por la base de datos NoSQL
- Comunidad Java por las librerías y herramientas
