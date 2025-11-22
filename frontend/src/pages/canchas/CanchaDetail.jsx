import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Spinner } from '@components/common/Spinner';
import { getCanchaById } from '@api/canchas.api';
import { formatCurrency } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import {
    FiMapPin,
    FiDollarSign,
    FiCheckCircle,
    FiXCircle,
    FiArrowLeft,
    FiCalendar
} from 'react-icons/fi';
import './CanchaDetail.css';

export default function CanchaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: cancha, isLoading, error } = useQuery({
        queryKey: ['cancha', id],
        queryFn: () => getCanchaById(id),
    });

    const getTipoLabel = (tipo) => {
        const labels = {
            FUTSAL: 'Futsal',
            FUTBOL_5: 'Fútbol 5',
            FUTBOL_7: 'Fútbol 7',
            FUTBOL_11: 'Fútbol 11',
            OTRO: 'Otro',
        };
        return labels[tipo] || tipo;
    };

    const getEstadoInfo = (estado) => {
        const info = {
            ACTIVA: { label: 'Disponible', class: 'success', icon: <FiCheckCircle /> },
            INACTIVA: { label: 'No Disponible', class: 'error', icon: <FiXCircle /> },
            MANTENIMIENTO: { label: 'En Mantenimiento', class: 'warning', icon: <FiXCircle /> },
        };
        return info[estado] || { label: estado, class: 'default', icon: <FiCheckCircle /> };
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="cancha-detail-loading">
                    <Spinner size="lg" />
                    <p>Cargando información...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !cancha) {
        return (
            <MainLayout>
                <div className="cancha-detail-error">
                    <p>Error al cargar la cancha</p>
                    <Button onClick={() => navigate(ROUTES.CANCHAS)}>
                        Volver a Canchas
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const estadoInfo = getEstadoInfo(cancha.estado);

    return (
        <MainLayout>
            <div className="cancha-detail">
                <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.CANCHAS)}
                    className="cancha-detail-back"
                >
                    <FiArrowLeft /> Volver a Canchas
                </Button>

                <div className="cancha-detail-header">
                    <div className="cancha-detail-image">
                        <div className="cancha-detail-placeholder">
                            <span className="cancha-detail-icon">⚽</span>
                        </div>
                    </div>

                    <div className="cancha-detail-info">
                        <div className="cancha-detail-title-row">
                            <h1 className="cancha-detail-title">{cancha.nombre}</h1>
                            <span className={`cancha-detail-badge cancha-detail-badge--${estadoInfo.class}`}>
                                {estadoInfo.icon}
                                {estadoInfo.label}
                            </span>
                        </div>

                        <div className="cancha-detail-meta">
                            <span className="cancha-detail-type">{getTipoLabel(cancha.tipo)}</span>
                            {cancha.techada && (
                                <span className="cancha-detail-feature">
                                    <FiCheckCircle /> Techada
                                </span>
                            )}
                        </div>

                        <div className="cancha-detail-specs">
                            {cancha.ubicacion && (
                                <div className="cancha-detail-spec">
                                    <FiMapPin />
                                    <div>
                                        <p className="spec-label">Ubicación</p>
                                        <p className="spec-value">{cancha.ubicacion}</p>
                                    </div>
                                </div>
                            )}

                            <div className="cancha-detail-spec">
                                <FiDollarSign />
                                <div>
                                    <p className="spec-label">Precio por Hora</p>
                                    <p className="spec-value">{formatCurrency(cancha.precioPorHora)}</p>
                                </div>
                            </div>
                        </div>

                        {cancha.estado === 'ACTIVA' && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate(ROUTES.NUEVA_RESERVA, { state: { cancha } })}
                            >
                                <FiCalendar /> Reservar Ahora
                            </Button>
                        )}
                    </div>
                </div>

                <div className="cancha-detail-content">
                    <Card title="Información Adicional">
                        <div className="cancha-detail-description">
                            <p>
                                Cancha de {getTipoLabel(cancha.tipo)}
                                {cancha.techada ? ' techada' : ''} disponible para reservas.
                            </p>
                            {cancha.ubicacion && (
                                <p>Ubicada en {cancha.ubicacion}.</p>
                            )}
                            <p>
                                Precio: {formatCurrency(cancha.precioPorHora)} por hora.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
