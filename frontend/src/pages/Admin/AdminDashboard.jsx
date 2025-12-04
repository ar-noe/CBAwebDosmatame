// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    modulos: 0,
    aulas: 0,
    docentes: 0,
    estudiantes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // En producción, llamadas a la API
      // const modulosRes = await axios.get('/api/modulos-impartidos/count');
      // const aulasRes = await axios.get('/api/aulas/count');
      // const docentesRes = await axios.get('/api/usuarios/count/rol/2');
      // const estudiantesRes = await axios.get('/api/estudiantes-inscritos/count');
      
      setStats({
        modulos: 25,
        aulas: 12,
        docentes: 15,
        estudiantes: 350
      });
      setLoading(false);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'modules',
      title: '📚 Módulos Impartidos',
      description: 'Gestiona modulos_impartidos',
      icon: '📚',
      color: '#17409c',
      path: '/admin/modules'
    },
    {
      id: 'classrooms',
      title: '🏫 Gestión de Aulas',
      description: 'Administra tabla aulas',
      icon: '🏫',
      color: '#1b53a8',
      path: '/admin/classrooms'
    },
    {
      id: 'schedules',
      title: '📅 Asignación de Horarios',
      description: 'Asigna horarios en modulos_impartidos',
      icon: '📅',
      color: '#e485b2',
      path: '/admin/schedule/edit'
    },
    {
      id: 'teachers',
      title: '👨‍🏫 Gestión de Docentes',
      description: 'Administra usuarios con rol docente',
      icon: '👨‍🏫',
      color: '#7fb4e0',
      path: '/admin/teachers'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración - Sistema CBA</h1>
        <p>Gestor de Base de Datos Laravel</p>
      </div>

      {/* Estadísticas */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.modulos}</h3>
            <p>Módulos Impartidos</p>
            <small>tabla: modulos_impartidos</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.aulas}</h3>
            <p>Aulas Registradas</p>
            <small>tabla: aulas</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.docentes}</h3>
            <p>Docentes Activos</p>
            <small>tabla: usuarios (rol_id = 2)</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.estudiantes}</h3>
            <p>Estudiantes Inscritos</p>
            <small>tabla: estudiantes_inscritos</small>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="dashboard-actions">
        <h2>Gestión del Sistema</h2>
        <div className="actions-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className="action-card"
              onClick={() => handleCardClick(card.path)}
            >
              <div className="action-icon" style={{ backgroundColor: card.color }}>
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <h2>Acciones Rápidas</h2>
        <div className="links-grid">
          <button 
            onClick={() => navigate('/admin/module/edit-impartido/new')}
            className="link-btn primary"
          >
            ➕ Crear Nuevo Módulo
          </button>
          <button 
            onClick={() => navigate('/admin/classroom/state')}
            className="link-btn secondary"
          >
            🏫 Cambiar Estado de Aula
          </button>
          <button 
            onClick={() => navigate('/admin/schedule/edit')}
            className="link-btn accent"
          >
            📅 Asignar Horario
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;