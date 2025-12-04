import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulación de login
    const mockUser = {
      id: 1,
      name: 'Usuario Demo',
      email: email,
      role: 'docente' // Cambia a 'admin' para probar el panel administrativo
    };
    
    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Iniciar Sesión
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿No tienes cuenta? <a href="/signup">Regístrate</a>
      </p>
      <button 
        onClick={() => {
          setEmail('docente@demo.com');
          setPassword('password');
        }}
        style={{ marginTop: '1rem', fontSize: '12px' }}
      >
        Usar datos de prueba (docente)
      </button>
      <button 
        onClick={() => {
          setEmail('admin@demo.com');
          setPassword('password');
        }}
        style={{ marginTop: '1rem', fontSize: '12px', marginLeft: '10px' }}
      >
        Usar datos de prueba (admin)
      </button>
    </div>
  );
};

export default Login;