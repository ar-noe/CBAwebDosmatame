// src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <Outlet /> {/* Esto renderiza las rutas hijas */}
      </main>
    </div>
  );
};

export default Layout;