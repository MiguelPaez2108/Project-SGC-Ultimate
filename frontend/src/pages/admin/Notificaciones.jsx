import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Spinner } from '@components/common/Spinner';
import { getNotificaciones } from '@api/notificaciones.api';
import { formatDate } from '@utils/formatters';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import './Notificaciones.css';

export default function Notificaciones() {
    const { data: notificaciones, isLoading } = useQuery({
        queryKey: ['notificaciones'],
        queryFn: getNotificaciones,
    });

    return (
        <MainLayout>
            <div className="notificaciones-page">
                <div className="notificaciones-header">
                    <div>
                        <h1 className="notificaciones-title">Panel de Notificaciones</h1>
                        <p className="notificaciones-subtitle">
                            Historial de notificaciones del sistema
                        </p>
                    </div>
                </div>

                <div className="notificaciones-content">
                    {isLoading ? (
                        <div className="notificaciones-loading">
                            <Spinner size="lg" />
                            <p>Cargando notificaciones...</p>
                        </div>
                    ) : notificaciones && notificaciones.length > 0 ? (
                        <div className="notificaciones-list">
                            {notificaciones.map((notif) => (
                                <Card key={notif.id} className="notificacion-card">
                                    <div className="notificacion-header">
                                        <div className="notificacion-icon">
                                            <FiBell />
                                        </div>
                                        <div className="notificacion-info">
                                            <h4>{notif.titulo}</h4>
                                            <p className="notificacion-date">
                                                {formatDate(notif.fechaEnvio, 'dd/MM/yyyy HH:mm')}
                                            </p>
                                        </div>
                                        {notif.leida && (
                                            <div className="notificacion-read">
                                                <FiCheckCircle />
                                            </div>
                                        )}
                                    </div>
                                    <p className="notificacion-mensaje">{notif.mensaje}</p>
                                    <div className="notificacion-meta">
                                        <span className="notificacion-tipo">{notif.tipo}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="notificaciones-empty">
                            <FiBell size={48} />
                            <p>No hay notificaciones</p>
                            <p className="empty-subtitle">
                                Las notificaciones aparecerán aquí cuando se generen
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
