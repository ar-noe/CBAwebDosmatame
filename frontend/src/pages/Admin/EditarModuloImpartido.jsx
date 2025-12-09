import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './EditarModuloImpartido.css';

const EditarModuloImpartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    modulo_id: '',
    horario_id: '',
    bimestre_id: ''
  });

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [modules, setModules] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [currentInfo, setCurrentInfo] = useState('');
  
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
    loadModuleData();
  }, [id]);

  const handleApiResponse = (data) => {
    console.log('handleApiResponse - Datos recibidos:', data);
    
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
      console.log('Cargando datos iniciales...');
      
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

      // BIMESTRES
      if (bimestresRes.ok) {
        const bimestresData = await bimestresRes.json();
        console.log('Bimestres RAW:', bimestresData);
        const processedData = handleApiResponse(bimestresData);
        console.log('Bimestres procesados:', processedData);
        setBimestres(processedData || []);
      } else {
        console.error('Error en bimestres:', await bimestresRes.text());
      }

      // MÓDULOS
      if (modulosRes.ok) {
        const modulosData = await modulosRes.json();
        console.log('Módulos RAW:', modulosData);
        const processedData = handleApiResponse(modulosData);
        console.log('Módulos procesados:', processedData);
        setModules(processedData || []);
      } else {
        console.error('Error en módulos:', await modulosRes.text());
      }

      // HORARIOS
      if (horariosRes.ok) {
        const horariosData = await horariosRes.json();
        console.log('Horarios RAW:', horariosData);
        const processedData = handleApiResponse(horariosData);
        console.log('Horarios procesados:', processedData);
        setHorarios(processedData || []);
      } else {
        console.error('Error en horarios:', await horariosRes.text());
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      showMessage('error', 'Error al cargar los datos iniciales');
    }
  };

  const loadModuleData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log(`Cargando módulo ID: ${id}`);
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${id}?include=modulo.curso,aula.sucursal,persona,horario,bimestre`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Módulo RAW:', result);
        
        const processedData = handleApiResponse(result);
        console.log('Módulo procesado:', processedData);
        
        if (processedData && processedData[0]) {
          const data = processedData[0];
          console.log('Datos del módulo:', data);
          
          setFormData({
            modulo_id: data.modulo_id || '',
            horario_id: data.horario_id || '',
            bimestre_id: data.bimestre_id || ''
          });

          // Información actual
          const info = [
            `Módulo: ${data.modulo?.nombre || 'N/A'}`,
            `Curso: ${data.modulo?.curso?.nombre || 'Sin curso'}`,
            `Docente: ${formatFullName(data.persona) || 'Sin asignar'}`,
            `Aula: ${data.aula?.numero_aula || 'Sin asignar'} (${data.aula?.sucursal?.alias || 'Sin sucursal'})`,
            `Horario: ${formatTime(data.horario?.hora_inicio) || 'N/A'} - ${formatTime(data.horario?.hora_fin) || 'N/A'}`,
            `Bimestre: ${data.bimestre?.nombre || 'Sin bimestre'} (${formatDate(data.bimestre?.fecha_inicio) || ''} - ${formatDate(data.bimestre?.fecha_fin) || ''})`
          ];
          setCurrentInfo(info.join(' | '));
        } else {
          console.error('No se encontraron datos procesados');
        }
      } else {
        const errorText = await response.text();
        console.error('Error en respuesta:', errorText);
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

  const handleSelectChange = (name, value) => {
    console.log(`Cambiando ${name} a:`, value);
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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      // Solo 3 campos obligatorios
      const requiredFields = ['modulo_id', 'horario_id', 'bimestre_id'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        showMessage('error', 'Por favor complete todos los campos obligatorios');
        return;
      }
      
      const response = await fetch(`http://localhost:8000/api/modulos_impartidos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Módulo impartido actualizado exitosamente');
        setTimeout(() => {
          navigate('/admin/modules');
        }, 1500);
      } else {
        showMessage('error', data.message || 'Error al actualizar módulo impartido');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error de conexión al servidor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/modules');
  };

  const formatFullName = (persona) => {
    if (!persona) return '';
    return `${persona.nombres} ${persona.ap_pat} ${persona.ap_mat || ''}`.trim();
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
      const modulo = modules.find(m => m.id == value);
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

  const renderDropdown = (field, label, options) => {
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
  };

  return (
    <Layout headerVariant="admin" pageSubtitle="Editar Módulo Impartido">
      <div className="editar-modulo-impartido-page">
        <div className="content-container">
          
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="page-header">
            <h2>Editar Módulo Impartido</h2>
            <p className="page-subtitle">Actualiza la información básica del módulo impartido</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando información del módulo...</p>
            </div>
          ) : (
            <>
              {/* Información Actual */}
              {currentInfo && (
                <div className="current-info-card">
                  <div className="current-info-header">
                    <h3>Información Actual del Módulo</h3>
                  </div>
                  <div className="current-info-content">
                    <p>{currentInfo}</p>
                  </div>
                </div>
              )}

              <div className="form-section">
                <div className="form-card">
                  <div className="form-card-header">
                    <h3>Modificar Datos Básicos</h3>
                    <div className="form-subtitle">
                      Solo se pueden editar los datos básicos del módulo
                      <br />
                      <small>Los campos docente y aula se gestionan en "Asignación de Horarios"</small>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSave} className="edit-form">
                    <div className="form-grid">
                      {renderDropdown('modulo_id', 'Módulo', modules)}
                      {renderDropdown('bimestre_id', 'Bimestre', bimestres)}
                      {renderDropdown('horario_id', 'Horario', horarios)}
                    </div>

                    {/* Información importante */}
                    <div className="important-info">
                      <h4>Información Importante:</h4>
                      <ul>
                        <li>Los cambios en módulo, bimestre y horario se reflejarán inmediatamente</li>
                        <li>No se puede cambiar módulo y bimestre si hay estudiantes inscritos</li>
                        <li>Para modificar docente o aula, use la página "Asignación de Horarios"</li>
                        <li>Los horarios disponibles dependen de la disponibilidad del sistema</li>
                      </ul>
                    </div>

                    {/* Botones */}
                    <div className="form-buttons">
                      <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="btn-secondary"
                        disabled={formLoading}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <span className="spinner"></span>
                            Guardando...
                          </>
                        ) : (
                          'Guardar Cambios'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditarModuloImpartido;