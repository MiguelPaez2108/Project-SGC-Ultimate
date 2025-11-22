import axiosInstance from './axios.config';

/**
 * Get all horarios
 */
export const getHorarios = async (params = {}) => {
    const response = await axiosInstance.get('/horarios', { params });
    return response.data;
};

/**
 * Get horarios by cancha ID
 */
export const getHorariosByCancha = async (canchaId) => {
    const response = await axiosInstance.get('/horarios', {
        params: { canchaId },
    });
    return response.data;
};

/**
 * Create horario (Admin only)
 */
export const createHorario = async (horarioData) => {
    const response = await axiosInstance.post('/horarios', horarioData);
    return response.data;
};

/**
 * Update horario (Admin only)
 */
export const updateHorario = async (id, horarioData) => {
    const response = await axiosInstance.put(`/horarios/${id}`, horarioData);
    return response.data;
};

/**
 * Delete horario (Admin only)
 */
export const deleteHorario = async (id) => {
    const response = await axiosInstance.delete(`/horarios/${id}`);
    return response.data;
};
