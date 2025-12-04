import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import './EditarModulo.css';

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

  useEffect(() => {
    // Cargar datos del módulo según el ID
    loadModuleData();
  }, [id]);

  const loadModuleData = async () => {
    try {
      // Simulación de carga de datos
      console.log(`Cargando módulo ID: ${id}`);
    } catch (error) {
      console.error('Error cargando datos del módulo:', error);
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
    navigate(`/module/edit-impartido/${id}`);
  };

  return (
    <div className="editar-modulo-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Información del Curso</p>
          </div>
        </div>
      </div>

      <main className="editar-modulo-main">
        <div className="content-container">
          <div className="page-header">
            <h2>📚 Información del Curso</h2>
          </div>

          <div className="main-layout">
            {/* Sección Izquierda - Información Detallada */}
            <div className="info-section">
              {/* Información General del Curso */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Información General del Curso</h3>
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
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Ubicación y Horario</h3>
                </div>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="info-label">Sucursal:</span>
                    <span className="info-value">{moduleData.sucursal}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Aula:</span>
                    <span className="info-value">{moduleData.aula}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Horario:</span>
                    <span className="info-value">{moduleData.horario}</span>
                  </div>
                </div>
              </div>

              {/* Información del Bimestre */}
              <div className="info-card">
                <div className="info-card-header">
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
              <div className="stats-card">
                <div className="stats-header">
                  <h3>📊 Estadísticas del Curso</h3>
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
            <button onClick={handleAssignSchedule} className="btn-primary">
              📅 Asignar Horario
            </button>
            <button onClick={handleCourseReport} className="btn-secondary">
              📊 Reporte del Curso
            </button>
            <button onClick={handleEditInfo} className="btn-tertiary">
              ✏️ Editar Información
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarModulo;