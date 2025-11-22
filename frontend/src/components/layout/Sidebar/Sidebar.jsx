import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES, ROLES } from '@utils/constants';
import {
    FiHome,
    FiGrid,
    FiCalendar,
    FiDollarSign,
    FiUsers,
    FiClock,
    FiBell,
    FiFileText,
    FiUser
} from 'react-icons/fi';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose }) => {
    const { user, hasAnyRole } = useAuth();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <FiHome />,
            path: ROUTES.DASHBOARD,
            roles: [ROLES.CLIENTE, ROLES.ADMIN, ROLES.EMPLEADO],
        },
        {
            label: 'Canchas',
            icon: <FiGrid />,
            path: ROUTES.CANCHAS,
            roles: [ROLES.CLIENTE, ROLES.ADMIN, ROLES.EMPLEADO],
        },
        {
            label: 'Mis Reservas',
            icon: <FiCalendar />,
            path: ROUTES.RESERVAS,
            roles: [ROLES.CLIENTE, ROLES.ADMIN, ROLES.EMPLEADO],
        },
        {
            label: 'Pagos',
            icon: <FiDollarSign />,
            path: ROUTES.PAGOS,
            roles: [ROLES.CLIENTE, ROLES.ADMIN],
        },
        {
            label: 'Mi Perfil',
            icon: <FiUser />,
            path: ROUTES.PROFILE,
            roles: [ROLES.CLIENTE, ROLES.ADMIN, ROLES.EMPLEADO],
        },
    ];

    const adminMenuItems = [
        {
            label: 'Admin Dashboard',
            icon: <FiHome />,
            path: ROUTES.ADMIN.DASHBOARD,
        },
        {
            label: 'Usuarios',
            icon: <FiUsers />,
            path: ROUTES.ADMIN.USUARIOS,
        },
        {
            label: 'Horarios',
            icon: <FiClock />,
            path: ROUTES.ADMIN.HORARIOS,
        },
        {
            label: 'Notificaciones',
            icon: <FiBell />,
            path: ROUTES.ADMIN.NOTIFICACIONES,
        },
        {
            label: 'Auditorías',
            icon: <FiFileText />,
            path: ROUTES.ADMIN.AUDITORIAS,
        },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        hasAnyRole(item.roles)
    );

    const showAdminMenu = hasAnyRole([ROLES.ADMIN, ROLES.EMPLEADO]);

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="sidebar-logo-icon">⚽</span>
                        <span className="sidebar-logo-text">SGC Ultimate</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">Principal</h3>
                        <ul className="sidebar-menu">
                            {filteredMenuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="sidebar-menu-item"
                                        onClick={onClose}
                                    >
                                        <span className="sidebar-menu-icon">{item.icon}</span>
                                        <span className="sidebar-menu-label">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {showAdminMenu && (
                        <div className="sidebar-section">
                            <h3 className="sidebar-section-title">Administración</h3>
                            <ul className="sidebar-menu">
                                {adminMenuItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className="sidebar-menu-item"
                                            onClick={onClose}
                                        >
                                            <span className="sidebar-menu-icon">{item.icon}</span>
                                            <span className="sidebar-menu-label">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar-user-info">
                            <p className="sidebar-user-name">{user?.email}</p>
                            <p className="sidebar-user-role">{user?.rol}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
