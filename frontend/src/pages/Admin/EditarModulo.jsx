import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './EditarModulo.css';

const EditarModulo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState({
    nombreCurso: 'Matemáticas I',
    modulo: 'Álgebra Lineal',
    docente: 'Juan Pérez',
    sucursal: 'Sucursal Central',
    aula: 'A-101',
    horario: '08:00 - 10:00 (Lunes, Miércoles)',
    bimestre: 'Primer Bimestre 2024',
    cantidadEstudiantes: 25,
    capacidadAula: 30,
    disponibilidad: 'Disponible'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadModuleData();
  }, [id]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${id}?include=modulo.curso,aula.sucursal,persona,horario,bimestre`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Datos del módulo:', result.data);
        
        if (result.data) {
          const data = result.data;
          setModuleData({
            nombreCurso: data.modulo?.curso?.nombre || 'Sin curso',
            modulo: data.modulo?.nombre || 'Sin módulo',
            docente: `${data.persona?.nombres || ''} ${data.persona?.ap_pat || ''} ${data.persona?.ap_mat || ''}`.trim(),
            sucursal: data.aula?.sucursal?.alias || 'Sin sucursal',
            aula: data.aula?.numero_aula || 'Sin aula',
            horario: `${formatTime(data.horario?.hora_inicio) || ''} - ${formatTime(data.horario?.hora_fin) || ''}`,
            bimestre: data.bimestre?.nombre || 'Sin bimestre',
            cantidadEstudiantes: 0, // Necesitarías una API para obtener esto
            capacidadAula: data.aula?.capacidad || 0,
            disponibilidad: 'Disponible'
          });
        }
      } else {
        showMessage('error', 'Error al cargar los datos del módulo');
      }
    } catch (error) {
      console.error('Error cargando datos del módulo:', error);
      showMessage('error', 'Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    if (duration > 0) {
      setTimeout(() => setMessage({ type: '', text: '' }), duration);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (e) {
      return timeString;
    }
  };

  const handleViewStudents = () => {
    navigate(`/module/${id}/students`);
  };

  const handleAssignSchedule = () => {
    navigate(`/schedule/assign/${id}`);
  };

  const handleCourseReport = () => {
    console.log('Generando reporte del curso');
    alert('Reporte generado exitosamente');
  };

  const handleEditInfo = () => {
    navigate(`/admin/module/edit-impartido/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/modules-impartidos');
  };

  return (
    <Layout headerVariant="admin" pageSubtitle="Información del Módulo">
      <div className="editar-modulo-page">
        <div className="content-container">
          
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="page-header">
            <h2>📚 Información del Módulo</h2>
            <p className="page-subtitle">Detalles completos del módulo impartido</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando información del módulo...</p>
            </div>
          ) : (
            <>
              <div className="main-layout">
                {/* Sección Izquierda - Información Detallada */}
                <div className="info-section">
                  {/* Información General del Curso */}
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Información General</h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Nombre del Curso:</span>
                        <span className="info-value">{moduleData.nombreCurso}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Módulo:</span>
                        <span className="info-value">{moduleData.modulo}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Docente:</span>
                        <span className="info-value">{moduleData.docente}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información de Ubicación y Horario */}
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Ubicación y Horario</h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Sucursal:</span>
                        <span className="info-value">
                          <span className="sucursal-tag">{moduleData.sucursal}</span>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Aula:</span>
                        <span className="info-value">{moduleData.aula}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Horario:</span>
                        <span className="info-value">
                          <div className="time-slot">
                            {moduleData.horario}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del Bimestre */}
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Periodo Académico</h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Bimestre:</span>
                        <span className="info-value">{moduleData.bimestre}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección Derecha - Estadísticas */}
                <div className="stats-section">
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>📊 Estadísticas</h3>
                    </div>
                    
                    <div className="students-count">
                      <div className="count-label">👥 Estudiantes Inscritos</div>
                      <div className="count-number">{moduleData.cantidadEstudiantes}</div>
                      <div className="count-text">estudiantes</div>
                    </div>

                    <div className="capacity-info">
                      <div className="capacity-label">Capacidad del Aula:</div>
                      <div className="capacity-grid">
                        <div className="capacity-item">
                          <div className="capacity-number">{moduleData.capacidadAula}</div>
                          <div className="capacity-text">capacidad</div>
                        </div>
                        <div className="capacity-item">
                          <div className={`availability-status ${moduleData.disponibilidad.toLowerCase()}`}>
                            {moduleData.disponibilidad}
                          </div>
                          <div className="capacity-text">estado</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleViewStudents}
                      className="btn-primary students-list-btn"
                    >
                      👥 Ver Lista de Estudiantes
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="action-buttons">
                <button onClick={handleBack} className="btn-secondary">
                  ← Volver
                </button>
                <button onClick={handleAssignSchedule} className="btn-primary">
                  📅 Asignar Horario
                </button>
                <button onClick={handleCourseReport} className="btn-secondary">
                  📊 Reporte del Curso
                </button>
                <button onClick={handleEditInfo} className="btn-primary">
                  ✏️ Editar Información
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditarModulo;