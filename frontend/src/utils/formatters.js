import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr, { locale: es });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
    return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format time
 */
export const formatTime = (date) => {
    return formatDate(date, 'HH:mm');
};

/**
 * Format relative time (hace 2 horas, etc.)
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;

    return formatDate(date);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
