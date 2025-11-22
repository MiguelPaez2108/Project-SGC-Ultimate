import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { getCanchas } from '@api/canchas.api';
import { createReserva } from '@api/reservas.api';
import { formatCurrency } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import { FiArrowLeft, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './NuevaReserva.css';

export default function NuevaReserva() {
    const navigate = useNavigate();
    const location = useLocation();
    const preselectedCancha = location.state?.cancha;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        canchaId: preselectedCancha?.id || '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
    });

    // Fetch canchas
    const { data: canchas, isLoading: loadingCanchas } = useQuery({
        queryKey: ['canchas'],
        queryFn: getCanchas,
    });

    // Create reservation mutation
    const createMutation = useMutation({
        mutationFn: createReserva,
        onSuccess: () => {
            toast.success('¡Reserva creada exitosamente!');
            navigate(ROUTES.RESERVAS);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al crear la reserva');
        },
    });

    const selectedCancha = canchas?.find((c) => c.id === formData.canchaId);

    const calculatePrecio = () => {
        if (!formData.horaInicio || !formData.horaFin || !selectedCancha) return 0;

        const [horaInicioH, horaInicioM] = formData.horaInicio.split(':').map(Number);
        const [horaFinH, horaFinM] = formData.horaFin.split(':').map(Number);

        const inicio = horaInicioH + horaInicioM / 60;
        const fin = horaFinH + horaFinM / 60;
        const horas = fin - inicio;

        return horas > 0 ? horas * selectedCancha.precioPorHora : 0;
    };

    const precioTotal = calculatePrecio();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.canchaId || !formData.fecha || !formData.horaInicio || !formData.horaFin) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (precioTotal <= 0) {
            toast.error('La hora de fin debe ser posterior a la hora de inicio');
            return;
        }

        // Create ISO datetime strings
        const fechaInicio = new Date(`${formData.fecha}T${formData.horaInicio}:00`).toISOString();
        const fechaFin = new Date(`${formData.fecha}T${formData.horaFin}:00`).toISOString();

        const reservaData = {
            canchaId: formData.canchaId,
            fechaInicio,
            fechaFin,
            precioTotal,
        };

        createMutation.mutate(reservaData);
    };

    return (
        <MainLayout>
            <div className="nueva-reserva-page">
                <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.CANCHAS)}
                    className="nueva-reserva-back"
                >
                    <FiArrowLeft /> Volver
                </Button>

                <div className="nueva-reserva-header">
                    <h1 className="nueva-reserva-title">Nueva Reserva</h1>
                    <p className="nueva-reserva-subtitle">
                        Completa los datos para crear tu reserva
                    </p>
                </div>

                <div className="nueva-reserva-content">
                    <Card className="nueva-reserva-form-card">
                        <form onSubmit={handleSubmit} className="nueva-reserva-form">
                            {/* Step 1: Select Cancha */}
                            <div className="form-section">
                                <h3 className="form-section-title">1. Selecciona la Cancha</h3>

                                {loadingCanchas ? (
                                    <div className="form-loading">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="cancha-select-grid">
                                        {canchas?.filter(c => c.estado === 'ACTIVA').map((cancha) => (
                                            <div
                                                key={cancha.id}
                                                className={`cancha-select-item ${formData.canchaId === cancha.id ? 'selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, canchaId: cancha.id })}
                                            >
                                                <div className="cancha-select-name">{cancha.nombre}</div>
                                                <div className="cancha-select-price">
                                                    {formatCurrency(cancha.precioPorHora)}/hora
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Select Date and Time */}
                            {formData.canchaId && (
                                <div className="form-section">
                                    <h3 className="form-section-title">2. Selecciona Fecha y Hora</h3>

                                    <div className="form-grid">
                                        <Input
                                            label="Fecha"
                                            type="date"
                                            value={formData.fecha}
                                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            icon={<FiCalendar />}
                                            required
                                            fullWidth
                                        />

                                        <Input
                                            label="Hora Inicio"
                                            type="time"
                                            value={formData.horaInicio}
                                            onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                            icon={<FiClock />}
                                            required
                                            fullWidth
                                        />

                                        <Input
                                            label="Hora Fin"
                                            type="time"
                                            value={formData.horaFin}
                                            onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                                            icon={<FiClock />}
                                            required
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            {formData.canchaId && formData.fecha && formData.horaInicio && formData.horaFin && (
                                <div className="form-section">
                                    <h3 className="form-section-title">3. Resumen</h3>

                                    <div className="reserva-summary">
                                        <div className="summary-item">
                                            <span className="summary-label">Cancha:</span>
                                            <span className="summary-value">{selectedCancha?.nombre}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Fecha:</span>
                                            <span className="summary-value">{formData.fecha}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Horario:</span>
                                            <span className="summary-value">
                                                {formData.horaInicio} - {formData.horaFin}
                                            </span>
                                        </div>
                                        <div className="summary-item summary-total">
                                            <span className="summary-label">Total:</span>
                                            <span className="summary-value">{formatCurrency(precioTotal)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        loading={createMutation.isPending}
                                    >
                                        <FiCalendar /> Confirmar Reserva
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
