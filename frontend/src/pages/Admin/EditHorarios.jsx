import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
//import './EditHorarios.css';

const EditHorarios = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [teachers, setTeachers] = useState([]);
  const [modules, setModules] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  
  // Estados para módulos ya asignados al docente
  const [assignedModules, setAssignedModules] = useState([]);
  // Estados para módulos disponibles (sin docente)
  const [availableModules, setAvailableModules] = useState([]);
  
  // Estados de carga y mensajes
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estados para dropdowns
  const [showDropdown, setShowDropdown] = useState({
    teacher: false,
    module: false,
    classroom: false
  });
  
  const [dropdownSearch, setDropdownSearch] = useState({
    teacher: '',
    module: '',
    classroom: ''
  });

  const dropdownRefs = {
    teacher: useRef(null),
    module: useRef(null),
    classroom: useRef(null)
  };

  // Efectos para manejar clicks fuera de dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach(key => {
        if (dropdownRefs[key].current && 
            !dropdownRefs[key].current.contains(event.target) && 
            showDropdown[key]) {
          setShowDropdown(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar módulos asignados cuando se selecciona un docente
  useEffect(() => {
    if (selectedTeacher) {
      loadTeacherAssignedModules();
      loadAvailableModules();
    } else {
      setAssignedModules([]);
      setAvailableModules([]);
    }
  }, [selectedTeacher]);

  // Función para procesar respuestas de API
  const handleApiResponse = (data) => {
    console.log('Datos recibidos:', data);
    
    if (data && data.data) {
      if (Array.isArray(data.data)) {
        return data.data;
      }
      return [data.data];
    }
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      const arrays = Object.values(data).filter(Array.isArray);
      if (arrays.length > 0) {
        return arrays[0];
      }
    }
    
    return [];
  };

  // Cargar datos iniciales
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Cargar docentes (personas con rol de docente)
      const [teachersRes, modulesRes, classroomsRes] = await Promise.all([
        fetch('http://localhost:8000/api/personas?rol=docente', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/modulos?include=curso', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/aulas?include=sucursal', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
      ]);

      // Procesar docentes
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        const processedTeachers = handleApiResponse(teachersData);
        setTeachers(processedTeachers || []);
      } else {
        console.error('Error en docentes:', await teachersRes.text());
      }

      // Procesar módulos
      if (modulesRes.ok) {
        const modulesData = await modulesRes.json();
        const processedModules = handleApiResponse(modulesData);
        setModules(processedModules || []);
      }

      // Procesar aulas
      if (classroomsRes.ok) {
        const classroomsData = await classroomsRes.json();
        const processedClassrooms = handleApiResponse(classroomsData);
        setClassrooms(processedClassrooms || []);
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      showMessage('error', 'Error al cargar los datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  // Cargar módulos ya asignados al docente
  const loadTeacherAssignedModules = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos?persona_id=${selectedTeacher}&include=modulo.curso,aula.sucursal,horario`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const processedData = handleApiResponse(result);
        setAssignedModules(processedData || []);
      } else {
        console.error('Error cargando módulos asignados:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Cargar módulos disponibles (sin docente asignado)
  const loadAvailableModules = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/api/modulos_impartidos/disponibles', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const processedData = handleApiResponse(result);
        setAvailableModules(processedData || []);
      } else {
        // Si el endpoint no existe, cargar todos los módulos
        const responseAll = await fetch('http://localhost:8000/api/modulos_impartidos?include=modulo.curso,aula.sucursal,horario', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (responseAll.ok) {
          const resultAll = await responseAll.json();
          const allModules = handleApiResponse(resultAll);
          // Filtrar módulos que no tienen docente asignado
          const available = allModules.filter(mod => !mod.persona_id);
          setAvailableModules(available);
        }
      }
    } catch (error) {
      console.error('Error cargando módulos disponibles:', error);
    }
  };

  // Mostrar mensajes
  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    if (duration > 0) {
      setTimeout(() => setMessage({ type: '', text: '' }), duration);
    }
  };

  // Manejar selección de docente
  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
    setSelectedModule('');
    setSelectedClassroom('');
    setShowDropdown(prev => ({ ...prev, teacher: false }));
    setDropdownSearch(prev => ({ ...prev, teacher: '' }));
  };

  // Manejar selección de módulo
  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
    setShowDropdown(prev => ({ ...prev, module: false }));
    setDropdownSearch(prev => ({ ...prev, module: '' }));
  };

  // Manejar selección de aula
  const handleClassroomSelect = (classroomId) => {
    setSelectedClassroom(classroomId);
    setShowDropdown(prev => ({ ...prev, classroom: false }));
    setDropdownSearch(prev => ({ ...prev, classroom: '' }));
  };

  // Asignar módulo al docente
  const handleAssignModule = async () => {
    try {
      if (!selectedTeacher || !selectedModule) {
        showMessage('error', 'Debe seleccionar un docente y un módulo');
        return;
      }

      if (!selectedClassroom) {
        showMessage('error', 'Debe seleccionar un aula');
        return;
      }

      setAssignLoading(true);
      const token = localStorage.getItem('token');
      
      // Primero, verificar si el módulo ya existe en modulos_impartidos
      const checkResponse = await fetch(`http://localhost:8000/api/modulos_impartidos?modulo_id=${selectedModule}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      let moduleIdToUpdate = null;
      
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        const processedCheck = handleApiResponse(checkData);
        
        if (processedCheck && processedCheck.length > 0) {
          // El módulo ya existe en modulos_impartidos, actualizarlo
          moduleIdToUpdate = processedCheck[0].id;
        }
      }

      let response;
      
      if (moduleIdToUpdate) {
        // Actualizar módulo existente
        response = await fetch(`http://localhost:8000/api/modulos_impartidos/${moduleIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            persona_id: selectedTeacher,
            aula_id: selectedClassroom
          })
        });
      } else {
        // Crear nuevo módulo impartido
        // Buscar bimestre activo
        const bimestresRes = await fetch('http://localhost:8000/api/bimestres/activo', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        let bimestreId = null;
        
        if (bimestresRes.ok) {
          const bimestresData = await bimestresRes.json();
          const processedBimestres = handleApiResponse(bimestresData);
          if (processedBimestres && processedBimestres.length > 0) {
            bimestreId = processedBimestres[0].id;
          }
        }
        
        // Buscar horario disponible
        const horariosRes = await fetch('http://localhost:8000/api/horarios', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        let horarioId = null;
        
        if (horariosRes.ok) {
          const horariosData = await horariosRes.json();
          const processedHorarios = handleApiResponse(horariosData);
          if (processedHorarios && processedHorarios.length > 0) {
            horarioId = processedHorarios[0].id;
          }
        }

        // Crear nuevo módulo impartido
        response = await fetch('http://localhost:8000/api/modulos_impartidos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            modulo_id: selectedModule,
            persona_id: selectedTeacher,
            aula_id: selectedClassroom,
            bimestre_id: bimestreId,
            ...(horarioId && { horario_id: horarioId })
          })
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', '✅ Módulo asignado exitosamente al docente');
        // Recargar datos
        loadTeacherAssignedModules();
        loadAvailableModules();
        // Limpiar selección
        setSelectedModule('');
        setSelectedClassroom('');
      } else {
        showMessage('error', data.message || '❌ Error al asignar módulo');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
    } finally {
      setAssignLoading(false);
    }
  };

  // Desasignar módulo del docente
  const handleUnassignModule = async (moduleImpartidoId) => {
    if (!window.confirm('¿Está seguro de desasignar este módulo del docente?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${moduleImpartidoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          persona_id: null,
          aula_id: null
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', '✅ Módulo desasignado exitosamente');
        loadTeacherAssignedModules();
        loadAvailableModules();
      } else {
        showMessage('error', data.message || '❌ Error al desasignar módulo');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
    }
  };

  // Toggle dropdowns
  const toggleDropdown = (field) => {
    setShowDropdown(prev => ({ 
      ...prev, 
      [field]: !prev[field] 
    }));
    if (!showDropdown[field]) {
      setDropdownSearch(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar búsqueda en dropdowns
  const handleDropdownSearch = (field, value) => {
    setDropdownSearch(prev => ({ ...prev, [field]: value }));
  };

  // Filtrar opciones
  const filterOptions = (options, field) => {
    const search = dropdownSearch[field]?.toLowerCase() || '';
    if (!search) return options;
    
    return options.filter(option => {
      if (field === 'teacher') {
        const fullName = `${option.nombres} ${option.ap_pat} ${option.ap_mat || ''}`;
        return fullName.toLowerCase().includes(search) ||
               option.ci?.toLowerCase().includes(search);
      } else if (field === 'module') {
        const moduleText = `${option.nombre} ${option.curso?.nombre || ''}`;
        return moduleText.toLowerCase().includes(search);
      } else if (field === 'classroom') {
        const classroomText = `${option.numero_aula} ${option.sucursal?.alias || 'Sin sucursal'}`;
        return classroomText.toLowerCase().includes(search);
      }
      return true;
    });
  };

  // Obtener valor seleccionado para mostrar
  const getSelectedValue = (field) => {
    if (field === 'teacher') {
      const teacher = teachers.find(t => t.id == selectedTeacher);
      return teacher ? `${teacher.nombres} ${teacher.ap_pat} ${teacher.ap_mat || ''}`.trim() : '';
    } else if (field === 'module') {
      const module = modules.find(m => m.id == selectedModule);
      return module ? `${module.nombre} (${module.curso?.nombre || 'Sin curso'})` : '';
    } else if (field === 'classroom') {
      const classroom = classrooms.find(c => c.id == selectedClassroom);
      return classroom ? `${classroom.numero_aula} (${classroom.sucursal?.alias || 'Sin sucursal'})` : '';
    }
    return '';
  };

  // Formatear hora
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

  // Renderizar dropdowns personalizados
  const renderDropdown = (field, label, options) => (
    <div className="form-group" ref={dropdownRefs[field]}>
      <label>{label}:</label>
      <div className="custom-select">
        <div 
          className={`select-header ${showDropdown[field] ? 'active' : ''}`}
          onClick={() => toggleDropdown(field)}
        >
          <span className="selected-value">
            {getSelectedValue(field) || `-- Seleccionar ${label} --`}
          </span>
          <span className={`dropdown-arrow ${showDropdown[field] ? 'rotated' : ''}`}>▼</span>
        </div>
        
        {showDropdown[field] && (
          <div className="dropdown-content dropdown-overlay">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder={`Buscar ${label.toLowerCase()}...`}
                value={dropdownSearch[field]}
                onChange={(e) => handleDropdownSearch(field, e.target.value)}
                className="dropdown-search-input"
                autoFocus
              />
            </div>
            <div className="dropdown-list">
              {filterOptions(options, field).length > 0 ? (
                filterOptions(options, field).map(option => (
                  <div
                    key={option.id}
                    className={`dropdown-item ${field === 'teacher' && selectedTeacher == option.id ? 'selected' : 
                                 field === 'module' && selectedModule == option.id ? 'selected' :
                                 field === 'classroom' && selectedClassroom == option.id ? 'selected' : ''}`}
                    onClick={() => {
                      if (field === 'teacher') handleTeacherSelect(option.id);
                      else if (field === 'module') handleModuleSelect(option.id);
                      else if (field === 'classroom') handleClassroomSelect(option.id);
                    }}
                  >
                    {field === 'teacher' && (
                      <div className="option-content">
                        <strong>{`${option.nombres} ${option.ap_pat} ${option.ap_mat || ''}`.trim()}</strong>
                        <small>CI: {option.ci}</small>
                      </div>
                    )}
                    {field === 'module' && (
                      <div className="option-content">
                        <strong>{option.nombre}</strong>
                        <small>{option.curso?.nombre || 'Sin curso'}</small>
                      </div>
                    )}
                    {field === 'classroom' && (
                      <div className="option-content">
                        <strong>{option.numero_aula}</strong>
                        <small>{option.sucursal?.alias || 'Sin sucursal'}</small>
                        {option.capacidad && <small>Capacidad: {option.capacidad}</small>}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="dropdown-empty">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout headerVariant="admin" pageSubtitle="Asignación de Horarios">
      <div className="edit-horarios-page">
        <div className="content-container">
          
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="page-header">
            <h2>📅 Asignación de Módulos a Docentes</h2>
            <p className="page-subtitle">Asigne módulos y aulas a los docentes</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              {/* Sección de Selección */}
              <div className="form-section">
                <div className="form-card">
                  <div className="form-card-header">
                    <h3>Selección de Datos</h3>
                  </div>
                  
                  <div className="selection-form">
                    <div className="form-grid">
                      {renderDropdown('teacher', 'Docente', teachers)}
                      {renderDropdown('module', 'Módulo', modules)}
                      {renderDropdown('classroom', 'Aula', classrooms)}
                    </div>
                    
                    <div className="form-buttons">
                      <button 
                        onClick={handleAssignModule}
                        className="btn-primary"
                        disabled={assignLoading || !selectedTeacher || !selectedModule || !selectedClassroom}
                      >
                        {assignLoading ? (
                          <>
                            <span className="spinner"></span>
                            Asignando...
                          </>
                        ) : (
                          '📅 Asignar Módulo'
                        )}
                      </button>
                    </div>
                    
                    <div className="info-note">
                      <p>💡 <strong>Nota:</strong> Al asignar un módulo, se vinculará el docente seleccionado con el aula escogida.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Docente Seleccionado */}
              {selectedTeacher && (
                <div className="teacher-info-card">
                  <div className="card-header">
                    <h3>
                      👨‍🏫 Docente: {teachers.find(t => t.id == selectedTeacher)?.nombres} {teachers.find(t => t.id == selectedTeacher)?.ap_pat}
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="teacher-details">
                      <p><strong>CI:</strong> {teachers.find(t => t.id == selectedTeacher)?.ci}</p>
                      <p><strong>Módulos Asignados:</strong> {assignedModules.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección: Módulos Asignados al Docente */}
              {selectedTeacher && (
                <div className="card">
                  <div className="card-header">
                    <h3>Módulos Asignados a este Docente</h3>
                  </div>
                  <div className="table-container">
                    {assignedModules.length === 0 ? (
                      <div className="empty-state">
                        <div className="icon">📭</div>
                        <h4>No hay módulos asignados</h4>
                        <p>Este docente no tiene módulos asignados actualmente.</p>
                      </div>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Módulo</th>
                            <th>Curso</th>
                            <th>Aula</th>
                            <th>Sucursal</th>
                            <th>Horario</th>
                            <th>Bimestre</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedModules.map((module) => (
                            <tr key={module.id}>
                              <td>{module.modulo?.nombre}</td>
                              <td>{module.modulo?.curso?.nombre || 'Sin curso'}</td>
                              <td>{module.aula?.numero_aula || 'Sin aula'}</td>
                              <td>{module.aula?.sucursal?.alias || 'Sin sucursal'}</td>
                              <td>
                                {module.horario ? (
                                  <span className="time-slot">
                                    {formatTime(module.horario?.hora_inicio)} - {formatTime(module.horario?.hora_fin)}
                                  </span>
                                ) : (
                                  'Sin horario'
                                )}
                              </td>
                              <td>{module.bimestre?.nombre || 'Sin bimestre'}</td>
                              <td>
                                <button 
                                  onClick={() => handleUnassignModule(module.id)}
                                  className="btn-small delete-btn"
                                  title="Desasignar módulo"
                                >
                                  ❌ Desasignar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Sección: Módulos Disponibles (sin docente) */}
              <div className="card">
                <div className="card-header">
                  <h3>Módulos Disponibles (sin docente asignado)</h3>
                </div>
                <div className="table-container">
                  {availableModules.length === 0 ? (
                    <div className="empty-state">
                      <div className="icon">📚</div>
                      <h4>No hay módulos disponibles</h4>
                      <p>Todos los módulos tienen docente asignado.</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Módulo</th>
                          <th>Curso</th>
                          <th>Aula</th>
                          <th>Sucursal</th>
                          <th>Horario</th>
                          <th>Bimestre</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableModules.map((module) => (
                          <tr key={module.id}>
                            <td>{module.modulo?.nombre}</td>
                            <td>{module.modulo?.curso?.nombre || 'Sin curso'}</td>
                            <td>{module.aula?.numero_aula || 'Sin aula'}</td>
                            <td>{module.aula?.sucursal?.alias || 'Sin sucursal'}</td>
                            <td>
                              {module.horario ? (
                                <span className="time-slot">
                                  {formatTime(module.horario?.hora_inicio)} - {formatTime(module.horario?.hora_fin)}
                                </span>
                              ) : (
                                'Sin horario'
                              )}
                            </td>
                            <td>{module.bimestre?.nombre || 'Sin bimestre'}</td>
                            <td>
                              <span className="status-tag available">Disponible</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditHorarios;