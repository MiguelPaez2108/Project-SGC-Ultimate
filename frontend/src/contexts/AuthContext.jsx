import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '@api/auth.api';
import { tokenStorage, userStorage } from '@utils/storage';
import { ROUTES } from '@utils/constants';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = tokenStorage.get();
        const storedUser = userStorage.get();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    // Login function
    const login = useCallback(async (credentials) => {
        try {
            const response = await loginApi(credentials);
            const { token: newToken, id, rol } = response;

            const userData = {
                id,
                rol,
                email: credentials.email,
            };

            // Save to state and localStorage
            setToken(newToken);
            setUser(userData);
            tokenStorage.set(newToken);
            userStorage.set(userData);

            toast.success('¡Bienvenido!');

            // Redirect based on role
            if (rol === 'ADMIN') {
                navigate(ROUTES.ADMIN.DASHBOARD);
            } else {
                navigate(ROUTES.DASHBOARD);
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, [navigate]);

    // Register function
    const register = useCallback(async (userData) => {
        try {
            const response = await registerApi(userData);
            const { token: newToken, id, rol } = response;

            const user = {
                id,
                rol,
                email: userData.email,
            };

            // Save to state and localStorage
            setToken(newToken);
            setUser(user);
            tokenStorage.set(newToken);
            userStorage.set(user);

            toast.success('¡Registro exitoso! Bienvenido.');

            // Redirect to dashboard
            navigate(ROUTES.DASHBOARD);

            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }, [navigate]);

    // Logout function
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        tokenStorage.remove();
        userStorage.remove();
        toast.success('Sesión cerrada correctamente.');
        navigate(ROUTES.LOGIN);
    }, [navigate]);

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user;

    // Check if user has specific role
    const hasRole = useCallback((role) => {
        return user?.rol === role;
    }, [user]);

    // Check if user has any of the specified roles
    const hasAnyRole = useCallback((roles) => {
        return roles.includes(user?.rol);
    }, [user]);

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
