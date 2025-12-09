import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './MainClassroom.css';

const MainClassroom = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Simulación de datos
      const mockClassrooms = [
        { id: 1, numero_aula: 'A-101' },
        { id: 2, numero_aula: 'A-102' },
        { id: 3, numero_aula: 'B-201' }
      ];

      const mockStates = [
        { id: 1, estado: 'Disponible' },
        { id: 2, estado: 'En uso' },
        { id: 3, estado: 'En mantenimiento' }
      ];

      setClassrooms(mockClassrooms);
      setStates(mockStates);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleClassroomChange = (e) => {
    setSelectedClassroom(e.target.value);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleContinue = () => {
    if (selectedClassroom) {
      navigate(`/classroom/state/${selectedClassroom}`);
    } else {
      alert('Por favor seleccione un aula');
    }
  };

  const handleSave = () => {
    if (selectedClassroom && selectedState) {
      console.log('Guardando cambios:', {
        classroom: selectedClassroom,
        state: selectedState,
        description
      });
      alert('Cambios guardados exitosamente');
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="main-classroom-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Gestión de Aulas</p>
          </div>
        </div>
      </div>

      <main className="main-classroom-content">
        <div className="content-container">
          <div className="page-header">
            <h2>Gestión de Aulas</h2>
          </div>

          {/* Formulario para agregar aulas */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Seleccionar Aula</h3>
              </div>
              <div className="form-group">
                <label>Seleccionar Aula:</label>
                <select
                  value={selectedClassroom}
                  onChange={handleClassroomChange}
                  className="form-select large"
                >
                  <option value="">-- Seleccionar Aula --</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.numero_aula}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons">
                <button onClick={handleContinue} className="btn-primary">
                  Continuar
                </button>
                <button onClick={() => setSelectedClassroom('')} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          {/* Modificar Estado del Aula */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Modificar Estado del Aula</h3>
              </div>
              
              <div className="form-group">
                <label>Estado:</label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="form-select large"
                >
                  <option value="">-- Seleccionar Estado --</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  className="form-textarea large"
                  placeholder="Descripción del cambio de estado..."
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button onClick={handleSave} className="btn-primary">
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {/* Botón Exit */}
          <div className="exit-section">
            <button onClick={handleExit} className="btn-secondary exit-btn">
              ➜ Exit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainClassroom;