import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './MainModulosImp.css';

const MainModulosImp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docente: '',
    modulo: '',
    sucursal: '',
    aula: '',
    bimestre: ''
  });

  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [bimestres, setBimestres] = useState([]);

  useEffect(() => {
    loadInitialData();
    loadModules();
  }, []);

  const loadInitialData = async () => {
    try {
      // Simulación de datos
      const mockTeachers = [
        { id: 1, nombre: 'Juan Pérez' },
        { id: 2, nombre: 'María García' }
      ];
      const mockBranches = [
        { id: 1, alias: 'Central' },
        { id: 2, alias: 'Norte' }
      ];
      const mockClassrooms = [
        { id: 1, numero_aula: 'A-101' },
        { id: 2, numero_aula: 'A-102' }
      ];
      const mockBimestres = [
        { id: 1, descripcion: 'Primer Bimestre 2024' },
        { id: 2, descripcion: 'Segundo Bimestre 2024' }
      ];

      setTeachers(mockTeachers);
      setBranches(mockBranches);
      setClassrooms(mockClassrooms);
      setBimestres(mockBimestres);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const loadModules = async () => {
    try {
      // Simulación de módulos
      const mockModules = [
        { 
          id: 1, 
          Docente: 'Juan Pérez', 
          Modulo: 'Álgebra Lineal', 
          Curso: 'Matemáticas I',
          Aula: 'A-101',
          Sucursal: 'Central',
          Bimestre: 'Primer Bimestre',
          Gestion: '2024'
        },
        { 
          id: 2, 
          Docente: 'María García', 
          Modulo: 'Cálculo Diferencial', 
          Curso: 'Matemáticas II',
          Aula: 'A-102',
          Sucursal: 'Central',
          Bimestre: 'Primer Bimestre',
          Gestion: '2024'
        }
      ];
      setModules(mockModules);
    } catch (error) {
      console.error('Error cargando módulos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setFormData({
      ...formData,
      sucursal: branchId,
      aula: '' // Reset aula
    });
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      console.log('Agregando módulo:', formData);
      alert('Módulo agregado exitosamente');
      loadModules(); // Recargar lista
      handleClearForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar módulo');
    }
  };

  const handleClearForm = () => {
    setFormData({
      docente: '',
      modulo: '',
      sucursal: '',
      aula: '',
      bimestre: ''
    });
  };

  const handleEditModule = (moduleId) => {
    navigate(`/module/edit-impartido/${moduleId}`);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm('¿Está seguro de eliminar este módulo?')) {
      console.log('Eliminando módulo:', moduleId);
      alert('Módulo eliminado exitosamente');
    }
  };

  const handleSearch = () => {
    console.log('Buscando:', searchTerm);
  };

  const handleRefresh = () => {
    loadModules();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-modulos-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Gestión de Módulos Impartidos</p>
          </div>
        </div>
      </div>

      <main className="main-modulos-content">
        <div className="content-container">
          <div className="page-header">
            <h2>📚 Gestión de Módulos Impartidos</h2>
          </div>

          {/* Formulario para agregar módulos */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Agregar Nuevo Módulo Impartido</h3>
              </div>
              
              <form onSubmit={handleAddModule} className="add-module-form">
                <div className="form-grid">
                  {/* Fila 1 */}
                  <div className="form-group">
                    <label>Docente:</label>
                    <select
                      name="docente"
                      value={formData.docente}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Seleccionar Docente --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Módulo:</label>
                    <select
                      name="modulo"
                      value={formData.modulo}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Seleccionar Módulo --</option>
                      <option value="1">Álgebra Lineal</option>
                      <option value="2">Cálculo Diferencial</option>
                    </select>
                  </div>

                  {/* Fila 2 */}
                  <div className="form-group">
                    <label>Sucursal:</label>
                    <select
                      name="sucursal"
                      value={formData.sucursal}
                      onChange={handleBranchChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Seleccionar Sucursal --</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.alias}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aula:</label>
                    <select
                      name="aula"
                      value={formData.aula}
                      onChange={handleChange}
                      className="form-select"
                      required
                      disabled={!formData.sucursal}
                    >
                      <option value="">-- Seleccionar Aula --</option>
                      {classrooms.map((classroom) => (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.numero_aula}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fila 3 - Bimestre */}
                  <div className="form-group">
                    <label>Bimestre:</label>
                    <select
                      name="bimestre"
                      value={formData.bimestre}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Seleccionar Bimestre --</option>
                      {bimestres.map((bimestre) => (
                        <option key={bimestre.id} value={bimestre.id}>
                          {bimestre.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    ➕ Agregar Módulo
                  </button>
                  <button type="button" onClick={handleClearForm} className="btn-secondary">
                    🔄 Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lista de módulos existentes */}
          <div className="modules-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Módulos Impartidos Existentes</h3>
              </div>

              {/* Barra de búsqueda */}
              <div className="search-bar">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                  placeholder="Buscar módulos..."
                />
                <button onClick={handleSearch} className="btn-primary search-btn">
                  🔍 Buscar
                </button>
                <button onClick={handleRefresh} className="btn-secondary refresh-btn">
                  🔄 Actualizar
                </button>
              </div>

              {/* Tabla de módulos */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Docente</th>
                      <th>Módulo</th>
                      <th>Curso</th>
                      <th>Aula</th>
                      <th>Sucursal</th>
                      <th>Bimestre</th>
                      <th>Gestión</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.id}>
                        <td>{module.id}</td>
                        <td>{module.Docente}</td>
                        <td>{module.Modulo}</td>
                        <td>{module.Curso}</td>
                        <td>{module.Aula}</td>
                        <td>{module.Sucursal}</td>
                        <td>{module.Bimestre}</td>
                        <td>{module.Gestion}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEditModule(module.id)}
                              className="btn-small edit-btn"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteModule(module.id)}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainModulosImp;