// src/components/Layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
//import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'modules', icon: '📚', label: 'Módulos', path: '/admin/modules' },
    { id: 'classrooms', icon: '🏫', label: 'Aulas', path: '/admin/classrooms' },
    { id: 'schedules', icon: '📅', label: 'Horarios', path: '/admin/schedule/edit' },
    { id: 'teachers', icon: '👨‍🏫', label: 'Docentes', path: '/admin/teachers' },
  ];

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleLogout = () => {
    // Lógica de logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="sidebar-title">
            <h3>Administrador</h3>
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
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;