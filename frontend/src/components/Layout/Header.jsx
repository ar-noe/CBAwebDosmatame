import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      background: '#2563eb', 
      color: 'white', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Colegio CBA
        </Link>
      </div>
      
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Hola, {user.name} ({user.role})</span>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            {user.role === 'docente' && (
              <Link to="/docente" style={{ color: 'white', textDecoration: 'none' }}>
                Panel Docente
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                Panel Admin
              </Link>
            )}
            <button 
              onClick={handleLogout}
              style={{ 
                background: '#dc2626', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
              Registro
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;