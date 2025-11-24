import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { ROUTES, ROLES } from '@utils/constants';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

// Auth pages
const Login = lazy(() => import('@pages/auth/LoginAsus'));
const Register = lazy(() => import('@pages/auth/Register'));

// Dashboard pages
const ClientDashboard = lazy(() => import('@pages/dashboard/ClientDashboard'));
const AdminDashboard = lazy(() => import('@pages/dashboard/AdminDashboard'));

// Canchas pages
const CanchasList = lazy(() => import('@pages/canchas/CanchasList'));
const CanchaDetail = lazy(() => import('@pages/canchas/CanchaDetail'));

// Reservas pages
const MisReservas = lazy(() => import('@pages/reservas/MisReservas'));
const NuevaReserva = lazy(() => import('@pages/reservas/NuevaReserva'));

// Pagos pages
const PagosList = lazy(() => import('@pages/pagos/PagosList'));

// Profile page
const Profile = lazy(() => import('@pages/profile/Profile'));

// Admin pages
const Usuarios = lazy(() => import('@pages/admin/Usuarios'));
const Horarios = lazy(() => import('@pages/admin/Horarios'));
const Notificaciones = lazy(() => import('@pages/admin/Notificaciones'));
const Auditorias = lazy(() => import('@pages/admin/Auditorias'));

// 404 page
const NotFound = lazy(() => import('@pages/NotFound'));

// Loading component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
);

export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public routes */}
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />

                {/* Protected routes */}
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <PrivateRoute>
                            <ClientDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.CANCHAS}
                    element={
                        <PrivateRoute>
                            <CanchasList />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.CANCHA_DETAIL}
                    element={
                        <PrivateRoute>
                            <CanchaDetail />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.RESERVAS}
                    element={
                        <PrivateRoute>
                            <MisReservas />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.NUEVA_RESERVA}
                    element={
                        <PrivateRoute>
                            <NuevaReserva />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.PAGOS}
                    element={
                        <PrivateRoute>
                            <PagosList />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={ROUTES.PROFILE}
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path={ROUTES.ADMIN.DASHBOARD}
                    element={
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO]}>
                            <AdminDashboard />
                        </RoleBasedRoute>
                    }
                />

                <Route
                    path={ROUTES.ADMIN.USUARIOS}
                    element={
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Usuarios />
                        </RoleBasedRoute>
                    }
                />

                <Route
                    path={ROUTES.ADMIN.HORARIOS}
                    element={
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Horarios />
                        </RoleBasedRoute>
                    }
                />

                <Route
                    path={ROUTES.ADMIN.NOTIFICACIONES}
                    element={
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Notificaciones />
                        </RoleBasedRoute>
                    }
                />

                <Route
                    path={ROUTES.ADMIN.AUDITORIAS}
                    element={
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Auditorias />
                        </RoleBasedRoute>
                    }
                />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
