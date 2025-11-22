import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { useAuth } from '@hooks/useAuth';
import { FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
    const { user } = useAuth();

    return (
        <MainLayout>
            <div className="profile-page">
                <div className="profile-header">
                    <h1 className="profile-title">Mi Perfil</h1>
                    <p className="profile-subtitle">
                        Información de tu cuenta
                    </p>
                </div>

                <div className="profile-content">
                    <Card className="profile-card">
                        <div className="profile-avatar">
                            <div className="avatar-circle">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="profile-info">
                            <div className="profile-field">
                                <div className="field-icon">
                                    <FiMail />
                                </div>
                                <div className="field-content">
                                    <p className="field-label">Email</p>
                                    <p className="field-value">{user?.email || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="field-icon">
                                    <FiShield />
                                </div>
                                <div className="field-content">
                                    <p className="field-label">Rol</p>
                                    <p className="field-value">{user?.rol || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="field-icon">
                                    <FiUser />
                                </div>
                                <div className="field-content">
                                    <p className="field-label">ID de Usuario</p>
                                    <p className="field-value">{user?.id?.substring(0, 12) || 'No disponible'}...</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Configuración" className="settings-card">
                        <p className="settings-message">
                            La configuración de perfil estará disponible próximamente.
                        </p>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
