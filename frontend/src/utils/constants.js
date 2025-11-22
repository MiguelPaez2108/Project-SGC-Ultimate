// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || 'sgc_token',
    USER: 'sgc_user',
    THEME: 'sgc_theme',
};

// User Roles
export const ROLES = {
    ADMIN: 'ADMIN',
    CLIENTE: 'CLIENTE',
    EMPLEADO: 'EMPLEADO',
};

// Reserva Estados
export const RESERVA_ESTADOS = {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADA: 'CONFIRMADA',
    CANCELADA: 'CANCELADA',
    COMPLETADA: 'COMPLETADA',
};

// Cancha Estados
export const CANCHA_ESTADOS = {
    ACTIVA: 'ACTIVA',
    INACTIVA: 'INACTIVA',
    MANTENIMIENTO: 'MANTENIMIENTO',
};

// Cancha Tipos
export const CANCHA_TIPOS = {
    FUTSAL: 'FUTSAL',
    FUTBOL_5: 'FUTBOL_5',
    FUTBOL_7: 'FUTBOL_7',
    FUTBOL_11: 'FUTBOL_11',
    OTRO: 'OTRO',
};

// Pago Métodos
export const PAGO_METODOS = {
    EFECTIVO: 'EFECTIVO',
    TARJETA: 'TARJETA',
    TRANSFERENCIA: 'TRANSFERENCIA',
};

// Pago Estados
export const PAGO_ESTADOS = {
    PENDIENTE: 'PENDIENTE',
    COMPLETADO: 'COMPLETADO',
    FALLIDO: 'FALLIDO',
};

// Notificación Tipos
export const NOTIFICACION_TIPOS = {
    INFO: 'INFO',
    ADVERTENCIA: 'ADVERTENCIA',
    RECORDATORIO: 'RECORDATORIO',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CANCHAS: '/canchas',
    CANCHA_DETAIL: '/canchas/:id',
    RESERVAS: '/reservas',
    NUEVA_RESERVA: '/reservas/nueva',
    RESERVA_DETAIL: '/reservas/:id',
    PAGOS: '/pagos',
    PROFILE: '/profile',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USUARIOS: '/admin/usuarios',
        HORARIOS: '/admin/horarios',
        NOTIFICACIONES: '/admin/notificaciones',
        AUDITORIAS: '/admin/auditorias',
    },
};
