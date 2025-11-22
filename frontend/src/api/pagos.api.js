import axiosInstance from './axios.config';

/**
 * Get all pagos
 */
export const getPagos = async (params = {}) => {
    const response = await axiosInstance.get('/pagos', { params });
    return response.data;
};

/**
 * Get pago by ID
 */
export const getPagoById = async (id) => {
    const response = await axiosInstance.get(`/pagos/${id}`);
    return response.data;
};

/**
 * Create pago
 */
export const createPago = async (pagoData) => {
    const response = await axiosInstance.post('/pagos', pagoData);
    return response.data;
};

/**
 * Update pago
 */
export const updatePago = async (id, pagoData) => {
    const response = await axiosInstance.put(`/pagos/${id}`, pagoData);
    return response.data;
};

/**
 * Get pagos by usuario
 */
export const getPagosByUsuario = async () => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('sgc_user');
    if (!userStr) {
        return [];
    }
    const user = JSON.parse(userStr);
    const response = await axiosInstance.get(`/pagos/usuario/${user.id}`);
    return response.data;
};
