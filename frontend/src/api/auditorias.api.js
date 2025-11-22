import axiosInstance from './axios.config';

/**
 * Get all auditorias (Admin only)
 */
export const getAuditorias = async (params = {}) => {
    const response = await axiosInstance.get('/auditorias', { params });
    return response.data;
};
