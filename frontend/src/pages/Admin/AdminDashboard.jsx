import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import libroIcon from '../../assets/images/libro.png';
import aulaIcon from '../../assets/images/aula.png';
import estIcon from '../../assets/images/estudiante.png';
import profIcon from '../../assets/images/profesor.png';
import libroSIcon from '../../assets/images/libroSelect.png';
import aulaSIcon from '../../assets/images/aulaSelect.png';
import calSIcon from '../../assets/images/calendarioSelect.png';
import profSIcon from '../../assets/images/profesorSelected.png';

import './AdminDashboard.css';
import Layout from '../../components/Layout/Layout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    modulos: 25,  // Valores por defecto
    aulas: 12,
    docentes: 15,
    estudiantes: 350
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    
    if (usuarioData) {
      setUser(JSON.parse(usuarioData));
    }
    
    if (token) {
      setHasToken(true);
      fetchDashboardStats(token);
    } else {
      // Si no hay token, usar datos por defecto
      console.warn('No se encontró token de autenticación');
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/estadisticas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats({
          modulos: data.data.modulos || 25,
          aulas: data.data.aulas || 12,
          docentes: data.data.docentes || 15,
          estudiantes: data.data.estudiantes || 350
        });
      } else {
        console.warn('Respuesta del servidor:', data.message);
        // Mantener datos por defecto
      }
      
    } catch (error) {
      console.error('Error cargando estadísticas:', error.message);
      // Mantener datos por defecto si falla
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'modules',
      title: 'Módulos Impartidos',
      description: 'Gestiona modulos_impartidos',
      icon: libroSIcon,
      color: '#7fb4e0',
      path: '/admin/modules'
    },
    {
      id: 'classrooms',
      title: 'Gestión de Aulas',
      description: 'Administra tabla aulas',
      icon: aulaSIcon,
      color: '#1b53a8',
      path: '/admin/classrooms'
    },
    {
      id: 'schedules',
      title: 'Asignación de Horarios',
      description: 'Asigna horarios en modulos_impartidos',
      icon: calSIcon,
      color: '#7fb4e0',
      path: '/admin/schedule/edit'
    },
    {
      id: 'users',
      title: 'Registrar Usuarios',
      description: 'Crea nuevos usuarios del sistema',
      icon: profSIcon,
      color: '#7fb4e0',
      path: '/signup'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Comprueba si el usuario debería estar aquí
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Redirigiendo a login - no hay token');
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <Layout headerVariant="admin">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerVariant="admin" pageSubtitle="Panel de Administración">
      <div className="admin-dashboard">
        {/* Información del usuario */}
        <div className="user-info-card">
          <div className="user-avatar">
            <span className="avatar-text">
              {user?.persona?.nombres?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="user-details">
            <h2>Bienvenido, {user?.persona?.nombres || 'Administrador'}</h2>
            <div className="user-meta">
              <span className="user-role">
                <strong>Rol:</strong> {user?.rol?.nombre || 'Administrador'}
              </span>
              <span className="user-email">
                <strong>Usuario:</strong> {user?.correo || 'admin@cba.edu.bo'}
              </span>
            </div>
          </div>
        </div>
        {/* Mensaje de advertencia si no hay token */}
        {!hasToken && (
          <div className="warning-banner">
            ⚠️ No se pudo verificar la autenticación. Usando datos de demostración.
          </div>
        )}
        
        {/* Estadísticas */}
        <div className="dashboard-section">
          <h2 className="section-title">
            <span className="title-icon"></span> Estadísticas del Sistema
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#7fb4e0' }}>
                <img src={libroIcon} alt="Módulos" style={{height:30}}/>
              </div>
              <div className="stat-content">
                <h3>{stats.modulos}</h3>
                <p>Módulos Impartidos</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#1b53a8' }}>
                <img src={aulaIcon} alt="Aulas" style={{height:30}}/>
              </div>
              <div className="stat-content">
                <h3>{stats.aulas}</h3>
                <p>Aulas Registradas</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#7fb4e0' }}>
                <img src={profIcon} alt="Docentes" style={{height:30}}/>
              </div>
              <div className="stat-content">
                <h3>{stats.docentes}</h3>
                <p>Docentes Activos</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#17409c' }}>
                <img src={estIcon} alt="Estudiantes" style={{height:30}}/>
              </div>
              <div className="stat-content">
                <h3>{stats.estudiantes}</h3>
                <p>Estudiantes Inscritos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="dashboard-section">
          <h2 className="section-title">
            <span className="title-icon"></span> Gestión del Sistema
          </h2>
          <div className="actions-grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className="action-card"
                onClick={() => handleCardClick(card.path)}
                style={{ borderTopColor: card.color }}
              >
                <div className="action-icon" style={{ color: card.color}}>
                  <img src={card.icon} alt={card.title} style={{height:40}}/>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="action-link">
                  Acceder <span className="arrow">→</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;