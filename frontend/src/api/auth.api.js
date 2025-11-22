import axiosInstance from './axios.config';

/**
 * Login user
 */
export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

/**
 * Register user
 */
export const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};

/**
 * Logout (client-side only, no backend endpoint needed)
 */
export const logout = () => {
    // Just clear local storage, handled by AuthContext
    return Promise.resolve();
};
