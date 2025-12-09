// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Layout from '../../components/Layout/Layout';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '', // Cambiado de 'email' a 'correo'
    contrasenia: '' // Cambiado de 'password' a 'contrasenia'
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
    
    if (!formData.correo.trim()) {
      newErrors.correo = 'Usuario es requerido';
    }
    
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'Contraseña requerida';
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
      
      // Llamada real a la API
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Mostrar mensaje de éxito
      alert('¡Inicio de sesión exitoso!');
      
      // Redirigir según el rol
      if (data.usuario.rol_id === 1) {
        navigate('/admin/dashboard'); // Admin
      } else {
        navigate('/modules'); // Otros usuarios
      }
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' });
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
    <Layout headerVariant="login" pageSubtitle="Log In">
      <div className="login-page">
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
                  <label className="form-label">Usuario:</label>
                  <input
                    type="text"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={`form-input ${errors.correo ? 'input-error' : ''}`}
                    placeholder="cba + [número de CI]"
                  />
                  {errors.correo && <span className="error-message">{errors.correo}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña:</label>
                  <input
                    type="password"
                    name="contrasenia"
                    value={formData.contrasenia}
                    onChange={handleChange}
                    className={`form-input ${errors.contrasenia ? 'input-error' : ''}`}
                    placeholder="Cb@ + [fecha de nacimient○] (YYYYMMDD)"
                  />
                  {errors.contrasenia && <span className="error-message">{errors.contrasenia}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Iniciando sesión...
                    </>
                  ) : 'Iniciar Sesión'}
                </button>
              </form>
              
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Login;