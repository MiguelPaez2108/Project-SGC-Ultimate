import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

export default function AdminDashboard() {
    const stats = [
        {
            label: 'Total Usuarios',
            value: '248',
            change: '+12%',
            icon: <FiUsers />,
            color: 'var(--primary-500)',
        },
        {
            label: 'Reservas Hoy',
            value: '18',
            change: '+5%',
            icon: <FiCalendar />,
            color: 'var(--secondary-500)',
        },
        {
            label: 'Ingresos Mes',
            value: '$4.5M',
            change: '+23%',
            icon: <FiDollarSign />,
            color: 'var(--success)',
        },
        {
            label: 'Ocupación',
            value: '78%',
            change: '+8%',
            icon: <FiTrendingUp />,
            color: 'var(--warning)',
        },
    ];

    return (
        <MainLayout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Dashboard Administrativo 📊</h1>
                        <p className="dashboard-subtitle">
                            Vista general del sistema
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <Card key={index} className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon" style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">{stat.label}</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <p className="stat-value">{stat.value}</p>
                                        <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="dashboard-grid">
                    <Card title="Actividad Reciente" className="dashboard-card">
                        <div className="empty-state">
                            <p>No hay actividad reciente</p>
                        </div>
                    </Card>

                    <Card title="Reservas Pendientes" className="dashboard-card">
                        <div className="empty-state">
                            <p>No hay reservas pendientes</p>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
