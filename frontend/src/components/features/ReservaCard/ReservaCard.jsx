import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { formatDate, formatCurrency } from '@utils/formatters';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi';
import './ReservaCard.css';

export const ReservaCard = ({ reserva, onCancel, onViewDetails }) => {
    const getEstadoBadge = (estado) => {
        const badges = {
            PENDIENTE: { label: 'Pendiente', class: 'warning' },
            CONFIRMADA: { label: 'Confirmada', class: 'success' },
            CANCELADA: { label: 'Cancelada', class: 'error' },
            COMPLETADA: { label: 'Completada', class: 'info' },
        };
        return badges[estado] || { label: estado, class: 'default' };
    };

    const estadoBadge = getEstadoBadge(reserva.estado);
    const isPast = new Date(reserva.fechaFin) < new Date();
    const canCancel = reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA';

    return (
        <Card className="reserva-card">
            <div className="reserva-card-header">
                <div className="reserva-card-title-row">
                    <h3 className="reserva-card-title">{reserva.canchaNombre}</h3>
                    <span className={`reserva-card-badge reserva-card-badge--${estadoBadge.class}`}>
                        {estadoBadge.label}
                    </span>
                </div>
            </div>

            <div className="reserva-card-body">
                <div className="reserva-card-info">
                    <div className="reserva-card-detail">
                        <FiCalendar />
                        <span>{formatDate(reserva.fechaInicio, 'dd/MM/yyyy')}</span>
                    </div>

                    <div className="reserva-card-detail">
                        <FiClock />
                        <span>
                            {formatDate(reserva.fechaInicio, 'HH:mm')} - {formatDate(reserva.fechaFin, 'HH:mm')}
                        </span>
                    </div>

                    <div className="reserva-card-detail">
                        <FiDollarSign />
                        <span className="reserva-card-price">{formatCurrency(reserva.precioTotal)}</span>
                    </div>
                </div>

                <div className="reserva-card-actions">
                    {canCancel && !isPast && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancel(reserva)}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(reserva)}
                    >
                        Ver Detalles
                    </Button>
                </div>
            </div>
        </Card>
    );
};
