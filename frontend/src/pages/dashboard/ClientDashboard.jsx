import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { StatCard } from '@components/features/StatCard';
import { Spinner } from '@components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@utils/constants';
import { getMisReservas } from '@api/reservas.api';
import { formatDate, formatCurrency } from '@utils/formatters';
import { FiCalendar, FiGrid, FiDollarSign, FiClock, FiPlus } from 'react-icons/fi';
import './ClientDashboard.css';

export default function ClientDashboard() {
    const navigate = useNavigate();

    // Fetch user's reservations
    const { data: reservas, isLoading } = useQuery({
        queryKey: ['mis-reservas'],
        queryFn: getMisReservas,
        retry: false,
    });

    // Calculate stats from reservations
    const stats = {
        activas: reservas?.filter(r => r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE').length || 0,
        total: reservas?.length || 0,
        pendientes: reservas?.filter(r => r.estado === 'PENDIENTE').length || 0,
    };

    const proximaReserva = reservas?.find(r =>
        (r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE') &&
        new Date(r.fechaInicio) > new Date()
    );

    return (
        <MainLayout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Bienvenido de nuevo 👋</h1>
                        <p className="dashboard-subtitle">
                            Aquí está un resumen de tu actividad
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.NUEVA_RESERVA)}
                    >
                        <FiPlus /> Nueva Reserva
                    </Button>
                </div>

                <div className="stats-grid">
                    <StatCard
                        label="Reservas Activas"
                        value={stats.activas}
                        icon={<FiCalendar />}
                        color="var(--primary-500)"
                    />
                    <StatCard
                        label="Total Reservas"
                        value={stats.total}
                        icon={<FiGrid />}
                        color="var(--secondary-500)"
                    />
                    <StatCard
                        label="Pendientes"
                        value={stats.pendientes}
                        icon={<FiDollarSign />}
                        color="var(--warning)"
                    />
                    <StatCard
                        label="Próxima Reserva"
                        value={proximaReserva ? formatDate(proximaReserva.fechaInicio, 'dd/MM HH:mm') : 'N/A'}
                        icon={<FiClock />}
                        color="var(--success)"
                    />
                </div>

                <div className="dashboard-grid">
                    <Card title="Mis Próximas Reservas" className="dashboard-card">
                        {isLoading ? (
                            <div className="loading-state">
                                <Spinner />
                            </div>
                        ) : reservas && reservas.length > 0 ? (
                            <div className="reservas-list">
                                {reservas.slice(0, 5).map((reserva) => (
                                    <div key={reserva.id} className="reserva-item">
                                        <div className="reserva-info">
                                            <h4>{reserva.canchaNombre}</h4>
                                            <p>{formatDate(reserva.fechaInicio, 'dd/MM/yyyy HH:mm')}</p>
                                        </div>
                                        <div className="reserva-meta">
                                            <span className={`badge badge--${reserva.estado.toLowerCase()}`}>
                                                {reserva.estado}
                                            </span>
                                            <span className="reserva-price">
                                                {formatCurrency(reserva.precioTotal)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <FiCalendar size={48} />
                                <p>No tienes reservas</p>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(ROUTES.NUEVA_RESERVA)}
                                >
                                    Crear Primera Reserva
                                </Button>
                            </div>
                        )}
                    </Card>

                    <Card title="Acciones Rápidas" className="dashboard-card">
                        <div className="quick-actions">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate(ROUTES.CANCHAS)}
                            >
                                <FiGrid /> Ver Canchas
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate(ROUTES.RESERVAS)}
                            >
                                <FiCalendar /> Mis Reservas
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate(ROUTES.PAGOS)}
                            >
                                <FiDollarSign /> Mis Pagos
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
