import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './EditarModuloImpartido.css';

const EditarModuloImpartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    modulo_id: '',
    aula_id: '',
    persona_id: '',
    horario_id: '',
    bimestre_id: ''
  });

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [teachers, setTeachers] = useState([]);
  const [modules, setModules] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [currentInfo, setCurrentInfo] = useState('');
  
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
    loadModuleData();
  }, [id]);

  // FUNCIÓN PARA PROCESAR RESPUESTAS DE API - MISM QUE EN MainModulosImp
  const handleApiResponse = (data) => {
    console.log('handleApiResponse - Datos recibidos:', data);
    
    // Si la respuesta tiene la estructura { data: [...], message: ... }
    if (data && data.data) {
      // Si data.data es un array, devolverlo directamente
      if (Array.isArray(data.data)) {
        console.log('Devolviendo data.data (array):', data.data.length);
        return data.data;
      }
      // Si es un objeto, devolverlo como array con un elemento
      console.log('Devolviendo [data.data] (objeto):', data.data);
      return [data.data];
    }
    
    // Si es directamente un array
    if (Array.isArray(data)) {
      console.log('Devolviendo data (array directo):', data.length);
      return data;
    }
    
    // Si es un objeto con otra estructura
    if (typeof data === 'object' && data !== null) {
      // Buscar arrays dentro del objeto
      const arrays = Object.values(data).filter(Array.isArray);
      if (arrays.length > 0) {
        console.log('Encontrado array en objeto:', arrays[0].length);
        return arrays[0];
      }
    }
    
    console.log('No se encontraron datos válidos, devolviendo []');
    return [];
  };

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Cargando datos iniciales...');
      
      const [personasRes, classroomsRes, bimestresRes, modulosRes, horariosRes] = 
        await Promise.all([
          fetch('http://localhost:8000/api/personas', {
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

      // PERSONAS (Docentes)
      if (personasRes.ok) {
        const personasData = await personasRes.json();
        console.log('Personas RAW:', personasData);
        const processedData = handleApiResponse(personasData);
        console.log('Personas procesadas:', processedData);
        setTeachers(processedData || []);
      } else {
        console.error('Error en personas:', await personasRes.text());
      }

      // AULAS
      if (classroomsRes.ok) {
        const classroomsData = await classroomsRes.json();
        console.log('Aulas RAW:', classroomsData);
        const processedData = handleApiResponse(classroomsData);
        console.log('Aulas procesadas:', processedData);
        setClassrooms(processedData || []);
      } else {
        console.error('Error en aulas:', await classroomsRes.text());
      }

      // BIMESTRES - ESTE ES EL QUE NO SE MUESTRA
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
        
        // Procesar con handleApiResponse
        const processedData = handleApiResponse(result);
        console.log('Módulo procesado:', processedData);
        
        if (processedData && processedData[0]) {
          const data = processedData[0];
          console.log('Datos del módulo:', data);
          console.log('Bimestre del módulo:', data.bimestre);
          console.log('Bimestre ID:', data.bimestre_id);
          
          setFormData({
            modulo_id: data.modulo_id || '',
            aula_id: data.aula_id || '',
            persona_id: data.persona_id || '',
            horario_id: data.horario_id || '',
            bimestre_id: data.bimestre_id || ''
          });

          // Información actual
          const info = [
            `Módulo: ${data.modulo?.nombre || 'N/A'}`,
            `Curso: ${data.modulo?.curso?.nombre || 'Sin curso'}`,
            `Docente: ${formatFullName(data.persona) || 'N/A'}`,
            `Aula: ${data.aula?.numero_aula || 'N/A'}`,
            `Sucursal: ${data.aula?.sucursal?.alias || 'Sin sucursal'}`,
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
      
      const requiredFields = ['modulo_id', 'aula_id', 'persona_id', 'bimestre_id'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        showMessage('error', 'Por favor complete todos los campos requeridos');
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
        showMessage('success', '✅ Módulo impartido actualizado exitosamente');
        setTimeout(() => {
          navigate('/admin/modules');
        }, 1500);
      } else {
        showMessage('error', data.message || '❌ Error al actualizar módulo impartido');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', '❌ Error de conexión al servidor');
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
      if (field === 'persona_id') {
        return formatFullName(option).toLowerCase().includes(search) ||
               option.ci?.toLowerCase().includes(search);
      } else if (field === 'modulo_id') {
        const moduloText = `${option.nombre} ${option.curso?.nombre || ''}`;
        return moduloText.toLowerCase().includes(search);
      } else if (field === 'aula_id') {
        const aulaText = `${option.numero_aula} ${option.sucursal?.alias || 'Sin sucursal'}`;
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
    console.log(`getSelectedValue para ${field}:`, value);
    
    if (!value) {
      console.log(`Valor vacío para ${field}, devolviendo ''`);
      return '';
    }
    
    if (field === 'persona_id') {
      const teacher = teachers.find(t => t.id == value);
      console.log('Teacher encontrado:', teacher);
      return teacher ? formatFullName(teacher) : '';
    } else if (field === 'modulo_id') {
      const modulo = modules.find(m => m.id == value);
      console.log('Módulo encontrado:', modulo);
      return modulo ? `${modulo.nombre} (${modulo.curso?.nombre || 'Sin curso'})` : '';
    } else if (field === 'aula_id') {
      const aula = classrooms.find(a => a.id == value);
      console.log('Aula encontrada:', aula);
      return aula ? `${aula.numero_aula} (${aula.sucursal?.alias || 'Sin sucursal'})` : '';
    } else if (field === 'horario_id') {
      const horario = horarios.find(h => h.id == value);
      console.log('Horario encontrado:', horario);
      return horario ? `${formatTime(horario.hora_inicio)} - ${formatTime(horario.hora_fin)}` : '';
    } else if (field === 'bimestre_id') {
      const bimestre = bimestres.find(b => b.id == value);
      console.log('Bimestre encontrado:', bimestre);
      console.log('Todos los bimestres:', bimestres);
      return bimestre ? `${bimestre.nombre} (${formatDate(bimestre.fecha_inicio)} - ${formatDate(bimestre.fecha_fin)})` : '';
    }
    return '';
  };

  // AGREGAR FUNCIÓN PARA DEBUG
  const handleDebugClick = () => {
    console.log('=== DEBUG EditarModuloImpartido ===');
    console.log('Bimestres:', bimestres);
    console.log('Total bimestres:', bimestres.length);
    console.log('Teachers:', teachers.length);
    console.log('Modules:', modules.length);
    console.log('Classrooms:', classrooms.length);
    console.log('Horarios:', horarios.length);
    console.log('Form Data:', formData);
    console.log('Bimestre ID en formData:', formData.bimestre_id);
    
    if (bimestres.length > 0) {
      console.log('Primer bimestre:', bimestres[0]);
      console.log('Bimestres disponibles:');
      bimestres.forEach((b, i) => {
        console.log(`${i}: ID=${b.id}, Nombre=${b.nombre}, Fecha Inicio=${b.fecha_inicio}, Fecha Fin=${b.fecha_fin}`);
      });
    }
    
    showMessage('info', `Datos: Bimestres(${bimestres.length}), Teachers(${teachers.length}), Modules(${modules.length})`, 5000);
  };

  const renderDropdown = (field, label, options) => {
    console.log(`renderDropdown ${field}:`, options.length, 'opciones');
    
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

          {/* BOTÓN DE DEBUG */}
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
            <h2>✏️ Editar Módulo Impartido</h2>
            <p className="page-subtitle">Actualiza la información del módulo impartido</p>
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
                    <h3>📋 Información Actual</h3>
                  </div>
                  <div className="current-info-content">
                    <p>{currentInfo}</p>
                  </div>
                </div>
              )}

              <div className="form-section">
                <div className="form-card">
                  <div className="form-card-header">
                    <h3>Modificar Datos</h3>
                    <div className="form-subtitle">Seleccione los nuevos valores para cada campo</div>
                  </div>
                  
                  <form onSubmit={handleSave} className="edit-form">
                    <div className="form-grid">
                      {renderDropdown('persona_id', 'Docente', teachers)}
                      {renderDropdown('modulo_id', 'Módulo', modules)}
                      {renderDropdown('aula_id', 'Aula', classrooms)}
                      {renderDropdown('bimestre_id', 'Bimestre', bimestres)}
                      {renderDropdown('horario_id', 'Horario (Opcional)', horarios)}
                    </div>

                    {/* Información importante */}
                    <div className="important-info">
                      <h4>📋 Información Importante:</h4>
                      <ul>
                        <li>Para asignar un horario diferente debe seleccionarlo en el campo correspondiente</li>
                        <li>No se puede cambiar módulo y bimestre si hay estudiantes inscritos</li>
                        <li>Los cambios se reflejarán inmediatamente en el sistema</li>
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
                        ❌ Cancelar
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
                          '💾 Guardar Cambios'
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