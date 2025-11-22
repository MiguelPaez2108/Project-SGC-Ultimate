import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { ROUTES } from '@utils/constants';
import { FiMail, FiLock, FiUser, FiPhone, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './Register.css';

export default function Register() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
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

        if (!formData.nombreCompleto) {
            newErrors.nombreCompleto = 'El nombre completo es requerido';
        } else if (formData.nombreCompleto.length < 3) {
            newErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.telefono) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
            newErrors.telefono = 'Teléfono inválido (10 dígitos)';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Error al registrarse',
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return null;

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { label: 'Débil', color: 'var(--error)' };
        if (strength <= 3) return { label: 'Media', color: 'var(--warning)' };
        return { label: 'Fuerte', color: 'var(--success)' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <div className="register-logo">
                        <div className="logo-icon">⚽</div>
                        <h1 className="logo-text">SGC Ultimate</h1>
                    </div>
                    <p className="register-subtitle">Crea tu cuenta y comienza a reservar</p>
                </div>

                <Card className="register-card">
                    <div className="register-card-header">
                        <h2>Crear Cuenta</h2>
                        <p>Completa tus datos para registrarte</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        {errors.general && (
                            <div className="alert alert--error">
                                <FiAlertCircle />
                                <span>{errors.general}</span>
                            </div>
                        )}

                        <Input
                            label="Nombre Completo"
                            type="text"
                            name="nombreCompleto"
                            placeholder="Juan Pérez"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            error={errors.nombreCompleto}
                            icon={<FiUser />}
                            fullWidth
                            required
                        />

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
                            label="Teléfono"
                            type="tel"
                            name="telefono"
                            placeholder="3001234567"
                            value={formData.telefono}
                            onChange={handleChange}
                            error={errors.telefono}
                            icon={<FiPhone />}
                            fullWidth
                            required
                        />

                        <div>
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
                            {passwordStrength && (
                                <div className="password-strength">
                                    <div className="password-strength-bar">
                                        <div
                                            className="password-strength-fill"
                                            style={{
                                                width: `${(passwordStrength.label === 'Débil' ? 33 : passwordStrength.label === 'Media' ? 66 : 100)}%`,
                                                backgroundColor: passwordStrength.color,
                                            }}
                                        />
                                    </div>
                                    <span style={{ color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            icon={<FiLock />}
                            fullWidth
                            required
                        />

                        <div className="terms-checkbox">
                            <label className="checkbox-label">
                                <input type="checkbox" required />
                                <span>
                                    Acepto los{' '}
                                    <Link to="#" className="terms-link">
                                        términos y condiciones
                                    </Link>
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Crear Cuenta
                        </Button>

                        <div className="register-divider">
                            <span>o</span>
                        </div>

                        <p className="register-login">
                            ¿Ya tienes cuenta?{' '}
                            <Link to={ROUTES.LOGIN} className="login-link">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </form>
                </Card>

                <footer className="register-footer">
                    <p>© 2025 SGC Ultimate. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
}
