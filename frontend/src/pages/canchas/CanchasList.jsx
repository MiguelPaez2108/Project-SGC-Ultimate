import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { CanchaCard } from '@components/features/CanchaCard';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { getCanchas } from '@api/canchas.api';
import { ROUTES, CANCHA_TIPOS, CANCHA_ESTADOS } from '@utils/constants';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './CanchasList.css';

export default function CanchasList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('');

    // Fetch canchas
    const { data: canchas, isLoading, error } = useQuery({
        queryKey: ['canchas'],
        queryFn: getCanchas,
    });

    // Filter canchas
    const filteredCanchas = canchas?.filter((cancha) => {
        const matchesSearch = cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = !selectedTipo || cancha.tipo === selectedTipo;
        const matchesEstado = !selectedEstado || cancha.estado === selectedEstado;
        return matchesSearch && matchesTipo && matchesEstado;
    });

    const handleSelectCancha = (cancha) => {
        navigate(`${ROUTES.CANCHAS}/${cancha.id}`);
    };

    return (
        <MainLayout>
            <div className="canchas-page">
                <div className="canchas-header">
                    <div>
                        <h1 className="canchas-title">Canchas Disponibles</h1>
                        <p className="canchas-subtitle">
                            Encuentra la cancha perfecta para tu partido
                        </p>
                    </div>
                </div>

                <div className="canchas-filters">
                    <div className="canchas-search">
                        <Input
                            placeholder="Buscar canchas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<FiSearch />}
                        />
                    </div>

                    <div className="canchas-filter-group">
                        <div className="filter-item">
                            <label>Tipo</label>
                            <select
                                value={selectedTipo}
                                onChange={(e) => setSelectedTipo(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Todos</option>
                                <option value={CANCHA_TIPOS.FUTSAL}>Futsal</option>
                                <option value={CANCHA_TIPOS.FUTBOL_5}>Fútbol 5</option>
                                <option value={CANCHA_TIPOS.FUTBOL_7}>Fútbol 7</option>
                                <option value={CANCHA_TIPOS.FUTBOL_11}>Fútbol 11</option>
                                <option value={CANCHA_TIPOS.OTRO}>Otro</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Estado</label>
                            <select
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Todos</option>
                                <option value={CANCHA_ESTADOS.ACTIVA}>Disponible</option>
                                <option value={CANCHA_ESTADOS.MANTENIMIENTO}>Mantenimiento</option>
                                <option value={CANCHA_ESTADOS.INACTIVA}>No Disponible</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="canchas-content">
                    {isLoading ? (
                        <div className="canchas-loading">
                            <Spinner size="lg" />
                            <p>Cargando canchas...</p>
                        </div>
                    ) : error ? (
                        <div className="canchas-error">
                            <p>Error al cargar las canchas</p>
                            <p className="error-message">{error.message}</p>
                        </div>
                    ) : filteredCanchas && filteredCanchas.length > 0 ? (
                        <>
                            <div className="canchas-count">
                                {filteredCanchas.length} {filteredCanchas.length === 1 ? 'cancha encontrada' : 'canchas encontradas'}
                            </div>
                            <div className="canchas-grid">
                                {filteredCanchas.map((cancha) => (
                                    <CanchaCard
                                        key={cancha.id}
                                        cancha={cancha}
                                        onSelect={handleSelectCancha}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="canchas-empty">
                            <FiFilter size={48} />
                            <p>No se encontraron canchas</p>
                            <p className="empty-subtitle">Intenta ajustar los filtros</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
