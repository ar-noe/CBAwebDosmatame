// src/pages/Auth/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    // Datos de persona (tabla personas)
    ci: '',
    nombres: '',
    ap_pat: '',
    ap_mat: '',
    fecha_nac: '',
    
    // Datos de usuario (tabla usuarios)
    correo: '',
    contrasenia: '',
    confirmContrasenia: '',
    rol_id: '1', // Por defecto Admin 
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Cargar roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // En producción: const response = await fetch('http://localhost:8000/api/roles');
        // const data = await response.json();
        
        // Simulación de roles
        const mockRoles = [
          { id: 1, nombre: 'Administrador' },
          { id: 2, nombre: 'Docente' }
        ];
        setRoles(mockRoles);
      } catch (error) {
        console.error('Error cargando roles:', error);
      }
    };
    
    fetchRoles();
  }, []);

  // Función para manejar salida
  const handleExit = () => {
    if (window.confirm('¿Estás seguro de que quieres salir?')) {
      // Para aplicaciones web, normalmente navegamos a la página principal
      // en lugar de cerrar la ventana
      navigate('/');
      // Si es una aplicación de escritorio, podrías usar:
      // window.close();
    }
  };

  // Función para ir a login
  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación CI (12 dígitos máximo)
    if (!formData.ci.trim()) {
      newErrors.ci = 'El CI es requerido';
    } else if (!/^\d{8,12}$/.test(formData.ci)) {
      newErrors.ci = 'CI debe tener 8-12 dígitos';
    }
    
    // Validación nombres (hasta 70 caracteres)
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    } else if (formData.nombres.length > 70) {
      newErrors.nombres = 'Máximo 70 caracteres';
    }
    
    // Validación apellidos (hasta 50 caracteres)
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
    
    // Validación fecha de nacimiento
    if (!formData.fecha_nac) {
      newErrors.fecha_nac = 'Fecha de nacimiento requerida';
    } else {
      const birthDate = new Date(formData.fecha_nac);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.fecha_nac = 'Debe ser mayor de 18 años';
      }
    }
    
    // Validación correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'Correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Correo no válido';
    }
    
    // Validación contraseña
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'Contraseña requerida';
    } else if (formData.contrasenia.length < 6) {
      newErrors.contrasenia = 'Mínimo 6 caracteres';
    }
    
    // Validación confirmación
    if (formData.contrasenia !== formData.confirmContrasenia) {
      newErrors.confirmContrasenia = 'Las contraseñas no coinciden';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    try {
      // Estructura para enviar al backend Laravel
      const dataToSend = {
        // Datos para tabla personas
        persona: {
          ci: formData.ci,
          nombres: formData.nombres,
          ap_pat: formData.ap_pat,
          ap_mat: formData.ap_mat,
          fecha_nac: formData.fecha_nac
        },
        
        // Datos para tabla usuarios
        usuario: {
          correo: formData.correo,
          contrasenia: formData.contrasenia,
          rol_id: parseInt(formData.rol_id)
        }
      };
      
      console.log('Datos a enviar:', dataToSend);
      
      // Simulación exitosa
      setTimeout(() => {
        alert('¡Registro exitoso! Revisa la consola para ver los datos.');
        console.log('Registro simulado - Datos:', dataToSend);
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error al registrar. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Calcular edad mínima para fecha de nacimiento
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="signup-container">
      {/* Barra de navegación superior */}
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src="C:\arasStuff\Sem3\Web2\proyectoCBAInterfaz\frontend\src\images\cba.png" 
              alt="CBA Logo" 
              className="logo-image"
            />
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Sign Up</p>
          </div>
        </div>
      </div>

      <main className="signup-card">
        <header className="signup-header">
          <div className="logo">
            <div className="logo-icon">CBA</div>
            <div className="logo-text">Colégio Boliviano Argentino</div>
          </div>
          <h1 className="signup-title">Registro CBA</h1>
          <p className="signup-subtitle">Completa los datos para crear una cuenta</p>
        </header>
        
        {errors.submit && (
          <div className="alert alert-error">
            {errors.submit}
          </div>
        )}
        
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Sección: Datos Personales */}
          <div className="form-section">
            <h3 className="section-title">Datos Personales</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  CI / Documento de Identidad *
                </label>
                <input
                  type="text"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  className={`form-input ${errors.ci ? 'input-error' : ''}`}
                  placeholder="Ej: 1234567"
                  maxLength="12"
                />
                {errors.ci && <span className="error-message">{errors.ci}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Nombres *
                </label>
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
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Apellido Paterno *
                </label>
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
                <label className="form-label">
                  Apellido Materno *
                </label>
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
              <div className="form-group">
                <label className="form-label">
                  Fecha de Nacimiento *
                </label>
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
                <div className="form-hint">Debes ser mayor de 18 años</div>
              </div>
            </div>
          </div>
          
          {/* Sección: Datos de Cuenta */}
          <div className="form-section">
            <h3 className="section-title">Datos de Cuenta</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`form-input ${errors.correo ? 'input-error' : ''}`}
                  placeholder="ejemplo@email.com"
                />
                {errors.correo && <span className="error-message">{errors.correo}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  className={`form-input ${errors.contrasenia ? 'input-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.contrasenia && <span className="error-message">{errors.contrasenia}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmContrasenia"
                  value={formData.confirmContrasenia}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmContrasenia ? 'input-error' : ''}`}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmContrasenia && <span className="error-message">{errors.confirmContrasenia}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Tipo de Usuario *
                </label>
                <select
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                <div className="form-hint">
                  * Docente: Acceso a horarios de clases<br />
                  * Administrador: Acceso a asignación de módulos y docentes
                </div>
              </div>
            </div>
          </div>
          
          {/* Términos y condiciones */}
          <div className="form-group terms-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                className="checkbox-input" 
                required 
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                Acepto los <a href="#" className="terms-link">términos y condiciones</a> y la <a href="#" className="terms-link">política de privacidad</a>
              </span>
            </label>
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
        
        <div className="login-link">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="login-link-text"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;