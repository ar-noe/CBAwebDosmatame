import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Layout from '../../components/Layout/Layout';
//import api from '../../services/api'; // Asegúrate de tener este servicio configurado

const Signup = () => {
  const [formData, setFormData] = useState({
    ci: '',
    nombres: '',
    ap_pat: '',
    ap_mat: '',
    fecha_nac: '',
    rol_id: '2', // Valor por defecto para docente
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Si tienes API para roles
        // const response = await api.get('/roles');
        // setRoles(response.data);
        
        const mockRoles = [
          { id: 2, nombre: 'Docente' },
          { id: 1, nombre: 'Administrador' }
        ];
        setRoles(mockRoles);
      } catch (error) {
        console.error('Error cargando roles:', error);
      }
    };
    
    fetchRoles();
  }, []);

  const handleExit = () => {
    if (window.confirm('¿Estás seguro de que quieres salir?')) {
      navigate('/');
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ci.trim()) {
      newErrors.ci = 'El CI es requerido';
    } else if (!/^\d{7,10}$/.test(formData.ci)) {
      newErrors.ci = 'CI debe tener 7-10 dígitos';
    }
    
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    } else if (formData.nombres.length > 70) {
      newErrors.nombres = 'Máximo 70 caracteres';
    }
    
    if (!formData.ap_pat.trim()) {
      newErrors.ap_pat = 'Apellido paterno requerido';
    } else if (formData.ap_pat.length > 50) {
      newErrors.ap_pat = 'Máximo 50 caracteres';
    }
    
    if (!formData.ap_mat.trim()) {
      newErrors.ap_mat = 'Apellido materno requerido';
    } else if (formData.ap_mat.length > 50) {
      newErrors.ap_mat = 'Máximo 50 caracteres';
    }
    
    if (!formData.fecha_nac) {
      newErrors.fecha_nac = 'Fecha de nacimiento requerida';
    } else {
      const birthDate = new Date(formData.fecha_nac);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 14) {
        newErrors.fecha_nac = 'Debe ser mayor de 14 años';
      }
    }
    
    if (!formData.rol_id) {
      newErrors.rol_id = 'Seleccione un tipo de usuario';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedCredentials(null);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    try {
      // Obtener el token del localStorage (asumiendo que el admin está logueado)
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrors({ submit: 'Debe iniciar sesión como administrador primero' });
        setLoading(false);
        return;
      }
      
      const dataToSend = {
        ci: formData.ci,
        nombres: formData.nombres,
        ap_pat: formData.ap_pat,
        ap_mat: formData.ap_mat,
        fecha_nac: formData.fecha_nac,
        rol_id: parseInt(formData.rol_id)
      };
      
      console.log('Datos a enviar:', dataToSend);
      
      // Llamada a la API real
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }
      
      // Mostrar credenciales generadas
      setGeneratedCredentials({
        usuario: data.credenciales_generadas.correo,
        contrasenia: data.credenciales_generadas.contrasenia
      });
      
      alert('¡Registro exitoso! Las credenciales se han generado automáticamente.');
      
      // limpiar formulario
       setFormData({
         ci: '',
         nombres: '',
         ap_pat: '',
         ap_mat: '',
         fecha_nac: '',
         rol_id: '2',
       });
      
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        setErrors({ submit: 'No tiene permisos de administrador para registrar usuarios' });
      } else if (error.message.includes('CI ya existe')) {
        setErrors({ submit: 'El CI ya está registrado en el sistema' });
      } else {
        setErrors({ submit: error.message || 'Error al registrar. Intenta nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Función para copiar credenciales al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Credencial copiada al portapapeles'))
      .catch(err => console.error('Error al copiar:', err));
  };

  return (
    <Layout headerVariant="signup" pageSubtitle="Personal Data Registration">
      <div className="signup-page">
        <main className="signup-main-content">
          <div className="signup-card-container">
            <div className="signup-card">
              <div className="signup-header">
                <h1 className="signup-title">Registro CBA</h1>
                <p className="signup-subtitle">Completa los datos para crear una cuenta</p>
                <p className="credentials-info">
                  <strong>Nota:</strong> El usuario y contraseña se generan automáticamente
                </p>
              </div>
              
              {errors.submit && (
                <div className="alert alert-error">
                  {errors.submit}
                </div>
              )}
              
              {/* Mostrar credenciales generadas */}
              {generatedCredentials && (
                <div className="credentials-card">
                  <h3> ¡Usuario Registrado Exitosamente!</h3>
                  <div className="credentials-info">
                    <p><strong>Credenciales generadas:</strong></p>
                    <div className="credential-item">
                      <span className="credential-label">Usuario:</span>
                      <span className="credential-value">{generatedCredentials.usuario}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedCredentials.usuario)}
                        className="copy-btn"
                      >
                         Copiar
                      </button>
                    </div>
                    <div className="credential-item">
                      <span className="credential-label">Contraseña:</span>
                      <span className="credential-value">{generatedCredentials.contrasenia}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedCredentials.contrasenia)}
                        className="copy-btn"
                      >
                         Copiar
                      </button>
                    </div>
                    <p className="credentials-warning">
                      Guarde estas credenciales. Serán necesarias para el primer inicio de sesión.
                    </p>
                  </div>
                </div>
              )}
              
              <form className="signup-form" onSubmit={handleSubmit}>
                {/* Sección: Datos Personales */}
                <div className="form-section">
                  <h3 className="section-title">Datos Personales</h3>
                  
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="form-label">CI / Documento de Identidad *</label>
                      <input
                        type="text"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        className={`form-input ${errors.ci ? 'input-error' : ''}`}
                        placeholder="Ej: 12345678"
                        maxLength="10"
                      />
                      {errors.ci && <span className="error-message">{errors.ci}</span>}
                      
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="form-label">Nombres *</label>
                      <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        className={`form-input ${errors.nombres ? 'input-error' : ''}`}
                        placeholder="Ej: Juan Carlos"
                        maxLength="70"
                      />
                      {errors.nombres && <span className="error-message">{errors.nombres}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row two-columns">
                    <div className="form-group">
                      <label className="form-label">Apellido Paterno *</label>
                      <input
                        type="text"
                        name="ap_pat"
                        value={formData.ap_pat}
                        onChange={handleChange}
                        className={`form-input ${errors.ap_pat ? 'input-error' : ''}`}
                        placeholder="Ej: Pérez"
                        maxLength="50"
                      />
                      {errors.ap_pat && <span className="error-message">{errors.ap_pat}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Apellido Materno *</label>
                      <input
                        type="text"
                        name="ap_mat"
                        value={formData.ap_mat}
                        onChange={handleChange}
                        className={`form-input ${errors.ap_mat ? 'input-error' : ''}`}
                        placeholder="Ej: González"
                        maxLength="50"
                      />
                      {errors.ap_mat && <span className="error-message">{errors.ap_mat}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="form-label">Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        name="fecha_nac"
                        value={formData.fecha_nac}
                        onChange={handleChange}
                        className={`form-input ${errors.fecha_nac ? 'input-error' : ''}`}
                        max={getMinDate()}
                        min={getMaxDate()}
                      />
                      {errors.fecha_nac && <span className="error-message">{errors.fecha_nac}</span>}
                      <div className="form-hint">
                        Debe ser mayor de 14 años.
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sección: Tipo de Usuario */}
                <div className="form-section">
                  <h3 className="section-title">Tipo de Usuario</h3>
                  
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="form-label">Rol del Usuario *</label>
                      <select
                        name="rol_id"
                        value={formData.rol_id}
                        onChange={handleChange}
                        className={`form-select ${errors.rol_id ? 'input-error' : ''}`}
                      >
                        <option value="">Seleccione un rol</option>
                        {roles.map((rol) => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.rol_id && <span className="error-message">{errors.rol_id}</span>}
                      <div className="form-hint">
                        <strong>* Docente:</strong> Acceso a horarios de clases<br />
                        <strong>* Administrador:</strong> Acceso completo al sistema
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Información de credenciales automáticas */}
                <div className="credentials-preview">
                  <h4>Credenciales que se generarán:</h4>
                  <div className="preview-item">
                    <span>Usuario:</span>
                    <code>{formData.ci ? `cba${formData.ci}` : 'cba[CI]'}</code>
                  </div>
                  <div className="preview-item">
                    <span>Contraseña:</span>
                    <code>
                      {formData.fecha_nac 
                        ? `Cb@${formData.fecha_nac.replace(/-/g, '')}`
                        : 'Cb@YYYYMMDD'
                      }
                    </code>
                  </div>
                </div>
                
                {/* Botón de registro */}
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registrando...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </form>
              
              {/* Botones adicionales */}
              <div className="button-row">
                <button 
                  onClick={handleExit}
                  className="secondary-btn"
                >
                  Salir
                </button>
                <button 
                  onClick={handleGoToLogin}
                  className="primary-btn"
                >
                  Ir a Login
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Signup;