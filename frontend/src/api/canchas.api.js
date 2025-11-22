import axiosInstance from './axios.config';

/**
 * Get all canchas
 */
export const getCanchas = async (params = {}) => {
    const response = await axiosInstance.get('/canchas', { params });
    return response.data;
};

/**
 * Get cancha by ID
 */
export const getCanchaById = async (id) => {
    const response = await axiosInstance.get(`/canchas/${id}`);
    return response.data;
};

/**
 * Create cancha (Admin/Empleado only)
 */
export const createCancha = async (canchaData) => {
    const response = await axiosInstance.post('/canchas', canchaData);
    return response.data;
};

/**
 * Update cancha (Admin/Empleado only)
 */
export const updateCancha = async (id, canchaData) => {
    const response = await axiosInstance.put(`/canchas/${id}`, canchaData);
    return response.data;
};

/**
 * Delete cancha (Admin/Empleado only)
 */
export const deleteCancha = async (id) => {
    const response = await axiosInstance.delete(`/canchas/${id}`);
    return response.data;
};
