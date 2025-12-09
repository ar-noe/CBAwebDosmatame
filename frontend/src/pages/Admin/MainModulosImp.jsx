import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './MainModulosImp.css';

const MainModulosImp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    modulo_id: '',
    aula_id: '',
    persona_id: '',
    horario_id: '',
    bimestre_id: ''
  });

  const [modulesImpartidos, setModulesImpartidos] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDropdown, setShowDropdown] = useState({
    docente: false,
    modulo: false,
    aula: false,
    horario: false,
    bimestre: false
  });
  const [dropdownSearch, setDropdownSearch] = useState({
    docente: '',
    modulo: '',
    aula: '',
    horario: '',
    bimestre: ''
  });

  const dropdownRefs = {
    docente: useRef(null),
    modulo: useRef(null),
    aula: useRef(null),
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
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && data.data && typeof data.data === 'object') {
      return [data.data];
    } else if (typeof data === 'object' && data !== null) {
      const values = Object.values(data).filter(item => 
        item && typeof item === 'object' && !Array.isArray(item)
      );
      return values.length > 0 ? values : [];
    }
    return [];
  };

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [personasRes, branchesRes, classroomsRes, bimestresRes, modulosRes, horariosRes] = 
        await Promise.all([
          fetch('http://localhost:8000/api/personas', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch('http://localhost:8000/api/sucursales', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch('http://localhost:8000/api/aulas', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch('http://localhost:8000/api/bimestres', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch('http://localhost:8000/api/modulos', {
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

      if (personasRes.ok) {
        const personasData = await personasRes.json();
        const processedData = handleApiResponse(personasData);
        setTeachers(processedData || []);
      }

      if (branchesRes.ok) {
        const branchesData = await branchesRes.json();
        const processedData = handleApiResponse(branchesData);
        setBranches(processedData || []);
      }

      if (classroomsRes.ok) {
        const classroomsData = await classroomsRes.json();
        const processedData = handleApiResponse(classroomsData);
        setClassrooms(processedData || []);
      }

      if (bimestresRes.ok) {
        const bimestresData = await bimestresRes.json();
        const processedData = handleApiResponse(bimestresData);
        setBimestres(processedData || []);
      } else {
        console.error('Error en bimestres:', await bimestresRes.text());
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
      
      const response = await fetch('http://localhost:8000/api/modulos_impartidos', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const processedData = handleApiResponse(data);
        setModulesImpartidos(processedData || []);
      } else {
        const errorText = await response.text();
        console.error('Error en respuesta:', errorText);
        showMessage('error', 'Error al cargar los módulos impartidos');
      }
    } catch (error) {
      console.error('Error cargando módulos impartidos:', error);
      showMessage('error', 'Error de conexión al servidor');
      const demoData = [
        { 
          id: 1, 
          modulo: { id: 1, nombre: 'Álgebra Lineal', curso: { nombre: 'Matemáticas I' } },
          aula: { id: 1, numero_aula: 'A-101', sucursal: { alias: 'Central' } },
          persona: { id: 1, nombres: 'Juan', ap_pat: 'Pérez', ap_mat: 'Gómez', ci: '1234567' },
          horario: { id: 1, hora_inicio: '08:00:00', hora_fin: '10:00:00' },
          bimestre: { id: 1, nombre: '2/2020', fecha_inicio: '2020-03-01', fecha_fin: '2020-04-29' },
          created_at: '2024-01-15T10:00:00.000000Z'
        },
        { 
          id: 2, 
          modulo: { id: 2, nombre: 'Cálculo I', curso: { nombre: 'Matemáticas II' } },
          aula: { id: 2, numero_aula: 'B-201', sucursal: { alias: 'Norte' } },
          persona: { id: 2, nombres: 'María', ap_pat: 'García', ap_mat: 'López', ci: '7654321' },
          horario: { id: 2, hora_inicio: '14:00:00', hora_fin: '16:00:00' },
          bimestre: { id: 2, nombre: '4/2023', fecha_inicio: '2023-07-01', fecha_fin: '2023-08-29' },
          created_at: '2024-02-20T14:30:00.000000Z'
        },
        { 
          id: 3, 
          modulo: { id: 3, nombre: 'Física I', curso: { nombre: 'Ciencias Básicas' } },
          aula: { id: 3, numero_aula: 'C-301', sucursal: { alias: 'Sur' } },
          persona: { id: 3, nombres: 'Carlos', ap_pat: 'Rodríguez', ap_mat: '', ci: '9876543' },
          horario: { id: 3, hora_inicio: '10:00:00', hora_fin: '12:00:00' },
          bimestre: { id: 3, nombre: '3/2021', fecha_inicio: '2021-05-01', fecha_fin: '2021-06-29' },
          created_at: '2024-03-10T09:15:00.000000Z'
        }
      ];
      setModulesImpartidos(demoData);
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
        modulo.persona?.nombres?.toLowerCase() || '',
        modulo.persona?.ap_pat?.toLowerCase() || '',
        modulo.persona?.ap_mat?.toLowerCase() || '',
        modulo.persona?.ci?.toLowerCase() || '',
        `${modulo.persona?.nombres || ''} ${modulo.persona?.ap_pat || ''} ${modulo.persona?.ap_mat || ''}`.toLowerCase().trim(),
        
        modulo.modulo?.nombre?.toLowerCase() || '',
        modulo.modulo?.curso?.nombre?.toLowerCase() || '',
        
        modulo.aula?.numero_aula?.toLowerCase() || '',
        modulo.aula?.sucursal?.alias?.toLowerCase() || '',
        modulo.aula?.sucursal?.nombre?.toLowerCase() || '',
        
        formatTime(modulo.horario?.hora_inicio || '').toLowerCase(),
        formatTime(modulo.horario?.hora_fin || '').toLowerCase(),
        `${formatTime(modulo.horario?.hora_inicio || '')} ${formatTime(modulo.horario?.hora_fin || '')}`.toLowerCase(),
        
        modulo.bimestre?.nombre?.toLowerCase() || '',
        formatDate(modulo.bimestre?.fecha_inicio || '').toLowerCase(),
        formatDate(modulo.bimestre?.fecha_fin || '').toLowerCase(),
        
        modulo.id?.toString().toLowerCase() || ''
      ];
      
      return searchFields.some(field => field.includes(searchLower));
    });
    
    setFilteredModules(filtered);
  }, [searchTerm, modulesImpartidos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
      
      const requiredFields = ['modulo_id', 'aula_id', 'persona_id', 'horario_id', 'bimestre_id'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        showMessage('error', 'Por favor complete todos los campos requeridos');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/modulos_impartidos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', '✅ Módulo impartido creado exitosamente');
        loadModulesImpartidos();
        handleClearForm();
      } else {
        showMessage('error', data.message || '❌ Error al crear módulo impartido');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      modulo_id: '',
      aula_id: '',
      persona_id: '',
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
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', '✅ Módulo impartido eliminado exitosamente');
        loadModulesImpartidos();
      } else {
        showMessage('error', data.message || '❌ Error al eliminar módulo impartido');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
    }
  };

  const handleSearch = () => {
    performSearch();
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
      handleSearch();
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
      if (field === 'persona_id') {
        return formatFullName(option).toLowerCase().includes(search) ||
               option.ci?.toLowerCase().includes(search);
      } else if (field === 'modulo_id') {
        const moduloText = `${option.nombre} ${option.curso?.nombre || ''}`;
        return moduloText.toLowerCase().includes(search);
      } else if (field === 'aula_id') {
        const aulaText = `${option.numero_aula} ${option.sucursal?.alias || ''}`;
        return aulaText.toLowerCase().includes(search);
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
    
    if (field === 'persona_id') {
      const teacher = teachers.find(t => t.id == value);
      return teacher ? formatFullName(teacher) : '';
    } else if (field === 'modulo_id') {
      const modulo = modulos.find(m => m.id == value);
      return modulo ? `${modulo.nombre} (${modulo.curso?.nombre || 'Sin curso'})` : '';
    } else if (field === 'aula_id') {
      const aula = classrooms.find(a => a.id == value);
      return aula ? `${aula.numero_aula} (${aula.sucursal?.alias || 'Sin sucursal'})` : '';
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
                    {field === 'persona_id' && (
                      <div className="option-content">
                        <strong>{formatFullName(option)}</strong>
                        <small>CI: {option.ci}</small>
                      </div>
                    )}
                    {field === 'modulo_id' && (
                      <div className="option-content">
                        <strong>{option.nombre}</strong>
                        <small>{option.curso?.nombre || 'Sin curso'}</small>
                      </div>
                    )}
                    {field === 'aula_id' && (
                      <div className="option-content">
                        <strong>{option.numero_aula}</strong>
                        <small>{option.sucursal?.alias || 'Sin sucursal'}</small>
                        {option.capacidad && <small>Cap: {option.capacidad}</small>}
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

  const handleDebugClick = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Bimestres cargados:', bimestres);
    console.log('Total bimestres:', bimestres.length);
    console.log('Módulos impartidos:', modulesImpartidos);
    console.log('Total módulos:', modulesImpartidos.length);
    console.log('Módulos filtrados:', filteredModules);
    console.log('Total filtrados:', filteredModules.length);
    console.log('Teachers:', teachers.length);
    console.log('Classrooms:', classrooms.length);
    console.log('Modulos:', modulos.length);
    console.log('Horarios:', horarios.length);
    
    showMessage('info', `Datos: Bimestres(${bimestres.length}), Módulos(${modulesImpartidos.length}), Filtrados(${filteredModules.length})`, 3000);
  };

  return (
    <Layout headerVariant="admin" pageSubtitle="Gestión de Módulos Impartidos">
      <div className="main-modulos-page">
        <div className="content-container">
          
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            onClick={handleDebugClick}
            className="debug-btn"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 1000,
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🔧 Debug
          </button>

          <div className="page-header">
            <h2>📚 Gestión de Módulos Impartidos</h2>
            <p className="page-subtitle">Administra los módulos que se imparten en el sistema</p>
          </div>

          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Agregar Nuevo Módulo Impartido</h3>
                <div className="form-subtitle">Complete todos los campos para asignar un módulo</div>
              </div>
              
              <form onSubmit={handleAddModule} className="add-module-form">
                <div className="form-grid">
                  {renderDropdown('persona_id', 'Docente', teachers)}
                  {renderDropdown('modulo_id', 'Módulo', modulos)}
                  {renderDropdown('aula_id', 'Aula', classrooms)}
                  {renderDropdown('horario_id', 'Horario', horarios)}
                  {renderDropdown('bimestre_id', 'Bimestre', bimestres)}
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
                        Procesando...
                      </>
                    ) : (
                      <>
                        ➕ Agregar Módulo Impartido
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClearForm} 
                    className="btn-secondary"
                    disabled={formLoading}
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="modules-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Módulos Impartidos Existentes</h3>
                <div className="module-count">
                  Total: {modulesImpartidos.length} | Mostrando: {filteredModules.length}
                  {loading && <span style={{color: '#3b82f6', marginLeft: '10px'}}>⏳ Cargando...</span>}
                </div>
              </div>

              <div className="search-bar">
                <div className="search-input-group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                    placeholder="Buscar por docente, módulo, curso, aula, sucursal, horario, bimestre o ID..."
                    disabled={loading}
                  />
                  <div className="search-hint">
                    {searchTerm ? 'Presiona Enter para buscar' : 'Escribe para buscar...'}
                  </div>
                </div>
                <div className="search-buttons">
                  <button 
                    onClick={handleSearch} 
                    className="btn-primary search-btn"
                    disabled={loading || !searchTerm.trim()}
                  >
                    🔍 Buscar
                  </button>
                  <button 
                    onClick={handleRefresh} 
                    className="btn-secondary refresh-btn"
                    disabled={loading}
                  >
                    🔄 Actualizar
                  </button>
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
                    <p>Cargando módulos impartidos...</p>
                  </div>
                ) : filteredModules.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">📭</div>
                    <h4>
                      {searchTerm ? 'No se encontraron resultados' : 'No hay módulos impartidos registrados'}
                    </h4>
                    <p>
                      {searchTerm 
                        ? `No hay coincidencias para "${searchTerm}". Intenta con otros términos.`
                        : 'Comienza agregando un nuevo módulo impartido usando el formulario superior'}
                    </p>
                    {searchTerm && (
                      <button 
                        onClick={handleRefresh}
                        className="btn-secondary"
                        style={{ marginTop: '15px' }}
                      >
                        🔄 Mostrar todos los módulos
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
                          <th>Sucursal</th>
                          <th>Horario</th>
                          <th>Bimestre</th>
                          <th>Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModules.map((modulo) => (
                          <tr key={modulo.id}>
                            <td className="id-cell">{modulo.id}</td>
                            <td className="docente-cell">
                              <strong>{formatFullName(modulo.persona)}</strong>
                              <br />
                              <small>{modulo.persona?.ci}</small>
                            </td>
                            <td>{modulo.modulo?.nombre}</td>
                            <td className="curso-cell">
                              <span className="curso-tag">{modulo.modulo?.curso?.nombre}</span>
                            </td>
                            <td>
                              <div className="aula-info">
                                <strong>{modulo.aula?.numero_aula}</strong>
                                <br />
                                <small>Cap: {modulo.aula?.capacidad}</small>
                              </div>
                            </td>
                            <td>
                              <span className="sucursal-tag">{modulo.aula?.sucursal?.alias}</span>
                            </td>
                            <td className="horario-cell">
                              <div className="time-slot">
                                {formatTime(modulo.horario?.hora_inicio)} 
                                <span className="time-separator">→</span>
                                {formatTime(modulo.horario?.hora_fin)}
                              </div>
                            </td>
                            <td>
                              <div className="bimestre-info">
                                <strong>{modulo.bimestre?.nombre}</strong>
                                <br />
                                <small>{formatDate(modulo.bimestre?.fecha_inicio)}</small>
                              </div>
                            </td>
                            <td className="date-cell">
                              {formatDate(modulo.created_at)}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  onClick={() => handleEditModule(modulo.id)}
                                  className="btn-small edit-btn"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => handleDeleteModule(modulo.id)}
                                  className="btn-small delete-btn"
                                  title="Eliminar"
                                >
                                  🗑️
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