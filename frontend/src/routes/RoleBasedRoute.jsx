import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@utils/constants';

/**
 * Role-based route component
 * Redirects to dashboard if user doesn't have required role
 */
export const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, hasAnyRole } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (!hasAnyRole(allowedRoles)) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return children;
};
