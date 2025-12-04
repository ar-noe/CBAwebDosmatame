// src/pages/Docente/DocenteDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocenteDashboard.css';

const DocenteDashboard = () => {
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@cba.edu',
    modules: [
      { id: 1, name: 'Álgebra Lineal', schedule: 'Lunes 08:00-10:00', classroom: 'A-101' },
      { id: 2, name: 'Cálculo Diferencial', schedule: 'Martes 10:00-12:00', classroom: 'A-102' },
    ],
    nextClass: { module: 'Álgebra Lineal', time: '08:00', classroom: 'A-101' }
  });

  const handleViewSchedules = () => {
    navigate('/docente/schedules');
  };

  const handleViewProfile = () => {
    navigate('/docente/profile');
  };

  return (
    <div className="docente-dashboard">
      <div className="dashboard-header">
        <h1>Bienvenido, {teacherData.name}</h1>
        <p>Panel del Docente - Sistema CBA</p>
      </div>

      <div className="dashboard-content">
        {/* Información Rápida */}
        <div className="quick-info">
          <div className="info-card">
            <div className="info-icon">📚</div>
            <div className="info-content">
              <h3>Módulos Asignados</h3>
              <p>{teacherData.modules.length} módulos</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-content">
              <h3>Próxima Clase</h3>
              <p>{teacherData.nextClass.module} - {teacherData.nextClass.time}</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🏫</div>
            <div className="info-content">
              <h3>Aula Actual</h3>
              <p>{teacherData.nextClass.classroom}</p>
            </div>
          </div>
        </div>

        {/* Módulos Asignados */}
        <div className="modules-section">
          <div className="section-header">
            <h2>Mis Módulos</h2>
            <button onClick={handleViewSchedules} className="btn-primary">
              Ver Todos los Horarios
            </button>
          </div>
          
          <div className="modules-list">
            {teacherData.modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <h3>{module.name}</h3>
                  <span className="module-status active">● Activo</span>
                </div>
                <div className="module-details">
                  <p><strong>Horario:</strong> {module.schedule}</p>
                  <p><strong>Aula:</strong> {module.classroom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button onClick={handleViewSchedules} className="action-btn">
              <span className="action-icon">📅</span>
              <span className="action-text">Ver Horarios</span>
            </button>
            
            <button onClick={handleViewProfile} className="action-btn">
              <span className="action-icon">👤</span>
              <span className="action-text">Mi Perfil</span>
            </button>
            
            <button className="action-btn">
              <span className="action-icon">📋</span>
              <span className="action-text">Registrar Asistencia</span>
            </button>
            
            <button className="action-btn">
              <span className="action-icon">📝</span>
              <span className="action-text">Subir Material</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocenteDashboard;