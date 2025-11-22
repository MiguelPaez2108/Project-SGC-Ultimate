import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@components/layout/MainLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Spinner } from '@components/common/Spinner';
import { getUsuarios, updateUsuarioActivo } from '@api/usuarios.api';
import { formatDate } from '@utils/formatters';
import { FiUsers, FiSearch, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Usuarios.css';

export default function Usuarios() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState('');
    const [filterActivo, setFilterActivo] = useState('');

    // Fetch usuarios
    const { data: usuarios, isLoading, error } = useQuery({
        queryKey: ['usuarios'],
        queryFn: getUsuarios,
    });

    // Debug logging
    console.log('Usuarios page:', { usuarios, isLoading, error });

    // Toggle active mutation
    const toggleActiveMutation = useMutation({
        mutationFn: ({ id, activo }) => updateUsuarioActivo(id, activo),
        onSuccess: () => {
            queryClient.invalidateQueries(['usuarios']);
            toast.success('Usuario actualizado exitosamente');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al actualizar usuario');
        },
    });

    // Filter usuarios
    const filteredUsuarios = usuarios?.filter((usuario) => {
        const matchesSearch =
            usuario.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRol = !filterRol || usuario.rol === filterRol;
        const matchesActivo = filterActivo === '' || usuario.activo.toString() === filterActivo;
        return matchesSearch && matchesRol && matchesActivo;
    });

    const handleToggleActive = (usuario) => {
        const action = usuario.activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${action} a ${usuario.nombreCompleto}?`)) {
            toggleActiveMutation.mutate({ id: usuario.id, activo: !usuario.activo });
        }
    };

    const getRolBadge = (rol) => {
        const badges = {
            ADMIN: { label: 'Admin', class: 'admin' },
            EMPLEADO: { label: 'Empleado', class: 'empleado' },
            CLIENTE: { label: 'Cliente', class: 'cliente' },
        };
        return badges[rol] || { label: rol, class: 'default' };
    };

    return (
        <MainLayout>
            <div className="usuarios-page">
                <div className="usuarios-header">
                    <div>
                        <h1 className="usuarios-title">Gestión de Usuarios</h1>
                        <p className="usuarios-subtitle">
                            Administra los usuarios del sistema
                        </p>
                    </div>
                </div>

                <Card className="usuarios-filters-card">
                    <div className="usuarios-filters">
                        <div className="filter-search">
                            <Input
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<FiSearch />}
                            />
                        </div>

                        <div className="filter-group">
                            <div className="filter-item">
                                <label>Rol</label>
                                <select
                                    value={filterRol}
                                    onChange={(e) => setFilterRol(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Todos</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="EMPLEADO">Empleado</option>
                                    <option value="CLIENTE">Cliente</option>
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Estado</label>
                                <select
                                    value={filterActivo}
                                    onChange={(e) => setFilterActivo(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Todos</option>
                                    <option value="true">Activos</option>
                                    <option value="false">Inactivos</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="usuarios-content">
                    {isLoading ? (
                        <div className="usuarios-loading">
                            <Spinner size="lg" />
                            <p>Cargando usuarios...</p>
                        </div>
                    ) : error ? (
                        <div className="usuarios-error">
                            <p>Error al cargar los usuarios</p>
                            <p className="error-message">{error.message}</p>
                        </div>
                    ) : filteredUsuarios && filteredUsuarios.length > 0 ? (
                        <>
                            <div className="usuarios-count">
                                {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
                            </div>
                            <div className="usuarios-table-container">
                                <table className="usuarios-table">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                            <th>Rol</th>
                                            <th>Registro</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsuarios.map((usuario) => {
                                            const rolBadge = getRolBadge(usuario.rol);
                                            return (
                                                <tr key={usuario.id}>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-avatar">
                                                                {usuario.nombreCompleto?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span>{usuario.nombreCompleto}</span>
                                                        </div>
                                                    </td>
                                                    <td>{usuario.email}</td>
                                                    <td>{usuario.telefono || 'N/A'}</td>
                                                    <td>
                                                        <span className={`rol-badge rol-badge--${rolBadge.class}`}>
                                                            <FiShield />
                                                            {rolBadge.label}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(usuario.fechaRegistro, 'dd/MM/yyyy')}</td>
                                                    <td>
                                                        <span className={`status-badge ${usuario.activo ? 'status-active' : 'status-inactive'}`}>
                                                            {usuario.activo ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant={usuario.activo ? 'outline' : 'primary'}
                                                            size="sm"
                                                            onClick={() => handleToggleActive(usuario)}
                                                        >
                                                            {usuario.activo ? <FiUserX /> : <FiUserCheck />}
                                                            {usuario.activo ? 'Desactivar' : 'Activar'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="usuarios-empty">
                            <FiUsers size={48} />
                            <p>No se encontraron usuarios</p>
                            <p className="empty-subtitle">Intenta ajustar los filtros</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
