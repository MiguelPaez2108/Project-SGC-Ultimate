import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { updateCancha } from '@api/canchas.api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import './EditCanchaModal.css';

export function EditCanchaModal({ cancha, onClose }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        nombre: cancha.nombre || '',
        tipo: cancha.tipo || 'FUTBOL_11',
        ubicacion: cancha.ubicacion || '',
        precioPorHora: cancha.precioPorHora || '',
        estado: cancha.estado || 'ACTIVA',
        techada: cancha.techada || false,
        imagenUrl: cancha.imagenUrl || '',
    });

    const updateMutation = useMutation({
        mutationFn: () => updateCancha(cancha.id, formData),
        onSuccess: async () => {
            toast.success('Cancha actualizada exitosamente');
            
            // Invalidate and refetch all cancha-related queries
            await queryClient.invalidateQueries({ queryKey: ['canchas'], exact: false });
            await queryClient.refetchQueries({ queryKey: ['canchas'], type: 'active' });
            
            // Wait a bit more to ensure the UI has updated
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Close modal
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al actualizar cancha');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Cancha</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">
                        <label>Tipo de Cancha</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="FUTSAL">Futsal</option>
                            <option value="FUTBOL_5">Fútbol 5</option>
                            <option value="FUTBOL_7">Fútbol 7</option>
                            <option value="FUTBOL_11">Fútbol 11</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>

                    <Input
                        label="Ubicación"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                    />

                    <Input
                        label="URL de Imagen"
                        name="imagenUrl"
                        value={formData.imagenUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />

                    <Input
                        label="Precio por Hora"
                        name="precioPorHora"
                        type="number"
                        value={formData.precioPorHora}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">
                        <label>Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="ACTIVA">Activa</option>
                            <option value="INACTIVA">Inactiva</option>
                            <option value="MANTENIMIENTO">Mantenimiento</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="techada"
                                checked={formData.techada}
                                onChange={handleChange}
                            />
                            <span>Cancha Techada</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={updateMutation.isPending}
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
