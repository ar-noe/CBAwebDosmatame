// src/pages/Docente/Schedules.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedules.css';

const Schedules = () => {
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    nombre: '',
    ap_pat: '',
    ap_mat: ''
  });
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener el ID del docente del contexto de autenticación
    const teacherId = localStorage.getItem('userId') || 1; // Temporal
    
    fetchTeacherData(teacherId);
    fetchTeacherSchedules(teacherId);
  }, []);

  const fetchTeacherData = async (teacherId) => {
    try {
      // En producción: const response = await axios.get(`/api/personas/${teacherId}`);
      // Datos de ejemplo basados en tu BD
      const mockTeacher = {
        id: teacherId,
        nombres: 'Juan',
        ap_pat: 'Pérez',
        ap_mat: 'Gómez',
        ci: '1234567'
      };
      setTeacherData(mockTeacher);
    } catch (error) {
      console.error('Error cargando datos del docente:', error);
      setError('Error al cargar datos del docente');
    }
  };

  const fetchTeacherSchedules = async (teacherId) => {
    try {
      setLoading(true);
      // En producción: const response = await axios.get(`/api/docentes/${teacherId}/horarios`);
      
      // Datos de ejemplo basados en tu BD
      const mockSchedules = [
        {
          id: 1,
          modulo_impartido: {
            id: 1,
            modulo: {
              id: 1,
              nombre: 'Álgebra Lineal',
              curso: {
                id: 1,
                nombre: 'Matemáticas I'
              }
            },
            aula: {
              id: 1,
              numero_aula: 'A-101',
              sucursal: {
                id: 1,
                alias: 'Sucursal Central'
              }
            },
            horario: {
              id: 1,
              hora_inicio: '08:00:00',
              hora_fin: '10:00:00'
            },
            bimestre: {
              id: 1,
              nombre: 'Primer Bimestre'
            }
          },
          dia_semana: 'Lunes'
        },
        {
          id: 2,
          modulo_impartido: {
            id: 2,
            modulo: {
              id: 2,
              nombre: 'Cálculo Diferencial',
              curso: {
                id: 2,
                nombre: 'Matemáticas II'
              }
            },
            aula: {
              id: 2,
              numero_aula: 'A-102',
              sucursal: {
                id: 1,
                alias: 'Sucursal Central'
              }
            },
            horario: {
              id: 2,
              hora_inicio: '10:00:00',
              hora_fin: '12:00:00'
            },
            bimestre: {
              id: 1,
              nombre: 'Primer Bimestre'
            }
          },
          dia_semana: 'Martes'
        }
      ];
      
      setSchedules(mockSchedules);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando horarios:', error);
      setError('Error al cargar horarios');
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const time = timeString.split(':');
    return `${time[0]}:${time[1]}`;
  };

  const getFullName = () => {
    return `${teacherData.nombres} ${teacherData.ap_pat} ${teacherData.ap_mat}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando horarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="docente-schedules">
      <div className="schedules-header">
        <h1>Mis Horarios</h1>
        <p>Horario de clases - {getFullName()}</p>
      </div>

      {schedules.length === 0 ? (
        <div className="no-schedules">
          <p>No tienes horarios asignados actualmente.</p>
        </div>
      ) : (
        <>
          <div className="schedule-summary">
            <div className="summary-card">
              <div className="summary-icon">📚</div>
              <div className="summary-content">
                <h3>{schedules.length}</h3>
                <p>Clases asignadas</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">🏫</div>
              <div className="summary-content">
                <h3>
                  {[...new Set(schedules.map(s => s.modulo_impartido.aula.numero_aula))].length}
                </h3>
                <p>Aulas diferentes</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">📅</div>
              <div className="summary-content">
                <h3>
                  {[...new Set(schedules.map(s => s.modulo_impartido.bimestre.nombre))].length}
                </h3>
                <p>Bimestres</p>
              </div>
            </div>
          </div>

          {/* Lista de horarios */}
          <div className="schedules-list">
            <h2>Horarios Detallados</h2>
            
            {schedules.map((schedule) => (
              <div key={schedule.id} className="schedule-card">
                <div className="schedule-day">
                  <h3>{schedule.dia_semana}</h3>
                </div>
                
                <div className="schedule-info">
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Módulo:</span>
                      <span className="info-value">{schedule.modulo_impartido.modulo.nombre}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Curso:</span>
                      <span className="info-value">{schedule.modulo_impartido.modulo.curso.nombre}</span>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Horario:</span>
                      <span className="info-value">
                        {formatTime(schedule.modulo_impartido.horario.hora_inicio)} - {formatTime(schedule.modulo_impartido.horario.hora_fin)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Aula:</span>
                      <span className="info-value">
                        {schedule.modulo_impartido.aula.numero_aula} - {schedule.modulo_impartido.aula.sucursal.alias}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Bimestre:</span>
                      <span className="info-value">{schedule.modulo_impartido.bimestre.nombre}</span>
                    </div>
                  </div>
                </div>
                
                <div className="schedule-actions">
                  <button className="btn-small">
                    📋 Asistencia
                  </button>
                  <button className="btn-small secondary">
                    📝 Material
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vista semanal */}
          <div className="weekly-view">
            <h2>Vista Semanal</h2>
            <div className="week-days">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => {
                const daySchedules = schedules.filter(s => s.dia_semana === day);
                
                return (
                  <div key={day} className="week-day">
                    <h3>{day}</h3>
                    {daySchedules.length > 0 ? (
                      daySchedules.map((schedule) => (
                        <div key={schedule.id} className="week-class">
                          <div className="class-time">
                            {formatTime(schedule.modulo_impartido.horario.hora_inicio)}
                          </div>
                          <div className="class-info">
                            <div className="class-name">
                              {schedule.modulo_impartido.modulo.nombre}
                            </div>
                            <div className="class-room">
                              {schedule.modulo_impartido.aula.numero_aula}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-class">Sin clases</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Schedules;