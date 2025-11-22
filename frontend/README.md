# SGC Ultimate Frontend

Sistema de Gestión de Canchas - Frontend desarrollado con React + Vite.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Formularios
- **Framer Motion** - Animaciones
- **React Hot Toast** - Notificaciones

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SGC Ultimate
VITE_JWT_STORAGE_KEY=sgc_token
```

## 📁 Estructura del Proyecto

```
src/
├── api/              # Servicios de API
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables
├── contexts/         # Contextos de React
├── hooks/            # Custom hooks
├── pages/            # Páginas/Vistas
├── routes/           # Configuración de rutas
├── styles/           # Estilos globales
└── utils/            # Utilidades
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. El token se almacena en localStorage y se incluye automáticamente en todas las peticiones mediante interceptores de Axios.

## 🎨 Diseño

El proyecto utiliza un sistema de diseño basado en CSS Variables con una paleta de colores moderna y componentes reutilizables.

## 📝 Roadmap

Ver `frontend_roadmap.md` para el plan completo de desarrollo.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.
