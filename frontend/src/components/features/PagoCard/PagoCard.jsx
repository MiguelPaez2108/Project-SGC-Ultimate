import { Card } from '@components/common/Card';
import { formatDate, formatCurrency } from '@utils/formatters';
import { FiCalendar, FiDollarSign, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import './PagoCard.css';

export const PagoCard = ({ pago }) => {
    const getMetodoIcon = (metodo) => {
        const icons = {
            EFECTIVO: <FiDollarSign />,
            TARJETA: <FiCreditCard />,
            TRANSFERENCIA: <FiCreditCard />,
        };
        return icons[metodo] || <FiDollarSign />;
    };

    const getMetodoLabel = (metodo) => {
        const labels = {
            EFECTIVO: 'Efectivo',
            TARJETA: 'Tarjeta',
            TRANSFERENCIA: 'Transferencia',
        };
        return labels[metodo] || metodo;
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            PENDIENTE: { label: 'Pendiente', class: 'warning' },
            COMPLETADO: { label: 'Completado', class: 'success' },
            FALLIDO: { label: 'Fallido', class: 'error' },
        };
        return badges[estado] || { label: estado, class: 'default' };
    };

    const estadoBadge = getEstadoBadge(pago.estado);

    return (
        <Card className="pago-card">
            <div className="pago-card-header">
                <div className="pago-card-title-row">
                    <div className="pago-card-amount">{formatCurrency(pago.monto)}</div>
                    <span className={`pago-card-badge pago-card-badge--${estadoBadge.class}`}>
                        {estadoBadge.label}
                    </span>
                </div>
            </div>

            <div className="pago-card-body">
                <div className="pago-card-details">
                    <div className="pago-card-detail">
                        <FiCalendar />
                        <div>
                            <p className="detail-label">Fecha</p>
                            <p className="detail-value">{formatDate(pago.fechaPago, 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                    </div>

                    <div className="pago-card-detail">
                        {getMetodoIcon(pago.metodoPago)}
                        <div>
                            <p className="detail-label">Método de Pago</p>
                            <p className="detail-value">{getMetodoLabel(pago.metodoPago)}</p>
                        </div>
                    </div>

                    {pago.reservaId && (
                        <div className="pago-card-detail">
                            <FiCheckCircle />
                            <div>
                                <p className="detail-label">Reserva</p>
                                <p className="detail-value">#{pago.reservaId.substring(0, 8)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
