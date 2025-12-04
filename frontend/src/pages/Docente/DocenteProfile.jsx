// src/pages/Docente/DocenteProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './DocenteProfile.css';

const DocenteProfile = () => {
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem('userId') || 1;
      
      // En producción sería:
      // const personaResponse = await axios.get(`/api/personas/${teacherId}`);
      // const usuarioResponse = await axios.get(`/api/usuarios/persona/${teacherId}`);
      
      // Datos de ejemplo según tu BD
      const mockPersona = {
        id: 1,
        ci: '1234567',
        nombres: 'Juan',
        ap_pat: 'Pérez',
        ap_mat: 'Gómez',
        fecha_nac: '1985-03-15'
      };
      
      const mockUsuario = {
        id: 1,
        correo: 'juan.perez@cba.edu',
        rol_id: 2, // Docente
        persona_id: 1
      };
      
      setPersona(mockPersona);
      setUsuario(mockUsuario);
      setFormData({
        ...mockPersona,
        correo: mockUsuario.correo
      });
      setLoading(false);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error al cargar perfil');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // En producción:
      // await axios.put(`/api/personas/${persona.id}`, formData);
      // await axios.put(`/api/usuarios/${usuario.id}`, { correo: formData.correo });
      
      setPersona(formData);
      setUsuario({ ...usuario, correo: formData.correo });
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar perfil');
    }
  };

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="docente-profile">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Información personal y profesional</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Información Personal */}
        <div className="form-section">
          <div className="section-header">
            <h2>📋 Información Personal</h2>
            <button 
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Cancelar' : '✏️ Editar'}
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>CI / Documento de Identidad</label>
              <input
                type="text"
                name="ci"
                value={formData.ci || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="ap_pat"
                value={formData.ap_pat || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="ap_mat"
                value={formData.ap_mat || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nac"
                value={formData.fecha_nac || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                value={formData.correo || ''}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="form-section">
          <div className="section-header">
            <h2>👤 Información de Cuenta</h2>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Rol</label>
              <input
                type="text"
                value="Docente"
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label>ID de Persona</label>
              <input
                type="text"
                value={persona?.id || ''}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label>ID de Usuario</label>
              <input
                type="text"
                value={usuario?.id || ''}
                className="form-input"
                disabled
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              💾 Guardar Cambios
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DocenteProfile;