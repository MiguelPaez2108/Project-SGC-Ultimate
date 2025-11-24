import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@utils/constants';
import './LoginAsus.css';

// Import ASUS icons
import loginIcon01 from '../../assets/icons/login_icon_01.svg';
import loginIcon02 from '../../assets/icons/login_icon_02.svg';
import loginIcon03 from '../../assets/icons/login_icon_03.svg';
import loginIcon04 from '../../assets/icons/login_icon_04.svg';
import loginIcon05 from '../../assets/icons/login_icon_05.svg';
import loginIcon06 from '../../assets/icons/login_icon_06.svg';
import loginImg from '../../assets/icons/login_img02.png';

export default function LoginAsus() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate on blur
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'El correo electrónico es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Introduce una dirección de correo electrónico válida';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (value.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce una dirección de correo electrónico válida';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData);
      // Navigation is handled by AuthContext after successful login
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.response?.data?.message || 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asus-login-page">
      {/* Header */}
      <header className="asus-header">
        <div className="asus-logo">
          {/* Logo removed as requested */}
        </div>
      </header>

      {/* Main Content */}
      <div className="asus-wrapper">
        <div className="asus-main">
          {/* Left Side - Benefits */}
          <div className="asus-left">
            <div className="asus-ad">
              <img src={loginImg} alt="Project SGC Ultimate" className="asus-main-img" />
              <h1>Una cuenta, todo Project SGC Ultimate</h1>
              <h2>¡Inicia sesión en tu cuenta de Project SGC Ultimate y consigue todo lo que necesitas desde un portal!</h2>
              <ul>
                <li>
                  <img src={loginIcon01} alt="" />
                  <span>Gestiona tus reservas de canchas deportivas</span>
                </li>
                <li>
                  <img src={loginIcon02} alt="" />
                  <span>Realiza pagos de forma segura y rápida</span>
                </li>
                <li>
                  <img src={loginIcon03} alt="" />
                  <span>Obtén asistencia técnica y seguimiento personalizado</span>
                </li>
                <li>
                  <img src={loginIcon04} alt="" />
                  <span>Accede a tu historial completo de reservas</span>
                </li>
                <li>
                  <img src={loginIcon05} alt="" />
                  <span>Recibe notificaciones y actualizaciones en tiempo real</span>
                </li>
                <li>
                  <img src={loginIcon06} alt="" />
                  <span>Permanece al tanto de eventos y promociones exclusivas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="asus-right">
            <h3 className="asus-form-title">Acceder a la cuenta</h3>

            {errors.general && (
              <div className="asus-alert asus-alert-error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#D32F2F"/>
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="asus-form" noValidate>
              {/* Email Input */}
              <div className={`asus-form-group ${touched.email && errors.email ? 'asus-has-error' : ''} ${formData.email ? 'asus-has-value' : ''}`}>
                <label htmlFor="email">Cuenta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Su correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                />
                <span className="asus-field-hint">Su correo electrónico</span>
                {touched.email && errors.email && (
                  <span className="asus-error-text" id="email-error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Input */}
              <div className={`asus-form-group asus-password-group ${touched.password && errors.password ? 'asus-has-error' : ''} ${formData.password ? 'asus-has-value' : ''}`}>
                <label htmlFor="password">Contraseña</label>
                <div className="asus-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="current-password"
                    aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                    aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="asus-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="asus-error-text" id="password-error" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="asus-remember-me">
                <label className="asus-checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="asus-checkbox-custom"></span>
                  <span className="asus-checkbox-text">Recordar mi información</span>
                </label>
              </div>

              {/* Forgot Password */}
              <div className="asus-forgot-password">
                <Link to="/forgot-password" className="asus-link">
                  ¿Ha olvidado su contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="asus-btn asus-btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="asus-spinner"></span>
                    Accediendo...
                  </>
                ) : (
                  'Acceder'
                )}
              </button>

              {/* Register Link */}
              <div className="asus-form-footer">
                <span>¿No tienes una cuenta de Project SGC Ultimate? </span>
                <Link to={ROUTES.REGISTER} className="asus-link">
                  Inscríbete ahora
                </Link>
              </div>

              {/* Social Login */}
              <div className="asus-social-login">
                <div className="asus-divider">
                  <span>O inicia sesión con</span>
                </div>
                <div className="asus-social-buttons">
                  <button type="button" className="asus-social-btn" aria-label="Iniciar sesión con Google">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  <button type="button" className="asus-social-btn" aria-label="Iniciar sesión con Apple">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </button>
                  <button type="button" className="asus-social-btn" aria-label="Iniciar sesión con Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button type="button" className="asus-social-btn" aria-label="Iniciar sesión con Microsoft">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M1 1h10v10H1z"/>
                      <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                      <path fill="#7fba00" d="M1 13h10v10H1z"/>
                      <path fill="#ffb900" d="M13 13h10v10H13z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="asus-footer">
        <div className="asus-footer-content">
          <span className="asus-footer-copy">©ProjectSGCUltimateTeK Computer Inc.</span>
          <div className="asus-footer-links">
            <a href="#terms">Condiciones de uso</a>
            <a href="#privacy">Política de privacidad</a>
            <a href="#cookies">Configuración de cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
