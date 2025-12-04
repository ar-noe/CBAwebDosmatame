// src/pages/Schedule/EditHorarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './EditHorarios.css';

const EditHorarios = () => {
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  // Datos de ejemplo
  const [teacherSchedules, setTeacherSchedules] = useState([
    { id: 1, hora: '08:00 - 10:00', nombreCurso: 'Matemáticas I', aula: 'A-101', dia: 'Lunes', sucursal: 'Central' },
    { id: 2, hora: '10:00 - 12:00', nombreCurso: 'Física I', aula: 'A-102', dia: 'Lunes', sucursal: 'Central' },
    { id: 3, hora: '14:00 - 16:00', nombreCurso: 'Química I', aula: 'B-201', dia: 'Martes', sucursal: 'Norte' }
  ]);

  const [availableModules, setAvailableModules] = useState([
    { id: 1, hora: '16:00 - 18:00', nombreModulo: 'Matemáticas II', aula: 'A-101', duracion: '2 horas' },
    { id: 2, hora: '18:00 - 20:00', nombreModulo: 'Física II', aula: 'A-102', duracion: '2 horas' },
    { id: 3, hora: '08:00 - 10:00', nombreModulo: 'Programación I', aula: 'C-301', duracion: '2 horas' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Simulación de datos
      const mockTeachers = [
        { id: 1, nombre: 'Juan Pérez', email: 'juan@cba.edu' },
        { id: 2, nombre: 'María García', email: 'maria@cba.edu' },
        { id: 3, nombre: 'Carlos López', email: 'carlos@cba.edu' }
      ];

      const mockBranches = [
        { id: 1, alias: 'Central', ubicacion: 'Av. Principal 123' },
        { id: 2, alias: 'Norte', ubicacion: 'Av. Norte 456' },
        { id: 3, alias: 'Sur', ubicacion: 'Av. Sur 789' }
      ];

      const mockCourses = [
        { id: 1, nombre: 'Matemáticas' },
        { id: 2, nombre: 'Física' },
        { id: 3, nombre: 'Química' },
        { id: 4, nombre: 'Programación' }
      ];

      setTeachers(mockTeachers);
      setBranches(mockBranches);
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacher(teacherId);
    // Aquí cargarías los horarios del docente seleccionado
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleApplyFilter = () => {
    console.log('Aplicando filtro:', {
      teacher: selectedTeacher,
      branch: selectedBranch,
      course: selectedCourse
    });
    // Aquí aplicarías el filtro a los módulos disponibles
  };

  const handleAssignModule = (moduleId) => {
    console.log('Asignando módulo:', moduleId);
    alert(`Módulo ${moduleId} asignado al docente`);
  };

  const handleAcceptSchedule = () => {
    alert('Horario aceptado exitosamente');
    navigate('/schedules');
  };

  return (
    <div className="edit-horarios-page">
      <div className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-placeholder">CBA</div>
          </div>
          <div className="title-section">
            <h1 className="main-title">CBA Personnel System</h1>
            <p className="main-subtitle">Asignación de Horarios</p>
          </div>
        </div>
      </div>

      <main className="edit-horarios-main">
        <div className="layout-container">
          {/* Área Central Principal */}
          <div className="main-content">
            <div className="content-header">
              <h2 className="section-title">Asignación de Horarios</h2>
            </div>

            {/* Título del Horario */}
            <div className="teacher-schedule-header">
              <h3>Horario del docente: {selectedTeacher ? teachers.find(t => t.id == selectedTeacher)?.nombre : '[Nombre del Docente]'}</h3>
            </div>

            {/* Sección: Horarios Asignados */}
            <div className="card">
              <div className="card-header">
                <h3>Horarios Asignados</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Curso</th>
                      <th>Aula</th>
                      <th>Día</th>
                      <th>Sucursal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherSchedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td>{schedule.hora}</td>
                        <td>{schedule.nombreCurso}</td>
                        <td>{schedule.aula}</td>
                        <td>{schedule.dia}</td>
                        <td>{schedule.sucursal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer">
                <button onClick={handleAcceptSchedule} className="btn-primary">
                  ✅ Aceptar
                </button>
              </div>
            </div>

            {/* Sección: Módulos a Asignar */}
            <div className="card">
              <div className="card-header">
                <h3>Módulos Disponibles para Asignar</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Módulo</th>
                      <th>Aula</th>
                      <th>Duración</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableModules.map((module) => (
                      <tr key={module.id}>
                        <td>{module.hora}</td>
                        <td>{module.nombreModulo}</td>
                        <td>{module.aula}</td>
                        <td>{module.duracion}</td>
                        <td>
                          <button 
                            onClick={() => handleAssignModule(module.id)}
                            className="btn-small"
                          >
                            📅 Asignar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel Lateral Derecho */}
          <div className="sidebar">
            {/* Título Seleccionar Docente */}
            <div className="sidebar-header">
              <h3>Seleccione Docente</h3>
            </div>

            {/* Formulario Docente */}
            <div className="form-card">
              <h4>Datos del Docente</h4>
              <div className="form-group">
                <label>Docente:</label>
                <select
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  className="form-select"
                >
                  <option value="">-- Seleccionar Docente --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Formulario Filtros */}
            <div className="form-card">
              <h4>Filtrar</h4>
              <div className="form-group">
                <label>Sucursal:</label>
                <select
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  className="form-select"
                >
                  <option value="">-- Todas las Sucursales --</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.alias}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Curso:</label>
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="form-select"
                >
                  <option value="">-- Todos los Cursos --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleApplyFilter} className="btn-primary">
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditHorarios;