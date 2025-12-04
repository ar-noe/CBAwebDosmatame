import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import './EditarModuloImpartido.css';

const EditarModuloImpartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docente: '',
    modulo: '',
    sucursal: '',
    aula: '',
    bimestre: ''
  });

  const [teachers, setTeachers] = useState([]);
  const [modules, setModules] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [currentInfo, setCurrentInfo] = useState('');

  useEffect(() => {
    loadFormData();
    loadCurrentModuleInfo();
  }, [id]);

  const loadFormData = async () => {
    try {
      // Simulación de datos
      const mockTeachers = [
        { id: 1, NombreCompleto: 'Juan Pérez' },
        { id: 2, NombreCompleto: 'María García' }
      ];
      const mockModules = [
        { id: 1, NombreModulo: 'Álgebra Lineal' },
        { id: 2, NombreModulo: 'Cálculo Diferencial' }
      ];
      const mockBranches = [
        { id: 1, Alias: 'Central' },
        { id: 2, Alias: 'Norte' }
      ];
      const mockClassrooms = [
        { id: 1, NumeroAula: 'A-101' },
        { id: 2, NumeroAula: 'A-102' }
      ];
      const mockBimestres = [
        { id: 1, Descripcion: 'Primer Bimestre 2024' },
        { id: 2, Descripcion: 'Segundo Bimestre 2024' }
      ];

      setTeachers(mockTeachers);
      setModules(mockModules);
      setBranches(mockBranches);
      setClassrooms(mockClassrooms);
      setBimestres(mockBimestres);

      // Datos iniciales del formulario
      setFormData({
        docente: '1',
        modulo: '1',
        sucursal: '1',
        aula: '1',
        bimestre: '1'
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const loadCurrentModuleInfo = () => {
    // Simulación de información actual
    setCurrentInfo('Módulo: Álgebra Lineal | Docente: Juan Pérez | Aula: A-101 | Sucursal: Central | Bimestre: Primer Bimestre 2024');
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
      aula: '' // Reset aula al cambiar sucursal
    });
    // Aquí cargarías las aulas de la sucursal seleccionada
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log('Guardando cambios:', formData);
      alert('Cambios guardados exitosamente');
      navigate('/modules');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar cambios');
    }
  };

  const handleCancel = () => {
    navigate('/modules');
  };

  return (
    <div className="editar-modulo-impartido-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Editar Módulo Impartido</p>
          </div>
        </div>
      </div>

      <main className="editar-modulo-impartido-main">
        <div className="content-container">
          <div className="page-header">
            <h2>Editar Módulo Impartido</h2>
          </div>

          <div className="form-card">
            <div className="form-card-header">
              <h3>Datos del Módulo Impartido</h3>
            </div>

            {/* Información Actual */}
            {currentInfo && (
              <div className="current-info">
                <h4>Información Actual:</h4>
                <p>{currentInfo}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="edit-form">
              <div className="form-grid">
                {/* Fila 1 - Docente y Módulo */}
                <div className="form-group">
                  <label>Docente:</label>
                  <select
                    name="docente"
                    value={formData.docente}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- Seleccionar Docente --</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.NombreCompleto}
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
                  >
                    <option value="">-- Seleccionar Módulo --</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.NombreModulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fila 2 - Sucursal y Aula */}
                <div className="form-group">
                  <label>Sucursal:</label>
                  <select
                    name="sucursal"
                    value={formData.sucursal}
                    onChange={handleBranchChange}
                    className="form-select"
                  >
                    <option value="">-- Seleccionar Sucursal --</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.Alias}
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
                    disabled={!formData.sucursal}
                  >
                    <option value="">-- Seleccionar Aula --</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.NumeroAula}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fila 3 - Bimestre */}
                <div className="form-group full-width">
                  <label>📅 Bimestre:</label>
                  <select
                    name="bimestre"
                    value={formData.bimestre}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- Seleccionar Bimestre --</option>
                    {bimestres.map((bimestre) => (
                      <option key={bimestre.id} value={bimestre.id}>
                        {bimestre.Descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Información adicional */}
              <div className="important-info">
                <h4>📋 Información Importante:</h4>
                <ul>
                  <li>Para asignar un horario al curso debe ir a la pestaña 'Ver Horarios'</li>
                  <li>No se puede cambiar módulo y bimestre si hay estudiantes inscritos</li>
                  <li>El horario se mantiene como nulo por defecto</li>
                </ul>
              </div>

              {/* Botones */}
              <div className="form-buttons">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  ❌ Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  💾 Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarModuloImpartido;