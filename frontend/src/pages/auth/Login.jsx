import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { ROUTES } from '@utils/constants';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await login(formData);
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Error al iniciar sesión',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <div className="logo-icon">⚽</div>
                        <h1 className="logo-text">SGC Ultimate</h1>
                    </div>
                    <p className="login-subtitle">Gestión de Canchas Deportivas</p>
                </div>

                <Card className="login-card">
                    <div className="login-card-header">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {errors.general && (
                            <div className="alert alert--error">
                                <FiAlertCircle />
                                <span>{errors.general}</span>
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={<FiMail />}
                            fullWidth
                            required
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={<FiLock />}
                            fullWidth
                            required
                        />

                        <div className="login-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Recordarme</span>
                            </label>
                            <Link to="#" className="forgot-password">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Iniciar Sesión
                        </Button>

                        <div className="login-divider">
                            <span>o</span>
                        </div>

                        <p className="login-register">
                            ¿No tienes cuenta?{' '}
                            <Link to={ROUTES.REGISTER} className="register-link">
                                Regístrate aquí
                            </Link>
                        </p>
                    </form>
                </Card>

                <footer className="login-footer">
                    <p>© 2025 SGC Ultimate. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
}
