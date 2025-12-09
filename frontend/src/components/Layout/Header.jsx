import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoImage from '../../assets/images/cba.png';

const Header = ({ variant = 'default', subtitle = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('');

  // Determinar menú activo basado en la ruta
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/modules')) setActiveMenu('modules');
    else if (path.includes('/admin/classrooms')) setActiveMenu('classrooms');
    else if (path.includes('/admin/schedule')) setActiveMenu('schedules');
    else if (path.includes('/admin/teachers')) setActiveMenu('teachers');
    else if (path.includes('/admin/dashboard')) setActiveMenu('dashboard');
    else if (path.includes('/signup')) setActiveMenu('users');
    else if (path.includes('/profile')) setActiveMenu('profile');
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Primero intentar desde localStorage
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
          setUser(JSON.parse(usuarioData));
          setLoading(false);
          return;
        }
        
        // Si no hay en localStorage, intentar desde la API
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:8000/api/usuario/actual', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data);
              localStorage.setItem('usuario', JSON.stringify(data.data));
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const getSubtitleText = () => {
    if (subtitle) return subtitle;
    
    switch(variant) {
      case 'signup':
        return 'Personal Data Registration';
      case 'login':
        return 'User Authentication System';
      case 'admin':
        return 'Panel de Administración';
      case 'teacher':
        return 'Panel Docente';
      default:
        return '';
    }
  };

  const subtitleText = getSubtitleText();

  // Header para Signup/Login
  if (variant === 'signup' || variant === 'login') {
    return (
      <div className="signup-header-container">
        <div className="signup-header-content">
          <div className="logo-section">
            <img 
              src={logoImage} 
              alt="CBA Logo" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="logo-fallback">CBA</div>';
              }}
            />
          </div>
          
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">{subtitleText}</p>
          </div>
        </div>
      </div>
    );
  }

  // Header para Dashboard (Admin/Docente/Estudiante)
  return (
    <div className="app-header-container">
      {/* Logo centrado arriba */}
      <div className="app-logo-top">
        <img 
          src={logoImage} 
          alt="CBA Logo" 
          className="app-logo-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="logo-fallback-center">CBA</div>';
          }}
        />
      </div>
      
      {/* Navegación */}
      <nav className="app-navigation">
        {loading ? (
          <div className="loading-user">Cargando usuario...</div>
        ) : user ? (
          <>
            {/* Si el usuario es Administrador */}
            {user.rol_id === 1 && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-option ${activeMenu === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/modules" 
                  className={`nav-option ${activeMenu === 'modules' ? 'active' : ''}`}
                >
                  Módulos
                </Link>
                
                <Link 
                  to="/admin/schedule/edit" 
                  className={`nav-option ${activeMenu === 'schedules' ? 'active' : ''}`}
                >
                  Horarios
                </Link>
                <Link 
                  to="/signup" 
                  className={`nav-option ${activeMenu === 'users' ? 'active' : ''}`}
                >
                  Crear Usuario
                </Link>
              </>
            )}
            
            {/* Si el usuario es Docente */}
            {user.rol_id === 2 && (
              <>
                <Link to="/teacher/dashboard" className="nav-option">
                  Mi Dashboard
                </Link>
                <Link to="/teacher/schedule" className="nav-option">
                  Mis Horarios
                </Link>
                <Link to="/teacher/classrooms" className="nav-option">
                  Mis Aulas
                </Link>
              </>
            )}
            
            {/* Si el usuario es Estudiante */}
            {user.rol_id === 3 && (
              <>
                <Link to="/student/dashboard" className="nav-option">
                  Mi Dashboard
                </Link>
                <Link to="/student/modules" className="nav-option">
                  Mis Módulos
                </Link>
                <Link to="/student/schedule" className="nav-option">
                  Mi Horario
                </Link>
              </>
            )}
            
         
            
            {/* Info usuario y logout */}
            <div className="user-actions">
              <button 
                onClick={handleLogout}
                className="logout-action"
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="nav-option">
              Inicio
            </Link>
            <Link to="/login" className="nav-option">
              Login
            </Link>
            <Link to="/signup" className="nav-option">
              Registro
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;