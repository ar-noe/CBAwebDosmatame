// src/components/Layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
//import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');



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
      <div style={{marginTop:160}}></div>
      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;