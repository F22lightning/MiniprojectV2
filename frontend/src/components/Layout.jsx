import { NavLink, Outlet } from 'react-router-dom';
import { ChefHat, ListOrdered, BookOpen } from 'lucide-react';

export default function Layout() {
    return (
        <div className="layout-container">
            {/* Sidebar sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <ChefHat size={32} className="brand-icon" />
                    <h1 className="brand-title">Kitchen Buddy</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/queue"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <ListOrdered size={20} />
                        <span>Order Queue</span>
                    </NavLink>
                    <NavLink
                        to="/recipes"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>Recipe Menu</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <p>Kitchen System v1.0</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
