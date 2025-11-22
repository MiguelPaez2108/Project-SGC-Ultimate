import axiosInstance from './axios.config';

/**
 * Get all notificaciones
 */
export const getNotificaciones = async (params = {}) => {
    const response = await axiosInstance.get('/notificaciones', { params });
    return response.data;
};

/**
 * Mark notificacion as read
 */
export const markAsRead = async (id) => {
    const response = await axiosInstance.put(`/notificaciones/${id}/leer`);
    return response.data;
};

/**
 * Delete notificacion
 */
export const deleteNotificacion = async (id) => {
    const response = await axiosInstance.delete(`/notificaciones/${id}`);
    return response.data;
};
