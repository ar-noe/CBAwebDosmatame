import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/Layout/AdminLayout';
import DocenteLayout from './components/Layout/DocenteLayout';
import './styles/global.css';

// Importar páginas de Autenticación
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Importar páginas de Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import ClassroomState from './pages/Admin/ClassroomState';
import EditarModulo from './pages/Admin/EditarModulo';
import EditarModuloImpartido from './pages/Admin/EditarModuloImpartido';
import EditHorarios from './pages/Admin/EditHorarios';
import MainClassroom from './pages/Admin/MainClassroom';
import MainModulosImp from './pages/Admin/MainModulosImp';

// Importar páginas de Docente
import DocenteDashboard from './pages/Docente/DocenteDashboard';
import Schedules from './pages/Docente/Schedules';
import DocenteProfile from './pages/Docente/DocenteProfile';

// Importar componentes protegidos
//import ProtectedRoute from './components/Auth/ProtectedRoute';
//import RoleBasedRoute from './components/Auth/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Rutas de Admin */}
         {/* <Route element={<ProtectedRoute />}>*/}
            <Route path="/admin" element={
              /*<RoleBasedRoute allowedRoles={['admin']}>*/
                <AdminLayout />
              /*</RoleBasedRoute>*/
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="classroom/state" element={<ClassroomState />} />
              <Route path="classrooms" element={<MainClassroom />} />
              <Route path="module/edit/:id" element={<EditarModulo />} />
              <Route path="module/edit-impartido/:id" element={<EditarModuloImpartido />} />
              <Route path="modules" element={<MainModulosImp />} />
              <Route path="schedule/edit" element={<EditHorarios />} />
            </Route>
          {/*</Route>*/}

          {/* Rutas de Docente */}
          {/*<Route element={<ProtectedRoute />}>*/}
            <Route path="/docente" element={
              /*<RoleBasedRoute allowedRoles={['docente']}>*/
                <DocenteLayout />
              /*</RoleBasedRoute>*/
            }>
              <Route index element={<DocenteDashboard />} />
              <Route path="dashboard" element={<DocenteDashboard />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="profile" element={<DocenteProfile />} />
            </Route>
          {/*</Route>*/}
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>404 - Página no encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;