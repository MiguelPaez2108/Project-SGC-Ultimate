import axiosInstance from './axios.config';

/**
 * Get all reservas (Admin only)
 */
export const getReservas = async (params = {}) => {
    const response = await axiosInstance.get('/reservas', { params });
    return response.data;
};

/**
 * Get my reservas (authenticated user)
 */
export const getMisReservas = async () => {
    const response = await axiosInstance.get('/reservas/mis');
    return response.data;
};

/**
 * Get reserva by ID
 */
export const getReservaById = async (id) => {
    const response = await axiosInstance.get(`/reservas/${id}`);
    return response.data;
};

/**
 * Create reserva
 */
export const createReserva = async (reservaData) => {
    const response = await axiosInstance.post('/reservas', reservaData);
    return response.data;
};

/**
 * Update reserva estado
 */
export const updateReservaEstado = async (id, estado) => {
    const response = await axiosInstance.put(`/reservas/${id}/estado`, null, {
        params: { estado },
    });
    return response.data;
};

/**
 * Delete reserva
 */
export const deleteReserva = async (id) => {
    const response = await axiosInstance.delete(`/reservas/${id}`);
    return response.data;
};
