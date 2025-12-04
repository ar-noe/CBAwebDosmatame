// src/pages/Classroom/ClassroomState.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './ClassroomState.css';

const ClassroomState = () => {
  const [classroomInfo, setClassroomInfo] = useState({
    classroomId: '',
    currentState: '',
    newState: '',
    description: ''
  });
  
  const [states, setStates] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar estados de aula y aulas
    fetchStates();
    fetchClassrooms();
  }, []);

  const fetchStates = async () => {
    try {
      // Simulación de datos
      const mockStates = [
        { id: 1, estado: 'Disponible' },
        { id: 2, estado: 'En uso' },
        { id: 3, estado: 'En mantenimiento' },
        { id: 4, estado: 'Inhabilitada' }
      ];
      setStates(mockStates);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      // Simulación de datos
      const mockClassrooms = [
        { id: 1, numero_aula: 'A-101', sucursal: 'Sucursal Central', estado: 'Disponible' },
        { id: 2, numero_aula: 'A-102', sucursal: 'Sucursal Central', estado: 'En uso' },
        { id: 3, numero_aula: 'B-201', sucursal: 'Sucursal Norte', estado: 'Disponible' }
      ];
      setClassrooms(mockClassrooms);
    } catch (error) {
      console.error('Error loading classrooms:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroomInfo({
      ...classroomInfo,
      [name]: value
    });
  };

  const handleClassroomSelect = (e) => {
    const selectedId = e.target.value;
    const selectedClassroom = classrooms.find(c => c.id == selectedId);
    
    if (selectedClassroom) {
      setClassroomInfo({
        ...classroomInfo,
        classroomId: selectedId,
        currentState: selectedClassroom.estado,
        description: `Aula: ${selectedClassroom.numero_aula} - ${selectedClassroom.sucursal}`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Guardando estado de aula:', classroomInfo);
      alert('Estado de aula actualizado exitosamente');
      navigate('/classrooms');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/classrooms');
  };

  return (
    <div className="classroom-state-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Editar Estado de Aula</p>
          </div>
        </div>
      </div>

      <main className="classroom-state-main">
        <div className="content-container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Estado de Aula</h2>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
              {/* Información del Aula */}
              <div className="info-section">
                <h3>Información del Aula</h3>
                <div className="info-card">
                  <p className="info-text">{classroomInfo.description || 'Seleccione un aula para ver información'}</p>
                </div>
              </div>

              {/* Selección de Aula */}
              <div className="form-section">
                <label className="form-label">Seleccionar Aula *</label>
                <select
                  name="classroomId"
                  value={classroomInfo.classroomId}
                  onChange={handleClassroomSelect}
                  className="form-select"
                  required
                >
                  <option value="">-- Seleccionar Aula --</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.numero_aula} - {classroom.sucursal} ({classroom.estado})
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado Actual */}
              {classroomInfo.currentState && (
                <div className="form-section">
                  <label className="form-label">Estado Actual</label>
                  <div className="current-state-display">
                    <span className={`state-badge state-${classroomInfo.currentState.toLowerCase().replace(' ', '-')}`}>
                      {classroomInfo.currentState}
                    </span>
                  </div>
                </div>
              )}

              {/* Nuevo Estado */}
              <div className="form-section">
                <label className="form-label">Nuevo Estado *</label>
                <select
                  name="newState"
                  value={classroomInfo.newState}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Seleccionar Estado --</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.estado}>
                      {state.estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="form-section">
                <label className="form-label">Descripción (Opcional)</label>
                <textarea
                  name="description"
                  value={classroomInfo.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Descripción del cambio de estado..."
                />
              </div>

              {/* Información Importante */}
              <div className="info-important">
                <h4>📋 Información Importante:</h4>
                <ul>
                  <li>Para asignar un horario al aula debe ir a la pestaña 'Ver Horarios'</li>
                  <li>El estado 'En mantenimiento' inhabilitará el aula temporalmente</li>
                  <li>El estado 'Inhabilitada' requiere aprobación administrativa</li>
                </ul>
              </div>

              {/* Botones */}
              <div className="button-group">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  ❌ Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassroomState;