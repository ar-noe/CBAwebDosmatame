// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Contraseña requerida';
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
      console.log('Iniciando sesión:', formData);
      
      // Simulación de login exitoso
      setTimeout(() => {
        alert('¡Inicio de sesión exitoso!');
        navigate('/modules'); // Redirigir a módulos después del login
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error al iniciar sesión. Verifica tus credenciales.' });
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('¿Estás seguro de que quieres salir?')) {
      navigate('/');
    }
  };

  const handleGoToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Log In</p>
          </div>
        </div>
      </div>

      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder al sistema</p>
            </div>

            {errors.submit && (
              <div className="alert alert-error">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="ejemplo@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Ingresa tu contraseña"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Recordarme</span>
                </label>
                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="login-footer">
              <p>¿No tienes una cuenta?{' '}
                <button 
                  onClick={handleGoToSignUp}
                  className="link-btn"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <div className="login-buttons">
              <button onClick={handleExit} className="btn-secondary">
                Exit
              </button>
              <button onClick={handleGoToSignUp} className="btn-primary">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;