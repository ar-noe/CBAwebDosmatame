import React, { useState, useEffect, useRef } from 'react';
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
  
  // Estados para módulos impartidos
  const [allModulesImpartidos, setAllModulesImpartidos] = useState([]);
  const [assignedModules, setAssignedModules] = useState([]);
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

  // Filtrar módulos cuando cambian los datos
  useEffect(() => {
    if (allModulesImpartidos.length > 0 && selectedTeacher) {
      // Módulos asignados al docente seleccionado
      const assigned = allModulesImpartidos.filter(mod => 
        mod.persona_id && mod.persona_id == selectedTeacher
      );
      setAssignedModules(assigned);
      
      // Módulos disponibles (sin docente) - para la tabla
      const available = allModulesImpartidos.filter(mod => 
        !mod.persona_id || mod.persona_id === null
      );
      setAvailableModules(available);
    } else if (allModulesImpartidos.length > 0) {
      // Si no hay docente seleccionado, mostrar todos los disponibles
      const available = allModulesImpartidos.filter(mod => 
        !mod.persona_id || mod.persona_id === null
      );
      setAvailableModules(available);
      setAssignedModules([]);
    }
  }, [selectedTeacher, allModulesImpartidos]);

  // Función para procesar respuestas de API
  const handleApiResponse = (data) => {
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
      
      // Cargar todos los datos necesarios
      const [personasRes, modulesRes, classroomsRes, modulosImpartidosRes] = 
        await Promise.all([
          fetch('http://localhost:8000/api/personas', {
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
          }),
          fetch('http://localhost:8000/api/modulos_impartidos?include=modulo.curso,aula.sucursal,persona,horario,bimestre', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
        ]);

      // Procesar docentes
      if (personasRes.ok) {
        const teachersData = await personasRes.json();
        const processedTeachers = handleApiResponse(teachersData);
        setTeachers(processedTeachers || []);
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

      // Procesar módulos impartidos (TODOS)
      if (modulosImpartidosRes.ok) {
        const modulosImpartidosData = await modulosImpartidosRes.json();
        const processedModulosImpartidos = handleApiResponse(modulosImpartidosData);
        setAllModulesImpartidos(processedModulosImpartidos || []);
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      showMessage('error', 'Error al cargar los datos iniciales');
    } finally {
      setLoading(false);
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
      
      // Buscar el módulo impartido seleccionado (selectedModule es el ID del módulo impartido)
      const selectedModuleImpartido = allModulesImpartidos.find(mod => 
        mod.id == selectedModule
      );
      
      console.log('Módulo impartido seleccionado:', selectedModuleImpartido);
      
      // Si no encontramos el módulo impartido, mostrar error
      if (!selectedModuleImpartido) {
        showMessage('error', 'No se encontró el módulo seleccionado');
        setAssignLoading(false);
        return;
      }
      
      // SIEMPRE actualizamos el módulo impartido existente
      console.log('Actualizando módulo impartido ID:', selectedModuleImpartido.id);
      
      // Preparar los datos para actualizar - SOLO enviar los campos que vamos a cambiar
      const updateData = {
        persona_id: selectedTeacher,
        aula_id: selectedClassroom
      };
      
      // Verificar qué otros campos existen antes de enviarlos
      if (selectedModuleImpartido.modulo_id) {
        updateData.modulo_id = selectedModuleImpartido.modulo_id;
      }
      
      if (selectedModuleImpartido.horario_id) {
        updateData.horario_id = selectedModuleImpartido.horario_id;
      }
      
      if (selectedModuleImpartido.bimestre_id) {
        updateData.bimestre_id = selectedModuleImpartido.bimestre_id;
      }
      
      console.log('Datos a enviar para actualización:', updateData);
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${selectedModuleImpartido.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const responseText = await response.text();
      let data;
      
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Error parseando respuesta:', e);
          showMessage('error', 'Error en formato de respuesta del servidor');
          return;
        }
      }
      
      if (response.ok) {
        showMessage('success', '✅ Módulo asignado exitosamente al docente');
        // Recargar datos
        await loadInitialData();
        // Limpiar selección
        setSelectedModule('');
        setSelectedClassroom('');
      } else {
        console.error('Error en respuesta:', data);
        showMessage('error', data?.message || data?.error || '❌ Error al asignar módulo');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
    } finally {
      setAssignLoading(false);
    }
  };

  // Desasignar módulo del docente - CORREGIDO
  const handleUnassignModule = async (moduleImpartidoId) => {
    if (!window.confirm('¿Está seguro de desasignar este módulo del docente?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Buscar el módulo impartido para obtener sus datos
      const moduleImpartido = allModulesImpartidos.find(mod => mod.id == moduleImpartidoId);
      
      if (!moduleImpartido) {
        showMessage('error', 'No se encontró el módulo');
        return;
      }
      
      // Preparar datos para actualizar
      const updateData = {
        persona_id: null,
        aula_id: null
      };
      
      // Mantener los otros campos
      if (moduleImpartido.modulo_id) {
        updateData.modulo_id = moduleImpartido.modulo_id;
      }
      
      if (moduleImpartido.horario_id) {
        updateData.horario_id = moduleImpartido.horario_id;
      }
      
      if (moduleImpartido.bimestre_id) {
        updateData.bimestre_id = moduleImpartido.bimestre_id;
      }
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${moduleImpartidoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', '✅ Módulo desasignado exitosamente');
        // Recargar datos
        await loadInitialData();
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

  // Filtrar opciones - CORREGIDO: Para módulo, usar módulos impartidos sin docente
  const filterOptions = (options, field) => {
    const search = dropdownSearch[field]?.toLowerCase() || '';
    
    // Para el campo 'module', usar módulos impartidos sin docente
    if (field === 'module') {
      // Filtrar módulos impartidos que NO tienen docente
      const modulesWithoutTeacher = allModulesImpartidos.filter(mod => 
        !mod.persona_id || mod.persona_id === null
      );
      
      console.log('Módulos impartidos sin docente:', modulesWithoutTeacher.length);
      
      // Si no hay búsqueda, retornar todos
      if (!search) return modulesWithoutTeacher;
      
      // Filtrar por búsqueda
      return modulesWithoutTeacher.filter(mod => {
        const moduleText = `${mod.modulo?.nombre || ''} ${mod.modulo?.curso?.nombre || ''}`;
        return moduleText.toLowerCase().includes(search);
      });
    }
    
    // Para otros campos, aplicar búsqueda normal
    if (!search) return options;
    
    return options.filter(option => {
      if (field === 'teacher') {
        const fullName = `${option.nombres} ${option.ap_pat} ${option.ap_mat || ''}`;
        return fullName.toLowerCase().includes(search) ||
               option.ci?.toLowerCase().includes(search);
      } else if (field === 'classroom') {
        const classroomText = `${option.numero_aula} ${option.sucursal?.alias || 'Sin sucursal'}`;
        return classroomText.toLowerCase().includes(search);
      }
      return true;
    });
  };

  // Obtener valor seleccionado para mostrar - CORREGIDO
  const getSelectedValue = (field) => {
    if (field === 'teacher') {
      const teacher = teachers.find(t => t.id == selectedTeacher);
      return teacher ? `${teacher.nombres} ${teacher.ap_pat} ${teacher.ap_mat || ''}`.trim() : '';
    } else if (field === 'module') {
      // Buscar en módulos impartidos
      const moduleImpartido = allModulesImpartidos.find(m => m.id == selectedModule);
      if (moduleImpartido) {
        return `${moduleImpartido.modulo?.nombre || 'Módulo'} (${moduleImpartido.modulo?.curso?.nombre || 'Sin curso'})`;
      }
      return '';
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

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Renderizar dropdowns personalizados - CORREGIDO
  const renderDropdown = (field, label, options) => {
    let displayOptions = options;
    
    // Para el campo 'module', usar módulos impartidos sin docente
    if (field === 'module') {
      displayOptions = allModulesImpartidos.filter(mod => 
        !mod.persona_id || mod.persona_id === null
      );
    }
    
    return (
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
                {filterOptions(displayOptions, field).length > 0 ? (
                  filterOptions(displayOptions, field).map(option => (
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
                          <strong>{option.modulo?.nombre || 'Módulo'}</strong>
                          <small>{option.modulo?.curso?.nombre || 'Sin curso'}</small>
                          {option.aula?.numero_aula && <small>Aula: {option.aula.numero_aula}</small>}
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
                    {field === 'module' ? 'No hay módulos disponibles sin docente' : 'No se encontraron resultados'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
                      {/* CAMBIO: Para módulo, pasamos modules pero renderDropdown usa allModulesImpartidos */}
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
                      <p>💡 <strong>Nota:</strong> Se mostrarán solo módulos impartidos sin docente asignado</p>
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

              {/* Sección: Módulos Disponibles (con aula pero SIN docente) */}
              <div className="card">
                <div className="card-header">
                  <h3>Módulos Disponibles para Asignar</h3>
                  <div className="card-subtitle">
                    <small>Módulos que tienen aula asignada pero NO tienen docente</small>
                  </div>
                </div>
                <div className="table-container">
                  {availableModules.length === 0 ? (
                    <div className="empty-state">
                      <div className="icon">📚</div>
                      <h4>No hay módulos disponibles</h4>
                      <p>Todos los módulos tienen docente asignado o no tienen aula asignada.</p>
                      <div style={{ marginTop: '15px' }}>
                        <button 
                          onClick={() => navigate('/admin/modules')}
                          className="btn-secondary"
                          style={{ marginRight: '10px' }}
                        >
                          📚 Crear Módulos
                        </button>
                        <button 
                          onClick={loadInitialData}
                          className="btn-secondary"
                        >
                          🔄 Recargar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-info">
                        <p>Mostrando <strong>{availableModules.length}</strong> módulos disponibles</p>
                      </div>
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
                              <td>
                                {module.aula ? (
                                  <div className="aula-info">
                                    <strong>{module.aula?.numero_aula}</strong>
                                  </div>
                                ) : (
                                  <span className="no-assigned">Sin aula</span>
                                )}
                              </td>
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
                              <td>
                                <div className="bimestre-info">
                                  <strong>{module.bimestre?.nombre || 'Sin bimestre'}</strong>
                                  <br />
                                  <small>{formatDate(module.bimestre?.fecha_inicio) || ''}</small>
                                </div>
                              </td>
                              <td>
                                <span className="status-tag available">✅ Disponible</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
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