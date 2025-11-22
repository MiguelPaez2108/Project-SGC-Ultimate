import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { FiMenu, FiBell, FiLogOut, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

export const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="navbar-menu-btn" onClick={onMenuClick}>
                    <FiMenu />
                </button>
                <h1 className="navbar-title">Dashboard</h1>
            </div>

            <div className="navbar-right">
                <button className="navbar-icon-btn">
                    <FiBell />
                    <span className="navbar-badge">3</span>
                </button>

                <div className="navbar-user">
                    <button
                        className="navbar-user-btn"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="navbar-user-avatar">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="navbar-user-name">{user?.email}</span>
                        <FiChevronDown className="navbar-user-icon" />
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                className="navbar-user-menu-overlay"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="navbar-user-menu">
                                <div className="navbar-user-menu-header">
                                    <p className="navbar-user-menu-email">{user?.email}</p>
                                    <p className="navbar-user-menu-role">{user?.rol}</p>
                                </div>
                                <button
                                    className="navbar-user-menu-item"
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                    }}
                                >
                                    <FiLogOut />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
