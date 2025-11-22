import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { getAuditorias } from '@api/auditorias.api';
import { formatDate } from '@utils/formatters';
import { FiFileText, FiSearch } from 'react-icons/fi';
import './Auditorias.css';

export default function Auditorias() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: auditorias, isLoading } = useQuery({
        queryKey: ['auditorias'],
        queryFn: getAuditorias,
    });

    const filteredAuditorias = auditorias?.filter((auditoria) =>
        auditoria.accion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auditoria.entidad?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAccionColor = (accion) => {
        const colors = {
            CREAR: 'success',
            ACTUALIZAR: 'warning',
            ELIMINAR: 'error',
            LEER: 'info',
        };
        return colors[accion] || 'default';
    };

    return (
        <MainLayout>
            <div className="auditorias-page">
                <div className="auditorias-header">
                    <div>
                        <h1 className="auditorias-title">Registro de Auditorías</h1>
                        <p className="auditorias-subtitle">
                            Historial completo de acciones del sistema
                        </p>
                    </div>
                </div>

                <Card className="auditorias-filters-card">
                    <Input
                        placeholder="Buscar por acción o entidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<FiSearch />}
                    />
                </Card>

                <div className="auditorias-content">
                    {isLoading ? (
                        <div className="auditorias-loading">
                            <Spinner size="lg" />
                            <p>Cargando auditorías...</p>
                        </div>
                    ) : filteredAuditorias && filteredAuditorias.length > 0 ? (
                        <div className="auditorias-table-container">
                            <table className="auditorias-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Usuario</th>
                                        <th>Acción</th>
                                        <th>Entidad</th>
                                        <th>Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAuditorias.map((auditoria) => (
                                        <tr key={auditoria.id}>
                                            <td>{formatDate(auditoria.fecha, 'dd/MM/yyyy HH:mm:ss')}</td>
                                            <td>{auditoria.usuarioEmail}</td>
                                            <td>
                                                <span className={`accion-badge accion-badge--${getAccionColor(auditoria.accion)}`}>
                                                    {auditoria.accion}
                                                </span>
                                            </td>
                                            <td>{auditoria.entidad}</td>
                                            <td className="detalles-cell">{auditoria.detalles || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="auditorias-empty">
                            <FiFileText size={48} />
                            <p>No se encontraron auditorías</p>
                            <p className="empty-subtitle">
                                {searchTerm ? 'Intenta ajustar la búsqueda' : 'Las auditorías aparecerán aquí'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
