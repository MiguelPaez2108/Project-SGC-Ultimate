import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="main-layout">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <div className="main-layout-content">
                <Navbar onMenuClick={toggleSidebar} />

                <main className="main-layout-body">
                    {children}
                </main>
            </div>
        </div>
    );
};
