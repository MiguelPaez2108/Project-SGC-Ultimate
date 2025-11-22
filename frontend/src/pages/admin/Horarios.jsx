import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { getHorariosByCancha, createHorario, deleteHorario } from '@api/horarios.api';
import { getCanchas } from '@api/canchas.api';
import { FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Horarios.css';

export default function Horarios() {
    const queryClient = useQueryClient();
    const [selectedCanchaId, setSelectedCanchaId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        diaSemana: 'LUNES',
        horaInicio: '',
        horaFin: '',
    });

    // Fetch canchas
    const { data: canchas } = useQuery({
        queryKey: ['canchas'],
        queryFn: getCanchas,
    });

    // Fetch horarios for selected cancha
    const { data: horarios, isLoading } = useQuery({
        queryKey: ['horarios', selectedCanchaId],
        queryFn: () => getHorariosByCancha(selectedCanchaId),
        enabled: !!selectedCanchaId,
    });

    // Create horario mutation
    const createMutation = useMutation({
        mutationFn: createHorario,
        onSuccess: () => {
            queryClient.invalidateQueries(['horarios', selectedCanchaId]);
            toast.success('Horario creado exitosamente');
            setShowForm(false);
            setFormData({ diaSemana: 'LUNES', horaInicio: '', horaFin: '' });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al crear horario');
        },
    });

    // Delete horario mutation
    const deleteMutation = useMutation({
        mutationFn: deleteHorario,
        onSuccess: () => {
            queryClient.invalidateQueries(['horarios', selectedCanchaId]);
            toast.success('Horario eliminado exitosamente');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al eliminar horario');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCanchaId || !formData.horaInicio || !formData.horaFin) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        createMutation.mutate({
            canchaId: selectedCanchaId,
            ...formData,
        });
    };

    const handleDelete = (horarioId) => {
        if (window.confirm('¿Estás seguro de eliminar este horario?')) {
            deleteMutation.mutate(horarioId);
        }
    };

    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

    return (
        <MainLayout>
            <div className="horarios-page">
                <div className="horarios-header">
                    <div>
                        <h1 className="horarios-title">Gestión de Horarios</h1>
                        <p className="horarios-subtitle">
                            Administra los horarios de disponibilidad de las canchas
                        </p>
                    </div>
                    {selectedCanchaId && (
                        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                            <FiPlus /> Nuevo Horario
                        </Button>
                    )}
                </div>

                <Card className="horarios-filters-card">
                    <div className="filter-item">
                        <label>Seleccionar Cancha</label>
                        <select
                            value={selectedCanchaId}
                            onChange={(e) => setSelectedCanchaId(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Selecciona una cancha</option>
                            {canchas?.map((cancha) => (
                                <option key={cancha.id} value={cancha.id}>
                                    {cancha.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </Card>

                {showForm && (
                    <Card className="horarios-form-card">
                        <h3>Nuevo Horario</h3>
                        <form onSubmit={handleSubmit} className="horarios-form">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Día de la Semana</label>
                                    <select
                                        value={formData.diaSemana}
                                        onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })}
                                        className="filter-select"
                                    >
                                        {diasSemana.map((dia) => (
                                            <option key={dia} value={dia}>{dia}</option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Hora Inicio"
                                    type="time"
                                    value={formData.horaInicio}
                                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Hora Fin"
                                    type="time"
                                    value={formData.horaFin}
                                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" loading={createMutation.isPending}>
                                    Crear Horario
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {selectedCanchaId && (
                    <div className="horarios-content">
                        {isLoading ? (
                            <div className="horarios-loading">
                                <Spinner size="lg" />
                                <p>Cargando horarios...</p>
                            </div>
                        ) : horarios && horarios.length > 0 ? (
                            <div className="horarios-grid">
                                {diasSemana.map((dia) => {
                                    const horariosDelDia = horarios.filter((h) => h.diaSemana === dia);
                                    return (
                                        <Card key={dia} className="dia-card">
                                            <h4>{dia}</h4>
                                            {horariosDelDia.length > 0 ? (
                                                <div className="horarios-list">
                                                    {horariosDelDia.map((horario) => (
                                                        <div key={horario.id} className="horario-item">
                                                            <div className="horario-time">
                                                                <FiClock />
                                                                <span>{horario.horaInicio} - {horario.horaFin}</span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(horario.id)}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="no-horarios">Sin horarios</p>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="horarios-empty">
                                <FiClock size={48} />
                                <p>No hay horarios configurados</p>
                                <p className="empty-subtitle">Crea el primer horario para esta cancha</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
