## Descripción
Project SGC Ultimate es una aplicación web completa para la gestión integral de canchas deportivas. Permite a los usuarios realizar reservas en línea, gestionar pagos y acceder a un dashboard personalizado, mientras que los administradores controlan el sistema desde un panel centralizado. Desarrollado con tecnologías modernas como Spring Boot en el backend y React en el frontend, garantiza escalabilidad, seguridad y una experiencia de usuario óptima.

## Características Principales

### Para Usuarios
- **Autenticación segura** con JWT para acceso protegido.
- **Reserva de canchas** en tiempo real con verificación de disponibilidad.
- **Gestión de pagos** integrada con historial de transacciones.
- **Perfil de usuario** personalizable con opciones de edición.
- **Notificaciones** automáticas sobre reservas y pagos.
- **Dashboard personalizado** con estadísticas y métricas de uso.

### Para Administradores
- **Gestión de usuarios** completa (crear, editar, eliminar).
- **Administración de canchas** incluyendo disponibilidad, precios y características.
- **Control de horarios** y disponibilidad en tiempo real.
- **Seguimiento de pagos** con reportes financieros detallados.
- **Panel de administración** con métricas en tiempo real y visualizaciones.
- **Auditoría completa** de todas las operaciones del sistema.
- **Sistema de notificaciones** para usuarios y alertas administrativas.

## Tecnologías Utilizadas
- **Backend:** Java 21, Spring Boot 3.5.7, Spring Data MongoDB, Spring Security con JWT, Lombok, SpringDoc OpenAPI, JUnit 5, Mockito, JaCoCo.
- **Frontend:** React 18, Vite, React Router v6, Axios, React Query (@tanstack/react-query), React Hook Form, Framer Motion, React Hot Toast, React Icons, Vitest.
- **Base de Datos:** MongoDB 6.0+ (local o Atlas).
- **Herramientas Adicionales:** Maven 3.8+, Node.js 18+, npm.

## Requisitos Previos
- Java 21 o superior.
- Maven 3.8+.
- MongoDB 6.0+ (local o Atlas).
- Node.js 18+ y npm.

## Instalación y Configuración

### Configuración del Backend
1. Navega al directorio del backend:
   ```
   cd backend
   ```
2. Configura MongoDB en `src/main/resources/application.properties`:
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/sgc_ultimate
   # O para MongoDB Atlas:
   # spring.data.mongodb.uri=mongodb+srv://usuario:password@cluster.mongodb.net/sgc_ultimate
   jwt.secret=tu_clave_secreta_aqui
   jwt.expiration=86400000
   ```
3. Instala dependencias y compila:
   ```
   mvn clean install
   ```
4. Ejecuta el backend:
   ```
   mvn spring-boot:run
   ```
   - El servidor estará disponible en `http://localhost:8080`.
   - Documentación de API: `http://localhost:8080/swagger-ui.html`.

### Configuración del Frontend
1. Navega al directorio del frontend:
   ```
   cd frontend
   ```
2. Instala dependencias:
   ```
   npm install
   ```
3. Configura variables de entorno en `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=SGC Ultimate
   VITE_JWT_STORAGE_KEY=sgc_token
   ```
4. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
   - La aplicación estará disponible en `http://localhost:5173`.
5. Para producción:
   ```
   npm run build
   npm run preview
   ```

## Estructura del Proyecto
La estructura del proyecto está organizada de manera unificada para facilitar el desarrollo full-stack, combinando elementos de backend y frontend en un solo árbol jerárquico. Esto evita divisiones innecesarias y promueve una navegación intuitiva.

```
Project SGC Ultimate/
├── backend/
│   └── src/main/java/com/project_sgc_ultimate/
│       ├── config/           # Configuraciones (Security, CORS, MongoDB)
│       ├── controller/       # Controladores REST
│       ├── dto/              # Data Transfer Objects
│       ├── exception/        # Manejo de excepciones personalizado
│       ├── model/            # Entidades del dominio (Usuario, Cancha, Reserva, Pago, Horario, Notificacion, Auditoria)
│       ├── repository/       # Repositorios MongoDB
│       ├── security/         # Configuración de seguridad y JWT
│       └── service/          # Lógica de negocio
├── frontend/
│   └── src/
│       ├── api/              # Servicios de API y configuración Axios
│       ├── assets/           # Recursos estáticos (iconos, imágenes)
│       ├── components/       # Componentes reutilizables
│       │   ├── common/       # Componentes comunes (Button, Card, Input, Spinner)
│       │   ├── features/     # Componentes específicos (CanchaCard, PagoCard, ReservaCard)
│       │   └── layout/       # Componentes de layout (MainLayout, Navbar, Sidebar)
│       ├── contexts/         # Contextos de React (Auth, Theme)
│       ├── hooks/            # Custom hooks
│       ├── pages/            # Páginas/Vistas
│       │   ├── admin/        # Páginas de administración
│       │   ├── auth/         # Login y registro
│       │   ├── canchas/      # Listado y detalle de canchas
│       │   ├── dashboard/    # Dashboards (admin y cliente)
│       │   ├── pagos/        # Gestión de pagos
│       │   ├── profile/      # Perfil de usuario
│       │   └── reservas/     # Reservas
│       ├── routes/           # Configuración de rutas
│       ├── styles/           # Estilos globales CSS
│       └── utils/            # Utilidades y helpers
├── docs/                     # Documentación adicional (TESTING.md, PERFORMANCE.md, FIX_ERRORS.md para backend y frontend)
├── .env.example              # Ejemplo de variables de entorno
├── package.json              # Dependencias y scripts de npm (frontend)
├── pom.xml                   # Dependencias de Maven (backend)
├── Dockerfile                # Configuración para contenedor Docker
├── README.md                 # Este archivo
└── .gitignore                # Archivos ignorados por Git
```

Esta estructura unificada agrupa funcionalidades relacionadas, como controladores y servicios en el backend junto con componentes y páginas en el frontend, facilitando el mantenimiento y la colaboración en un proyecto full-stack.

## Testing
- **Backend:** Ejecuta `mvn test` en el directorio backend para pruebas unitarias e integración. Usa `mvn test jacoco:report` para cobertura (reporte en `target/site/jacoco/index.html`).
- **Frontend:** Ejecuta `npm test` en el directorio frontend. Usa `npm run test:ui` para interfaz de pruebas y `npm run test:coverage` para reporte de cobertura.

## Seguridad
- Autenticación JWT con tokens seguros y expiración configurable.
- Spring Security para protección de endpoints.
- Control de acceso basado en roles (ADMIN, USER).
- Configuración CORS para prevenir accesos no autorizados.
- Validación de datos en backend y frontend.
- Auditoría completa de operaciones críticas.

## Características de UI/UX
- Diseño moderno con sistema de diseño basado en CSS Variables.
- Modo oscuro/claro (si implementado).
- Diseño responsivo para móviles, tablets y desktop.
- Animaciones fluidas con Framer Motion.
- Carga optimizada con React Query y caché inteligente.
- Feedback visual con notificaciones toast.
- Accesibilidad considerada en componentes.

## API Endpoints Principales
- **Autenticación:** POST /api/auth/login, POST /api/auth/register, POST /api/auth/logout.
- **Usuarios:** GET /api/usuarios, GET /api/usuarios/{id}, PUT /api/usuarios/{id}, DELETE /api/usuarios/{id}.
- **Canchas:** GET /api/canchas, GET /api/canchas/{id}, POST /api/canchas, PUT /api/canchas/{id}, DELETE /api/canchas/{id}.
- **Reservas:** GET /api/reservas, GET /api/reservas/usuario/{id}, POST /api/reservas, PUT /api/reservas/{id}, DELETE /api/reservas/{id}.
- **Pagos:** GET /api/pagos, GET /api/pagos/usuario/{id}, POST /api/pagos, GET /api/pagos/{id}.

## Tecnologías y Herramientas Detalladas
### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 21 | Lenguaje de programación |
| Spring Boot | 3.5.7 | Framework backend |
| MongoDB | 6.0+ | Base de datos NoSQL |
| JWT | 0.12.3 | Autenticación |
| Maven | 3.8+ | Gestión de dependencias |
| JUnit | 5 | Testing |
| JaCoCo | 0.8.11 | Cobertura de código |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2 | Biblioteca UI |
| Vite | 5.0 | Build tool |
| React Router | 6.21 | Enrutamiento |
| React Query | 5.17 | Estado del servidor |
| Axios | 1.6 | Cliente HTTP |
| Framer Motion | 10.18 | Animaciones |
| Vitest | 1.1 | Testing |

## Contribución
1. Fork el proyecto.
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`.
3. Realiza cambios y commit: `git commit -m 'Add some AmazingFeature'`.
4. Push a la rama: `git push origin feature/AmazingFeature`.
5. Abre un Pull Request.

### Convenciones de Código
- Backend: Seguir convenciones de Java y Spring Boot.
- Frontend: Seguir guía de estilo de React y ESLint.
- Commits: Mensajes descriptivos en español.
- Testing: Mantener cobertura de código > 80%.

## Roadmap
- [x] Sistema de autenticación y autorización.
- [x] CRUD de usuarios, canchas, reservas y pagos.
- [x] Dashboard de administración.
- [x] Dashboard de cliente.
- [x] Sistema de notificaciones.
- [x] Auditoría de operaciones.
- [ ] Pasarela de pagos integrada (Stripe/PayPal).
- [ ] Sistema de reportes avanzados.
- [ ] Notificaciones en tiempo real (WebSockets).
- [ ] Aplicación móvil (React Native).
- [ ] Sistema de descuentos y promociones.
- [ ] Integración con calendarios externos.

## Licencia
Este proyecto es privado y confidencial. Todos los derechos reservados.



