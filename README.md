# Project SGC Ultimate

Sistema de Gestión de Canchas Deportivas - Plataforma Full-Stack para reservas, pagos y administración integral.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías](#tecnologías)
- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Roadmap](#roadmap)

## Descripción General

**Project SGC Ultimate** es una aplicación web moderna y completa para la gestión integral de canchas deportivas. Permite a los usuarios realizar reservas en tiempo real, gestionar pagos de forma segura y acceder a dashboards personalizados, mientras que los administradores tienen control total del sistema desde un panel centralizado.

### Características Destacadas

- Autenticación segura con JWT
- Reservas en tiempo real con validación de disponibilidad
- Sistema de pagos integrado con historial completo
- Dashboards personalizados para usuarios y administradores
- Sistema de notificaciones automáticas
- Auditoría completa de operaciones
- API REST documentada con OpenAPI/Swagger
- Diseño responsivo y moderno

## Arquitectura del Sistema

### Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App]
        A1[Components]
        A2[Pages]
        A3[Context/State]
        A --> A1
        A --> A2
        A --> A3
    end
    
    subgraph "API Layer"
        B[REST API]
        B1[Controllers]
        B2[JWT Filter]
        B3[CORS Config]
        B --> B1
        B --> B2
        B --> B3
    end
    
    subgraph "Business Layer"
        C[Services]
        C1[Auth Service]
        C2[Reserva Service]
        C3[Pago Service]
        C4[Cancha Service]
        C --> C1
        C --> C2
        C --> C3
        C --> C4
    end
    
    subgraph "Data Layer"
        D[Repositories]
        E[(MongoDB)]
        D --> E
    end
    
    A -->|HTTP/JSON| B
    B1 -->|Business Logic| C
    C -->|Data Access| D
    
    style A fill:#61dafb
    style B fill:#6db33f
    style C fill:#ffa500
    style E fill:#47a248
```

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant API as Backend API
    participant JWT as JWT Service
    participant DB as MongoDB
    
    U->>F: Ingresa credenciales
    F->>API: POST /api/auth/login
    API->>DB: Verificar usuario
    DB-->>API: Usuario válido
    API->>JWT: Generar token
    JWT-->>API: JWT Token
    API-->>F: Token + Usuario
    F->>F: Guardar token
    
    Note over F,API: Peticiones subsecuentes
    F->>API: Request + Bearer Token
    API->>JWT: Validar token
    JWT-->>API: Token válido
    API-->>F: Respuesta
```

### Flujo de Reserva

```mermaid
flowchart LR
    A[Usuario] -->|1. Selecciona cancha| B[Listado de Canchas]
    B -->|2. Elige horario| C[Verificar Disponibilidad]
    C -->|3. Disponible| D[Crear Reserva]
    D -->|4. Reserva creada| E[Procesar Pago]
    E -->|5. Pago exitoso| F[Confirmar Reserva]
    F -->|6. Notificación| G[Usuario Confirmado]
    
    C -->|No disponible| B
    E -->|Pago fallido| H[Cancelar Reserva]
    
    style A fill:#4a90e2
    style D fill:#7ed321
    style E fill:#f5a623
    style F fill:#50e3c2
    style H fill:#d0021b
```

### Modelo de Datos

```mermaid
erDiagram
    USUARIO ||--o{ RESERVA : realiza
    USUARIO ||--o{ NOTIFICACION : recibe
    USUARIO ||--o{ AUDITORIA : genera
    CANCHA ||--o{ RESERVA : tiene
    CANCHA ||--o{ HORARIO : define
    RESERVA ||--|| PAGO : requiere
    
    USUARIO {
        string id PK
        string nombreCompleto
        string email UK
        string password
        string telefono
        enum rol
        boolean activo
        date fechaRegistro
    }
    
    CANCHA {
        string id PK
        string nombre
        string tipo
        int capacidad
        decimal precioPorHora
        boolean disponible
        string descripcion
        string ubicacion
        array caracteristicas
    }
    
    RESERVA {
        string id PK
        string usuarioId FK
        string canchaId FK
        datetime fechaInicio
        datetime fechaFin
        enum estado
        decimal precioTotal
        string observaciones
    }
    
    PAGO {
        string id PK
        string reservaId FK
        decimal monto
        enum metodoPago
        enum estado
        datetime fechaPago
        string transaccionId
    }
    
    HORARIO {
        string id PK
        string canchaId FK
        enum diaSemana
        time horaInicio
        time horaFin
        boolean disponible
    }
    
    NOTIFICACION {
        string id PK
        string usuarioId FK
        string titulo
        string mensaje
        enum tipo
        boolean leida
        datetime fechaCreacion
    }
    
    AUDITORIA {
        string id PK
        string usuarioId FK
        enum accion
        string entidad
        string entidadId
        string detalles
        datetime fecha
        string ipAddress
    }
```

## Tecnologías

### Stack Tecnológico

```mermaid
graph LR
    subgraph Frontend
        F1[React 18.2]
        F2[Vite 5.0]
        F3[React Router 6.21]
        F4[React Query 5.17]
        F5[Axios 1.6]
        F6[Framer Motion 10.18]
    end
    
    subgraph Backend
        B1[Java 21]
        B2[Spring Boot 3.5.7]
        B3[Spring Security]
        B4[Spring Data MongoDB]
        B5[JWT 0.12.3]
        B6[SpringDoc OpenAPI]
    end
    
    subgraph Database
        D1[(MongoDB 6.0+)]
    end
    
    subgraph Testing
        T1[JUnit 5]
        T2[Mockito]
        T3[Vitest]
        T4[Testing Library]
    end
    
    Frontend --> Backend
    Backend --> Database
    
    style Frontend fill:#61dafb
    style Backend fill:#6db33f
    style Database fill:#47a248
    style Testing fill:#ffa500
```

### Tecnologías Detalladas

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Backend** |
| Lenguaje | Java | 21 | Lenguaje de programación principal |
| Framework | Spring Boot | 3.5.7 | Framework backend |
| Seguridad | Spring Security | 3.5.7 | Autenticación y autorización |
| Base de Datos | MongoDB | 6.0+ | Base de datos NoSQL |
| JWT | JJWT | 0.12.3 | Tokens de autenticación |
| Documentación | SpringDoc OpenAPI | 2.3.0 | Documentación API |
| Testing | JUnit | 5 | Pruebas unitarias |
| Cobertura | JaCoCo | 0.8.11 | Análisis de cobertura |
| **Frontend** |
| Biblioteca UI | React | 18.2 | Interfaz de usuario |
| Build Tool | Vite | 5.0 | Empaquetador y dev server |
| Enrutamiento | React Router | 6.21 | Navegación SPA |
| Estado Servidor | React Query | 5.17 | Gestión de estado asíncrono |
| HTTP Client | Axios | 1.6 | Peticiones HTTP |
| Formularios | React Hook Form | 7.49 | Gestión de formularios |
| Animaciones | Framer Motion | 10.18 | Animaciones fluidas |
| Notificaciones | React Hot Toast | 2.4 | Notificaciones toast |
| Testing | Vitest | 1.1 | Framework de testing |
| **DevOps** |
| Contenedores | Docker | - | Containerización |
| Orquestación | Docker Compose | - | Orquestación de servicios |
| Build | Maven | 3.8+ | Gestión de dependencias Java |
| Package Manager | npm | 9.0+ | Gestión de paquetes Node |

## Características Principales

### Para Usuarios

- **Autenticación Segura**: Sistema de login/registro con JWT y encriptación de contraseñas
- **Exploración de Canchas**: Navegación intuitiva con filtros por tipo y disponibilidad
- **Reservas en Tiempo Real**: Verificación instantánea de disponibilidad y confirmación
- **Gestión de Pagos**: Procesamiento seguro con historial completo de transacciones
- **Dashboard Personalizado**: Métricas, estadísticas y resumen de actividad
- **Perfil de Usuario**: Edición de información personal y preferencias
- **Notificaciones**: Alertas automáticas sobre reservas, pagos y cambios

### Para Administradores

- **Panel de Control Completo**: Dashboard con métricas en tiempo real
- **Gestión de Usuarios**: CRUD completo con control de roles y estados
- **Administración de Canchas**: Crear, editar y eliminar canchas con sus características
- **Control de Horarios**: Definir disponibilidad por día y horario
- **Seguimiento de Reservas**: Visualización y gestión de todas las reservas
- **Control de Pagos**: Confirmación y seguimiento de transacciones
- **Sistema de Auditoría**: Registro completo de todas las operaciones críticas
- **Reportes y Estadísticas**: Análisis de uso, ingresos y tendencias

## Instalación

### Requisitos Previos

- **Java 21** o superior
- **Maven 3.8+**
- **Node.js 18+** y npm
- **MongoDB 6.0+** (local o Atlas)
- **Git**

### Clonar el Repositorio

```bash
git clone https://github.com/MiguelPaez2108/Project-SGC-Ultimate.git
cd Project-SGC-Ultimate
```

### Instalación del Backend

```bash
cd backend

# Instalar dependencias
./mvnw clean install

# O en Windows
mvnw.cmd clean install
```

### Instalación del Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

## Configuración

### Configuración del Backend

1. Crear archivo `application.properties` en `backend/src/main/resources/`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/sgc_ultimate
# Para MongoDB Atlas:
# spring.data.mongodb.uri=mongodb+srv://usuario:password@cluster.mongodb.net/sgc_ultimate

# JWT Configuration
jwt.secret=tu_clave_secreta_muy_segura_cambiala_en_produccion
jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration
cors.allowed-origins=http://localhost:5173

# Logging
logging.level.com.project_sgc_ultimate=DEBUG
```

2. Para MongoDB Atlas, obtén tu connection string desde el dashboard de Atlas.

### Configuración del Frontend

1. Crear archivo `.env.local` en `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SGC Ultimate
VITE_JWT_STORAGE_KEY=sgc_token
```

## Uso

### Ejecutar el Backend

```bash
cd backend

# Modo desarrollo
./mvnw spring-boot:run

# Con perfil específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

El backend estará disponible en: `http://localhost:8080`

Documentación API: `http://localhost:8080/swagger-ui.html`

### Ejecutar el Frontend

```bash
cd frontend

# Modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Ejecutar con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Credenciales por Defecto

Al iniciar por primera vez, puedes crear un usuario administrador:

- **Email**: admin@sgc.com
- **Password**: admin123

> **Importante**: Cambia estas credenciales en producción.

## API Documentation

La API REST está completamente documentada con OpenAPI/Swagger.

### Acceder a la Documentación

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### Endpoints Principales

#### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

#### Canchas

- `GET /api/canchas` - Listar canchas
- `GET /api/canchas/{id}` - Obtener cancha
- `POST /api/canchas` - Crear cancha (ADMIN)
- `PUT /api/canchas/{id}` - Actualizar cancha (ADMIN)
- `DELETE /api/canchas/{id}` - Eliminar cancha (ADMIN)

#### Reservas

- `GET /api/reservas` - Listar reservas del usuario
- `GET /api/reservas/{id}` - Obtener reserva
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/{id}` - Actualizar reserva
- `DELETE /api/reservas/{id}` - Cancelar reserva

#### Pagos

- `GET /api/pagos` - Listar pagos del usuario
- `POST /api/pagos` - Procesar pago
- `PUT /api/pagos/{id}/confirmar` - Confirmar pago (ADMIN)

Para más detalles, consulta [API.md](backend/API.md).

## Testing

### Backend Testing

```bash
cd backend

# Ejecutar todos los tests
./mvnw test

# Ejecutar tests con cobertura
./mvnw test jacoco:report

# Ver reporte de cobertura
# Abrir: target/site/jacoco/index.html
```

### Frontend Testing

```bash
cd frontend

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### Cobertura de Código

El proyecto mantiene una cobertura de código superior al 80% en ambos backend y frontend.

## Despliegue

### Despliegue en Producción

#### Backend

```bash
cd backend

# Compilar para producción
./mvnw clean package -DskipTests -Pprod

# Ejecutar JAR
java -jar target/sgc-ultimate-1.0.0.jar --spring.profiles.active=prod
```

#### Frontend

```bash
cd frontend

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Despliegue con Docker

```bash
# Build de imágenes
docker-compose build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### Plataformas Cloud

- **Backend**: AWS Elastic Beanstalk, Heroku, Google Cloud Run, Azure App Service
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas

Para guías detalladas, consulta:
- [DEPLOYMENT.md](backend/DEPLOYMENT.md) - Backend
- [DEPLOYMENT.md](frontend/DEPLOYMENT.md) - Frontend

## Estructura del Proyecto

```
Project SGC Ultimate/
├── backend/                          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project_sgc_ultimate/
│   │   │   │   ├── config/          # Configuraciones (Security, CORS, MongoDB)
│   │   │   │   ├── controller/      # Controladores REST
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── exception/       # Manejo de excepciones
│   │   │   │   ├── model/           # Entidades del dominio
│   │   │   │   ├── repository/      # Repositorios MongoDB
│   │   │   │   ├── security/        # JWT y configuración de seguridad
│   │   │   │   └── service/         # Lógica de negocio
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Tests unitarios e integración
│   ├── pom.xml                      # Dependencias Maven
│   ├── Dockerfile
│   ├── API.md                       # Documentación de API
│   ├── DEPLOYMENT.md
│   └── TESTING.md
│
├── frontend/                         # Frontend React
│   ├── src/
│   │   ├── api/                     # Servicios de API y Axios config
│   │   ├── assets/                  # Recursos estáticos
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── common/              # Componentes comunes (Button, Card, Input)
│   │   │   ├── features/            # Componentes específicos (CanchaCard, etc)
│   │   │   └── layout/              # Layout (Navbar, Sidebar, Footer)
│   │   ├── contexts/                # Contextos React (Auth, Theme)
│   │   ├── hooks/                   # Custom hooks
│   │   ├── pages/                   # Páginas/Vistas
│   │   │   ├── admin/               # Páginas de administración
│   │   │   ├── auth/                # Login y registro
│   │   │   ├── canchas/             # Gestión de canchas
│   │   │   ├── dashboard/           # Dashboards
│   │   │   ├── pagos/               # Gestión de pagos
│   │   │   ├── profile/             # Perfil de usuario
│   │   │   └── reservas/            # Gestión de reservas
│   │   ├── routes/                  # Configuración de rutas
│   │   ├── styles/                  # Estilos globales CSS
│   │   └── utils/                   # Utilidades y helpers
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── DEPLOYMENT.md
│   └── TESTING.md
│
├── docker-compose.yml               # Orquestación de servicios
├── .gitignore
└── README.md                        # Este archivo
```

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

### Proceso de Contribución

1. **Fork** el proyecto
2. Crea una **rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'feat: agregar nueva funcionalidad'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request**

### Convenciones de Código

#### Backend (Java)
- Seguir convenciones de Java y Spring Boot
- Usar Lombok para reducir boilerplate
- Documentar métodos públicos con JavaDoc
- Mantener cobertura de tests > 80%

#### Frontend (React)
- Seguir guía de estilo de React
- Usar ESLint y Prettier
- Componentes funcionales con hooks
- Nombres descriptivos en español para variables de negocio

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

Para más detalles, consulta [CONTRIBUTING.md](backend/CONTRIBUTING.md).

## Roadmap

### Completado

- [x] Sistema de autenticación y autorización con JWT
- [x] CRUD completo de usuarios, canchas, reservas y pagos
- [x] Dashboard de administración con métricas
- [x] Dashboard de cliente personalizado
- [x] Sistema de notificaciones
- [x] Auditoría completa de operaciones
- [x] API REST documentada con Swagger
- [x] Testing unitario e integración
- [x] Dockerización del proyecto

### En Progreso

- [ ] Pasarela de pagos real (Stripe/PayPal)
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Sistema de reportes avanzados con gráficos

### Planificado

- [ ] Aplicación móvil (React Native)
- [ ] Sistema de descuentos y promociones
- [ ] Integración con calendarios externos (Google Calendar)
- [ ] Sistema de valoraciones y comentarios
- [ ] Chat en tiempo real entre usuarios y administradores
- [ ] Análisis predictivo de demanda
- [ ] API pública para integraciones de terceros

## Seguridad

### Características de Seguridad

- Autenticación JWT con tokens seguros
- Encriptación de contraseñas con BCrypt
- Spring Security para protección de endpoints
- Control de acceso basado en roles (RBAC)
- Configuración CORS restrictiva
- Validación de datos en backend y frontend
- Protección contra inyección SQL/NoSQL
- Rate limiting en endpoints críticos
- Auditoría completa de operaciones

### Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor repórtala de forma responsable:

- Email: security@sgcultimate.com
- No abras issues públicos para vulnerabilidades

Consulta [SECURITY.md](backend/SECURITY.md) para más detalles.

## Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

Copyright (c) 2024 Project SGC Ultimate

## Contacto y Soporte

- **Repositorio**: [GitHub - Project SGC Ultimate](https://github.com/MiguelPaez2108/Project-SGC-Ultimate)
- **Documentación**: Consulta los archivos `.md` en cada directorio
- **Issues**: [GitHub Issues](https://github.com/MiguelPaez2108/Project-SGC-Ultimate/issues)

---

**Desarrollado con dedicación para la gestión moderna de canchas deportivas**
