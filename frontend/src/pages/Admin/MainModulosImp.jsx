import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import editB from '../../assets/images/edit.png';
import deleteB from '../../assets/images/delete.png';
import './MainModulosImp.css';

const MainModulosImp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    modulo_id: '',
    horario_id: '',
    bimestre_id: ''
  });

  const [modulesImpartidos, setModulesImpartidos] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bimestres, setBimestres] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDropdown, setShowDropdown] = useState({
    modulo: false,
    horario: false,
    bimestre: false
  });
  const [dropdownSearch, setDropdownSearch] = useState({
    modulo: '',
    horario: '',
    bimestre: ''
  });

  const dropdownRefs = {
    modulo: useRef(null),
    horario: useRef(null),
    bimestre: useRef(null)
  };

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

  useEffect(() => {
    loadInitialData();
    loadModulesImpartidos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredModules(modulesImpartidos);
    } else {
      performSearch();
    }
  }, [searchTerm, modulesImpartidos]);

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

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [bimestresRes, modulosRes, horariosRes] = 
        await Promise.all([
          fetch('http://localhost:8000/api/bimestres', {
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
          fetch('http://localhost:8000/api/horarios', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
        ]);

      if (bimestresRes.ok) {
        const bimestresData = await bimestresRes.json();
        const processedData = handleApiResponse(bimestresData);
        setBimestres(processedData || []);
      }

      if (modulosRes.ok) {
        const modulosData = await modulosRes.json();
        const processedData = handleApiResponse(modulosData);
        setModulos(processedData || []);
      }

      if (horariosRes.ok) {
        const horariosData = await horariosRes.json();
        const processedData = handleApiResponse(horariosData);
        setHorarios(processedData || []);
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      showMessage('error', 'Error al cargar los datos iniciales');
    }
  };

  const loadModulesImpartidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/api/modulos_impartidos?include=modulo.curso,persona,horario,bimestre', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          setModulesImpartidos(result.data);
          setFilteredModules(result.data);
        }
      } else {
        const errorText = await response.text();
        console.error('Error en respuesta:', errorText);
        showMessage('error', 'Error al cargar los módulos impartidos');
      }
    } catch (error) {
      console.error('Error cargando módulos impartidos:', error);
      showMessage('error', 'Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredModules(modulesImpartidos);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    const filtered = modulesImpartidos.filter(modulo => {
      const searchFields = [
        modulo.modulo?.nombre?.toLowerCase() || '',
        modulo.modulo?.curso?.nombre?.toLowerCase() || '',
        modulo.persona?.nombres?.toLowerCase() || '',
        modulo.persona?.ap_pat?.toLowerCase() || '',
        modulo.persona?.ci?.toLowerCase() || '',
        formatTime(modulo.horario?.hora_inicio || '').toLowerCase(),
        formatTime(modulo.horario?.hora_fin || '').toLowerCase(),
        modulo.bimestre?.nombre?.toLowerCase() || '',
        formatDate(modulo.bimestre?.fecha_inicio || '').toLowerCase(),
        modulo.id?.toString().toLowerCase() || ''
      ];
      
      return searchFields.some(field => field.includes(searchLower));
    });
    
    setFilteredModules(filtered);
  }, [searchTerm, modulesImpartidos]);

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    setShowDropdown(prev => ({ ...prev, [name]: false }));
    setDropdownSearch(prev => ({ ...prev, [name]: '' }));
  };

  const handleDropdownSearch = (field, value) => {
    setDropdownSearch(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (field) => {
    setShowDropdown(prev => ({ 
      ...prev, 
      [field]: !prev[field] 
    }));
    if (!showDropdown[field]) {
      setDropdownSearch(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    if (duration > 0) {
      setTimeout(() => setMessage({ type: '', text: '' }), duration);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const requiredFields = ['modulo_id', 'horario_id', 'bimestre_id'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        showMessage('error', 'Por favor complete todos los campos obligatorios');
        return;
      }
      
      const dataToSend = {
        modulo_id: formData.modulo_id,
        bimestre_id: formData.bimestre_id,
        horario_id: formData.horario_id
      };
      
      const response = await fetch('http://localhost:8000/api/modulos_impartidos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      const responseText = await response.text();
      
      if (!responseText) {
        showMessage('error', 'Respuesta vacía del servidor');
        return;
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        showMessage('error', 'Error en el formato de respuesta del servidor');
        return;
      }
      
      if (response.ok) {
        showMessage('success', 'Módulo creado exitosamente');
        showMessage('info', 'Nota: Este módulo no tiene docente ni aula asignada. Asígnalos desde "Asignación de Horarios".', 7000);
        loadModulesImpartidos();
        handleClearForm();
      } else {
        showMessage('error', data.message || data.error || 'Error al crear módulo');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error de conexión al servidor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      modulo_id: '',
      horario_id: '',
      bimestre_id: ''
    });
  };

  const handleEditModule = (moduleId) => {
    navigate(`/admin/module/edit-impartido/${moduleId}`);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('¿Está seguro de eliminar este módulo impartido?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const responseText = await response.text();
      
      if (!responseText) {
        showMessage('error', 'Respuesta vacía del servidor');
        return;
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        showMessage('error', 'Error en el formato de respuesta del servidor');
        return;
      }
      
      if (response.ok) {
        showMessage('success', 'Módulo impartido eliminado exitosamente');
        loadModulesImpartidos();
      } else {
        showMessage('error', data.message || 'Error al eliminar módulo impartido');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error de conexión al servidor');
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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

  const formatFullName = (persona) => {
    if (!persona) return '';
    return `${persona.nombres} ${persona.ap_pat} ${persona.ap_mat || ''}`.trim();
  };

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

  const filterOptions = (options, field) => {
    const search = dropdownSearch[field]?.toLowerCase() || '';
    if (!search) return options;
    
    return options.filter(option => {
      if (field === 'modulo_id') {
        const moduloText = `${option.nombre} ${option.curso?.nombre || ''}`;
        return moduloText.toLowerCase().includes(search);
      } else if (field === 'horario_id') {
        const horarioText = `${formatTime(option.hora_inicio)} - ${formatTime(option.hora_fin)}`;
        return horarioText.toLowerCase().includes(search);
      } else if (field === 'bimestre_id') {
        const bimestreText = `${option.nombre} ${formatDate(option.fecha_inicio)} ${formatDate(option.fecha_fin)}`;
        return bimestreText.toLowerCase().includes(search);
      }
      return true;
    });
  };

  const getSelectedValue = (field) => {
    const value = formData[field];
    if (!value) return '';
    
    if (field === 'modulo_id') {
      const modulo = modulos.find(m => m.id == value);
      return modulo ? `${modulo.nombre} (${modulo.curso?.nombre || 'Sin curso'})` : '';
    } else if (field === 'horario_id') {
      const horario = horarios.find(h => h.id == value);
      return horario ? `${formatTime(horario.hora_inicio)} - ${formatTime(horario.hora_fin)}` : '';
    } else if (field === 'bimestre_id') {
      const bimestre = bimestres.find(b => b.id == value);
      return bimestre ? `${bimestre.nombre} (${formatDate(bimestre.fecha_inicio)} - ${formatDate(bimestre.fecha_fin)})` : '';
    }
    return '';
  };

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
                    className={`dropdown-item ${formData[field] == option.id ? 'selected' : ''}`}
                    onClick={() => handleSelectChange(field, option.id)}
                  >
                    {field === 'modulo_id' && (
                      <div className="option-content">
                        <strong>{option.nombre}</strong>
                        <small>{option.curso?.nombre || 'Sin curso'}</small>
                      </div>
                    )}
                    {field === 'horario_id' && (
                      <div className="option-content">
                        <strong>{formatTime(option.hora_inicio)} - {formatTime(option.hora_fin)}</strong>
                      </div>
                    )}
                    {field === 'bimestre_id' && (
                      <div className="option-content">
                        <strong>{option.nombre}</strong>
                        <small>{formatDate(option.fecha_inicio)} - {formatDate(option.fecha_fin)}</small>
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
    <Layout headerVariant="admin" pageSubtitle="Gestión de Módulos Impartidos">
      <div className="main-modulos-page">
        <div className="content-container">
          
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="page-header">
            <h2>Gestión de Módulos Impartidos</h2>
          </div>

          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Crear Nuevo Módulo</h3>
                <div className="form-subtitle">
                  Todos los campos son <strong>obligatorios</strong>. 
                  <br />
                  <small className="note-text">
                    Nota: El docente y aula se asignarán después desde "Asignación de Horarios"
                  </small>
                </div>
              </div>
              
              <form onSubmit={handleAddModule} className="add-module-form">
                <div className="form-grid">
                  {renderDropdown('modulo_id', 'Módulo', modulos)}
                  {renderDropdown('bimestre_id', 'Bimestre', bimestres)}
                  {renderDropdown('horario_id', 'Horario', horarios)}
                </div>

                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner"></span>
                        Creando...
                      </>
                    ) : (
                      'Crear Módulo'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClearForm} 
                    className="btn-secondary"
                    disabled={formLoading}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="modules-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Módulos Existentes</h3>
              </div>

              <div className="search-bar">
                <div className="search-input-group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                    placeholder="Buscar por módulo, curso, horario, bimestre, docente o ID..."
                    disabled={loading}
                  />
                </div>
              </div>

              {searchTerm && (
                <div className="search-results-count">
                  <span>
                    Resultados para: <strong>"{searchTerm}"</strong>
                  </span>
                  <span>
                    Encontrados: <strong>{filteredModules.length}</strong> de {modulesImpartidos.length}
                  </span>
                </div>
              )}

              <div className="table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando módulos...</p>
                  </div>
                ) : filteredModules.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">📭</div>
                    <h4>
                      {searchTerm ? 'No se encontraron resultados' : 'No hay módulos registrados'}
                    </h4>
                    <p>
                      {searchTerm 
                        ? `No hay coincidencias para "${searchTerm}". Intenta con otros términos.`
                        : 'Comienza creando un nuevo módulo usando el formulario superior'}
                    </p>
                    {searchTerm && (
                      <button 
                        onClick={handleRefresh}
                        className="btn-secondary"
                        style={{ marginTop: '15px' }}
                      >
                        Mostrar todos
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Docente</th>
                          <th>Módulo</th>
                          <th>Curso</th>
                          <th>Aula</th>
                          <th>Horario</th>
                          <th>Bimestre</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModules.map((modulo) => (
                          <tr key={modulo.id}>
                            <td className="id-cell">{modulo.id}</td>
                            <td className="docente-cell">
                              {modulo.persona ? (
                                <>
                                  <strong>{formatFullName(modulo.persona)}</strong>
                                  <br />
                                  <small>{modulo.persona?.ci}</small>
                                </>
                              ) : (
                                <span className="no-assigned warning">Sin docente</span>
                              )}
                            </td>
                            <td>{modulo.modulo?.nombre}</td>
                            <td className="curso-cell">
                              <span className="curso-tag">{modulo.modulo?.curso?.nombre || 'Sin curso'}</span>
                            </td>
                            <td>
                              {modulo.aula ? (
                                <div className="aula-info">
                                  <strong>{modulo.aula?.numero_aula || 'Sin aula'}</strong>
                                </div>
                              ) : (
                                <span className="no-assigned warning">Sin aula</span>
                              )}
                            </td>
                            <td className="horario-cell">
                              {modulo.horario ? (
                                <div className="time-slot">
                                  {formatTime(modulo.horario?.hora_inicio) || 'N/A'} 
                                  <span className="time-separator">→</span>
                                  {formatTime(modulo.horario?.hora_fin) || 'N/A'}
                                </div>
                              ) : (
                                <span className="no-assigned">Sin horario</span>
                              )}
                            </td>
                            <td>
                              <div className="bimestre-info">
                                <strong>{modulo.bimestre?.nombre || 'Sin bimestre'}</strong>
                                <br />
                                <small>{formatDate(modulo.bimestre?.fecha_inicio) || 'N/A'}</small>
                              </div>
                            </td>
                            <td>
                              {modulo.persona_id && modulo.aula_id ? (
                                <span className="status-tag complete">Completo</span>
                              ) : modulo.persona_id ? (
                                <span className="status-tag partial">Sin aula</span>
                              ) : modulo.aula_id ? (
                                <span className="status-tag partial">Sin docente</span>
                              ) : (
                                <span className="status-tag empty">Pendiente</span>
                              )}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  onClick={() => handleEditModule(modulo.id)}
                                  className="btn-small edit-btn"
                                  title="Editar"
                                >
                                  <img src={editB} alt="editar" style={{height:20}}/>
                                </button>
                                <button 
                                  onClick={() => handleDeleteModule(modulo.id)}
                                  className="btn-small delete-btn"
                                  title="Eliminar"
                                >
                                  <img src={deleteB} alt="eliminar" style={{height:20}}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default MainModulosImp;