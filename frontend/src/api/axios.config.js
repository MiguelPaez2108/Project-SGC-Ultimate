import axios from 'axios';
import { API_BASE_URL } from '@utils/constants';
import { tokenStorage } from '@utils/storage';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenStorage.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle different error status codes
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - Clear token and redirect to login
                    tokenStorage.remove();
                    toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    window.location.href = '/login';
                    break;

                case 403:
                    // Forbidden
                    toast.error('No tienes permisos para realizar esta acción.');
                    break;

                case 404:
                    // Not found
                    toast.error('Recurso no encontrado.');
                    break;

                case 500:
                    // Server error
                    toast.error('Error del servidor. Por favor, intenta más tarde.');
                    break;

                default:
                    // Other errors
                    const message = data?.message || 'Ha ocurrido un error inesperado.';
                    toast.error(message);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('❌ Error de conexión:', {
                baseURL: API_BASE_URL,
                request: error.request,
                message: 'No se recibió respuesta del servidor'
            });
            toast.error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080');
        } else {
            // Something else happened
            console.error('❌ Error inesperado:', error.message);
            toast.error('Ha ocurrido un error inesperado.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
