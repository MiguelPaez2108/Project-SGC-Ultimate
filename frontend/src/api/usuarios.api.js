import axiosInstance from './axios.config';

/**
 * Get all usuarios (Admin only)
 */
export const getUsuarios = async (params = {}) => {
    const response = await axiosInstance.get('/usuarios', { params });
    return response.data;
};

/**
 * Get usuario by ID (Admin only)
 */
export const getUsuarioById = async (id) => {
    const response = await axiosInstance.get(`/usuarios/${id}`);
    return response.data;
};

/**
 * Create usuario (Admin only)
 */
export const createUsuario = async (usuarioData) => {
    const response = await axiosInstance.post('/usuarios', usuarioData);
    return response.data;
};

/**
 * Update usuario (Admin only)
 */
export const updateUsuario = async (id, usuarioData) => {
    const response = await axiosInstance.put(`/usuarios/${id}`, usuarioData);
    return response.data;
};

/**
 * Delete usuario (Admin only)
 */
export const deleteUsuario = async (id) => {
    const response = await axiosInstance.delete(`/usuarios/${id}`);
    return response.data;
};

/**
 * Update usuario activo status
 */
export const updateUsuarioActivo = async (id, activo) => {
    const response = await axiosInstance.patch(`/usuarios/${id}/activo`, { activo });
    return response.data;
};
