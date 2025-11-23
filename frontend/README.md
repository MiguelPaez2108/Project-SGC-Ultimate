# SGC Ultimate Frontend

Sistema de Gestión de Canchas - Frontend desarrollado con React 18 + Vite

## 📋 Descripción

SGC Ultimate Frontend es una aplicación web moderna y responsiva para la gestión integral de reservas de canchas deportivas. Proporciona interfaces intuitivas para clientes y administradores, con autenticación JWT, gestión de reservas en tiempo real, procesamiento de pagos y sistema de notificaciones.

## 🚀 Características Principales

- **Autenticación JWT** - Sistema seguro de login y registro
- **Dashboard Dual** - Interfaces separadas para clientes y administradores
- **Gestión de Canchas** - Visualización, búsqueda y filtrado de canchas
- **Sistema de Reservas** - Reserva de canchas con calendario interactivo
- **Procesamiento de Pagos** - Gestión y seguimiento de pagos
- **Notificaciones en Tiempo Real** - Sistema de notificaciones push
- **Panel de Administración** - Gestión completa de usuarios, canchas y reservas
- **Responsive Design** - Optimizado para móviles, tablets y desktop
- **Animaciones Fluidas** - Experiencia de usuario mejorada con Framer Motion
- **Dark Mode Ready** - Preparado para tema oscuro

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18.2** - Biblioteca de UI con Hooks
- **Vite 5.0** - Build tool ultra-rápido
- **React Router v6** - Enrutamiento declarativo

### Estado y Datos
- **React Query (TanStack Query)** - Gestión de estado del servidor
- **Axios** - Cliente HTTP con interceptores
- **React Hook Form** - Formularios performantes

### UI/UX
- **Framer Motion** - Animaciones y transiciones
- **React Hot Toast** - Notificaciones elegantes
- **React Icons** - Biblioteca de iconos
- **CSS Variables** - Sistema de diseño consistente

### Testing
- **Vitest** - Framework de testing rápido
- **Testing Library** - Testing de componentes
- **jsdom** - Entorno DOM para tests

### Desarrollo
- **ESLint** - Linting de código
- **Vite Dev Server** - Hot Module Replacement

## 📋 Prerrequisitos

- **Node.js 18+** o superior
- **npm 9+** o **yarn 1.22+**
- **Backend API** corriendo en http://localhost:8080

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

Variables disponibles:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SGC Ultimate
VITE_JWT_STORAGE_KEY=sgc_token
VITE_ENABLE_ANALYTICS=false
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en: http://localhost:3000

### 5. Build para producción
```bash
npm run build
# o
yarn build
```

Los archivos optimizados estarán en `dist/`

### 6. Preview del build
```bash
npm run preview
# o
yarn preview
```

## 🐳 Docker

### Desarrollo con Docker
```bash
docker-compose up -d
```

### Producción con Docker
```bash
# Construir imagen
docker build -t sgc-frontend .

# Ejecutar contenedor
docker run -p 80:80 sgc-frontend
```

## 🏗️ Arquitectura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
│   └── landing.html       # Página de aterrizaje
├── src/
│   ├── api/               # Servicios de API
│   │   ├── axios.config.js
│   │   ├── auth.api.js
│   │   ├── canchas.api.js
│   │   ├── reservas.api.js
│   │   ├── pagos.api.js
│   │   ├── usuarios.api.js
│   │   ├── horarios.api.js
│   │   ├── notificaciones.api.js
│   │   └── auditorias.api.js
│   │
│   ├── assets/            # Recursos estáticos
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/        # Componentes React
│   │   ├── common/        # Componentes reutilizables
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   └── Spinner/
│   │   │
│   │   ├── features/      # Componentes de funcionalidades
│   │   │   ├── CanchaCard/
│   │   │   ├── EditCanchaModal/
│   │   │   ├── PagoCard/
│   │   │   ├── ReservaCard/
│   │   │   └── StatCard/
│   │   │
│   │   └── layout/        # Componentes de layout
│   │       ├── MainLayout/
│   │       ├── Navbar/
│   │       └── Sidebar/
│   │
│   ├── contexts/          # React Contexts
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/             # Custom Hooks
│   │   └── useAuth.js
│   │
│   ├── pages/             # Páginas/Vistas
│   │   ├── auth/          # Autenticación
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── dashboard/     # Dashboards
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ClientDashboard.jsx
│   │   │
│   │   ├── canchas/       # Gestión de canchas
│   │   │   ├── CanchasList.jsx
│   │   │   └── CanchaDetail.jsx
│   │   │
│   │   ├── reservas/      # Gestión de reservas
│   │   │   ├── MisReservas.jsx
│   │   │   └── NuevaReserva.jsx
│   │   │
│   │   ├── pagos/         # Gestión de pagos
│   │   │   └── PagosList.jsx
│   │   │
│   │   ├── admin/         # Panel de administración
│   │   │   ├── Usuarios.jsx
│   │   │   ├── Horarios.jsx
│   │   │   ├── Notificaciones.jsx
│   │   │   └── Auditorias.jsx
│   │   │
│   │   ├── profile/       # Perfil de usuario
│   │   │   └── Profile.jsx
│   │   │
│   │   └── NotFound.jsx   # Página 404
│   │
│   ├── routes/            # Configuración de rutas
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── RoleBasedRoute.jsx
│   │
│   ├── styles/            # Estilos globales
│   │   ├── variables.css  # Variables CSS
│   │   ├── reset.css      # Reset de estilos
│   │   ├── utilities.css  # Clases utilitarias
│   │   └── index.css      # Estilos globales
│   │
│   ├── test/              # Configuración de tests
│   │   └── setup.js
│   │
│   ├── utils/             # Utilidades
│   │   ├── constants.js   # Constantes
│   │   ├── formatters.js  # Formateadores
│   │   └── storage.js     # LocalStorage helpers
│   │
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
│
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore
├── Dockerfile             # Dockerfile para producción
├── docker-compose.yml     # Docker Compose
├── nginx.conf             # Configuración de Nginx
├── package.json
├── vite.config.js         # Configuración de Vite
├── jsconfig.json          # Path aliases
├── README.md
├── TESTING.md             # Guía de testing
├── DEPLOYMENT.md          # Guía de despliegue
└── CONTRIBUTING.md        # Guía de contribución
```

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales
2. **Backend valida** y retorna JWT token
3. **Token se almacena** en localStorage
4. **Interceptor de Axios** agrega token a todas las peticiones
5. **Rutas protegidas** verifican autenticación

### Roles de Usuario

- **CLIENTE**: Acceso a reservas, pagos y perfil
- **ADMIN**: Acceso completo al sistema

### Rutas Protegidas

```jsx
// Ruta privada (requiere autenticación)
<PrivateRoute>
  <MisReservas />
</PrivateRoute>

// Ruta basada en rol (requiere rol específico)
<RoleBasedRoute allowedRoles={['ADMIN']}>
  <AdminDashboard />
</RoleBasedRoute>
```

## 📚 Guía de Uso

### Para Clientes

1. **Registro/Login**: Crear cuenta o iniciar sesión
2. **Explorar Canchas**: Ver canchas disponibles con filtros
3. **Hacer Reserva**: Seleccionar cancha, fecha y hora
4. **Realizar Pago**: Procesar pago de la reserva
5. **Ver Mis Reservas**: Gestionar reservas activas
6. **Perfil**: Actualizar información personal

### Para Administradores

1. **Dashboard**: Ver estadísticas y métricas
2. **Gestión de Canchas**: CRUD completo de canchas
3. **Gestión de Usuarios**: Administrar usuarios del sistema
4. **Gestión de Reservas**: Ver y modificar todas las reservas
5. **Gestión de Horarios**: Configurar horarios disponibles
6. **Notificaciones**: Enviar notificaciones a usuarios
7. **Auditoría**: Ver logs de todas las operaciones

## 🎨 Sistema de Diseño

### Variables CSS

El proyecto utiliza CSS Variables para mantener consistencia:

```css
:root {
  /* Colores principales */
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --accent-color: #FF9800;
  
  /* Colores de estado */
  --success-color: #4CAF50;
  --error-color: #F44336;
  --warning-color: #FF9800;
  --info-color: #2196F3;
  
  /* Tipografía */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Componentes Reutilizables

- **Button**: Botones con variantes (primary, secondary, danger)
- **Card**: Tarjetas para contenido
- **Input**: Inputs con validación
- **Spinner**: Indicador de carga

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con UI
npm run test:ui

# Cobertura de código
npm run test:coverage
```

### Estructura de Tests

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Cobertura de Tests

Objetivo: **80%+** de cobertura

Ver reporte en: `coverage/index.html`

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy carpeta dist/
netlify deploy --prod --dir=dist
```

### Docker + Nginx

```bash
docker build -t sgc-frontend .
docker run -p 80:80 sgc-frontend
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles.

## 🔧 Scripts Disponibles

```json
{
  "dev": "Inicia servidor de desarrollo",
  "build": "Construye para producción",
  "preview": "Preview del build de producción",
  "test": "Ejecuta tests",
  "test:ui": "Ejecuta tests con UI",
  "test:coverage": "Genera reporte de cobertura",
  "lint": "Ejecuta ESLint"
}
```

## 🐛 Troubleshooting

### Puerto 3000 ya en uso
```bash
# Cambiar puerto en vite.config.js
server: {
  port: 3001
}
```

### Error de CORS
```bash
# Verificar que el backend esté corriendo
# Verificar configuración de proxy en vite.config.js
```

### Build falla
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB (gzipped)

### Optimizaciones Implementadas

- ✅ Code splitting por rutas
- ✅ Lazy loading de componentes
- ✅ Optimización de imágenes
- ✅ Tree shaking
- ✅ Minificación de CSS/JS
- ✅ Compresión gzip

## ♿ Accesibilidad

- ✅ Navegación por teclado
- ✅ ARIA labels
- ✅ Contraste de colores WCAG AA
- ✅ Screen reader friendly
- ✅ Focus indicators

## 🔒 Seguridad

- ✅ XSS Protection
- ✅ CSRF Tokens
- ✅ Content Security Policy
- ✅ Sanitización de inputs
- ✅ HTTPS only en producción
- ✅ Secure headers

## 🤝 Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guías de contribución.

### Proceso de Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar ESLint para linting
- Seguir convenciones de React
- Escribir tests para nuevas funcionalidades
- Documentar componentes complejos
- Usar commits descriptivos

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Autores

- **Equipo SGC Ultimate** - Desarrollo inicial

## 🙏 Agradecimientos

- React Team por la excelente biblioteca
- Vite por el build tool ultra-rápido
- Comunidad open source por las librerías utilizadas

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./docs/) o abre un issue en GitHub.

**Última actualización**: 2024-01-15
