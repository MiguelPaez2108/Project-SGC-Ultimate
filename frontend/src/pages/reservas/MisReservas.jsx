import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { ReservaCard } from '@components/features/ReservaCard';
import { Button } from '@components/common/Button';
import { Spinner } from '@components/common/Spinner';
import { getMisReservas, updateReservaEstado } from '@api/reservas.api';
import { ROUTES, RESERVA_ESTADOS } from '@utils/constants';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiPlus, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './MisReservas.css';

export default function MisReservas() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filterEstado, setFilterEstado] = useState('');

    // Fetch reservations
    const { data: reservas, isLoading, error } = useQuery({
        queryKey: ['mis-reservas'],
        queryFn: getMisReservas,
    });

    // Cancel reservation mutation
    const cancelMutation = useMutation({
        mutationFn: (reservaId) => updateReservaEstado(reservaId, RESERVA_ESTADOS.CANCELADA),
        onSuccess: () => {
            queryClient.invalidateQueries(['mis-reservas']);
            toast.success('Reserva cancelada exitosamente');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al cancelar la reserva');
        },
    });

    // Filter reservations
    const filteredReservas = reservas?.filter((reserva) => {
        if (!filterEstado) return true;
        return reserva.estado === filterEstado;
    });

    // Group reservations
    const upcomingReservas = filteredReservas?.filter(
        (r) => new Date(r.fechaInicio) > new Date() &&
            (r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE')
    );

    const pastReservas = filteredReservas?.filter(
        (r) => new Date(r.fechaFin) < new Date() ||
            r.estado === 'COMPLETADA' || r.estado === 'CANCELADA'
    );

    const handleCancelReserva = (reserva) => {
        if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
            cancelMutation.mutate(reserva.id);
        }
    };

    const handleViewDetails = (reserva) => {
        // Navigate to detail view (to be implemented)
        toast.info('Vista de detalles próximamente');
    };

    return (
        <MainLayout>
            <div className="mis-reservas-page">
                <div className="mis-reservas-header">
                    <div>
                        <h1 className="mis-reservas-title">Mis Reservas</h1>
                        <p className="mis-reservas-subtitle">
                            Administra tus reservas de canchas
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.NUEVA_RESERVA)}
                    >
                        <FiPlus /> Nueva Reserva
                    </Button>
                </div>

                <div className="mis-reservas-filters">
                    <div className="filter-item">
                        <label>Filtrar por estado</label>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas</option>
                            <option value={RESERVA_ESTADOS.PENDIENTE}>Pendientes</option>
                            <option value={RESERVA_ESTADOS.CONFIRMADA}>Confirmadas</option>
                            <option value={RESERVA_ESTADOS.CANCELADA}>Canceladas</option>
                            <option value={RESERVA_ESTADOS.COMPLETADA}>Completadas</option>
                        </select>
                    </div>
                </div>

                <div className="mis-reservas-content">
                    {isLoading ? (
                        <div className="mis-reservas-loading">
                            <Spinner size="lg" />
                            <p>Cargando reservas...</p>
                        </div>
                    ) : error ? (
                        <div className="mis-reservas-error">
                            <p>Error al cargar las reservas</p>
                            <p className="error-message">{error.message}</p>
                        </div>
                    ) : filteredReservas && filteredReservas.length > 0 ? (
                        <>
                            {upcomingReservas && upcomingReservas.length > 0 && (
                                <div className="reservas-section">
                                    <h2 className="section-title">Próximas Reservas</h2>
                                    <div className="reservas-grid">
                                        {upcomingReservas.map((reserva) => (
                                            <ReservaCard
                                                key={reserva.id}
                                                reserva={reserva}
                                                onCancel={handleCancelReserva}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pastReservas && pastReservas.length > 0 && (
                                <div className="reservas-section">
                                    <h2 className="section-title">Historial</h2>
                                    <div className="reservas-grid">
                                        {pastReservas.map((reserva) => (
                                            <ReservaCard
                                                key={reserva.id}
                                                reserva={reserva}
                                                onCancel={handleCancelReserva}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="mis-reservas-empty">
                            <FiCalendar size={48} />
                            <p>No tienes reservas</p>
                            <p className="empty-subtitle">Crea tu primera reserva para comenzar</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate(ROUTES.NUEVA_RESERVA)}
                            >
                                <FiPlus /> Nueva Reserva
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
