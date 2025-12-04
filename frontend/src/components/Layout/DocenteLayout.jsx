// src/components/Layout/DocenteLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
//import './DocenteLayout.css';

const DocenteLayout = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Inicio', path: '/docente/dashboard' },
    { id: 'schedules', icon: '📅', label: 'Mis Horarios', path: '/docente/schedules' },
    { id: 'profile', icon: '👤', label: 'Mi Perfil', path: '/docente/profile' },
  ];

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="docente-layout">
      {/* Sidebar */}
      <aside className="docente-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="sidebar-title">
            <h3>Docente</h3>
            <p>Sistema CBA</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id, item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="docente-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DocenteLayout;