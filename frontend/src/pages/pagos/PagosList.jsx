import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { PagoCard } from '@components/features/PagoCard';
import { StatCard } from '@components/features/StatCard';
import { Spinner } from '@components/common/Spinner';
import { getPagosByUsuario } from '@api/pagos.api';
import { formatCurrency } from '@utils/formatters';
import { FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import './PagosList.css';

export default function PagosList() {
    const [filterEstado, setFilterEstado] = useState('');

    // Fetch pagos
    const { data: pagos, isLoading, error } = useQuery({
        queryKey: ['mis-pagos'],
        queryFn: getPagosByUsuario,
    });

    // Debug logging
    console.log('Pagos page:', { pagos, isLoading, error });

    // Calculate stats
    const stats = {
        total: pagos?.reduce((sum, p) => sum + p.monto, 0) || 0,
        completados: pagos?.filter(p => p.estado === 'COMPLETADO').length || 0,
        pendientes: pagos?.filter(p => p.estado === 'PENDIENTE').length || 0,
        count: pagos?.length || 0,
    };

    // Filter pagos
    const filteredPagos = pagos?.filter((pago) => {
        if (!filterEstado) return true;
        return pago.estado === filterEstado;
    });

    // Sort by date (most recent first)
    const sortedPagos = filteredPagos?.sort((a, b) =>
        new Date(b.fechaPago) - new Date(a.fechaPago)
    );

    return (
        <MainLayout>
            <div className="pagos-page">
                <div className="pagos-header">
                    <div>
                        <h1 className="pagos-title">Mis Pagos</h1>
                        <p className="pagos-subtitle">
                            Historial de pagos y transacciones
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatCard
                        label="Total Pagado"
                        value={formatCurrency(stats.total)}
                        icon={<FiDollarSign />}
                        color="var(--primary-500)"
                    />
                    <StatCard
                        label="Pagos Completados"
                        value={stats.completados}
                        icon={<FiCheckCircle />}
                        color="var(--success)"
                    />
                    <StatCard
                        label="Pagos Pendientes"
                        value={stats.pendientes}
                        icon={<FiClock />}
                        color="var(--warning)"
                    />
                    <StatCard
                        label="Total Transacciones"
                        value={stats.count}
                        icon={<FiTrendingUp />}
                        color="var(--secondary-500)"
                    />
                </div>

                <div className="pagos-filters">
                    <div className="filter-item">
                        <label>Filtrar por estado</label>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="COMPLETADO">Completados</option>
                            <option value="FALLIDO">Fallidos</option>
                        </select>
                    </div>
                </div>

                <div className="pagos-content">
                    {isLoading ? (
                        <div className="pagos-loading">
                            <Spinner size="lg" />
                            <p>Cargando pagos...</p>
                        </div>
                    ) : error ? (
                        <div className="pagos-error">
                            <p>Error al cargar los pagos</p>
                            <p className="error-message">{error.message}</p>
                        </div>
                    ) : sortedPagos && sortedPagos.length > 0 ? (
                        <>
                            <div className="pagos-count">
                                {sortedPagos.length} {sortedPagos.length === 1 ? 'pago encontrado' : 'pagos encontrados'}
                            </div>
                            <div className="pagos-grid">
                                {sortedPagos.map((pago) => (
                                    <PagoCard key={pago.id} pago={pago} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="pagos-empty">
                            <FiDollarSign size={48} />
                            <p>No tienes pagos registrados</p>
                            <p className="empty-subtitle">
                                Los pagos aparecerán aquí cuando realices reservas
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
