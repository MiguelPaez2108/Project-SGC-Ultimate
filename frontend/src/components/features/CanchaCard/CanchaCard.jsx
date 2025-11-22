import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { FiMapPin, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { formatCurrency } from '@utils/formatters';
import { CANCHA_TIPOS } from '@utils/constants';
import './CanchaCard.css';

export const CanchaCard = ({ cancha, onSelect }) => {
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

    const getEstadoBadge = (estado) => {
        const badges = {
            ACTIVA: { label: 'Disponible', class: 'success' },
            INACTIVA: { label: 'No Disponible', class: 'error' },
            MANTENIMIENTO: { label: 'Mantenimiento', class: 'warning' },
        };
        return badges[estado] || { label: estado, class: 'default' };
    };

    const estadoBadge = getEstadoBadge(cancha.estado);

    return (
        <Card className="cancha-card" hoverable>
            <div className="cancha-card-image">
                <div className="cancha-card-placeholder">
                    <span className="cancha-card-icon">⚽</span>
                </div>
                <span className={`cancha-card-badge cancha-card-badge--${estadoBadge.class}`}>
                    {estadoBadge.label}
                </span>
            </div>

            <div className="cancha-card-content">
                <div className="cancha-card-header">
                    <h3 className="cancha-card-title">{cancha.nombre}</h3>
                    <span className="cancha-card-type">{getTipoLabel(cancha.tipo)}</span>
                </div>

                <div className="cancha-card-details">
                    {cancha.ubicacion && (
                        <div className="cancha-card-detail">
                            <FiMapPin />
                            <span>{cancha.ubicacion}</span>
                        </div>
                    )}

                    <div className="cancha-card-detail">
                        <FiDollarSign />
                        <span>{formatCurrency(cancha.precioPorHora)}/hora</span>
                    </div>

                    {cancha.techada && (
                        <div className="cancha-card-detail">
                            <FiCheckCircle />
                            <span>Techada</span>
                        </div>
                    )}
                </div>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onSelect(cancha)}
                    disabled={cancha.estado !== 'ACTIVA'}
                >
                    {cancha.estado === 'ACTIVA' ? 'Ver Detalles' : 'No Disponible'}
                </Button>
            </div>
        </Card>
    );
};
