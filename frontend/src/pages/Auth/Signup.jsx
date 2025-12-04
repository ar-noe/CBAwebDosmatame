import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'; // CSS personalizado

const Signup = () =>{
    const [formData, setFormData] = useState({ //formulario
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'docente', // 'docente' o 'admin'
  });

const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Manejar cambios en los inputs
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

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a tu backend Laravel
      console.log('Datos a enviar:', {
        name: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Simulación de éxito
      setTimeout(() => {
        alert('Registro exitoso! Redirigiendo al login...');
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ submit: 'Error al registrar. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Logo y título */}
        <div className="signup-header">
          <div className="logo">
            <span className="logo-icon">CBA</span>
            <span className="logo-text">Colegio</span>
          </div>
          <h1 className="signup-title">Crear Cuenta</h1>
          <p className="signup-subtitle">
            Únete a nuestra plataforma educativa
          </p>
        </div>

        {/* Formulario */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          {/* Nombre y Apellido en una fila */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Tu nombre"
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="apellido" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`form-input ${errors.apellido ? 'input-error' : ''}`}
                placeholder="Tu apellido"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="ejemplo@colegio.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Tipo de usuario */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Tipo de Usuario
            </label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'docente' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="docente"
                  checked={formData.role === 'docente'}
                  onChange={handleChange}
                  className="role-input"
                />
                <div className="role-content">
                  <div className="role-icon">👨‍🏫</div>
                  <div className="role-info">
                    <div className="role-title">Docente</div>
                    <div className="role-description">Acceso a clases y calificaciones</div>
                  </div>
                </div>
              </label>

              <label className={`role-option ${formData.role === 'admin' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="role-input"
                />
                <div className="role-content">
                  <div className="role-icon">👨‍💼</div>
                  <div className="role-info">
                    <div className="role-title">Administrativo</div>
                    <div className="role-description">Acceso completo al sistema</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="form-group terms-group">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" required />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Registrando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {/* Enlace a login */}
          <div className="login-link">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link-text">
              Inicia sesión aquí
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="signup-footer">
          <p className="footer-text">
            © 2024 Colegio CBA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;