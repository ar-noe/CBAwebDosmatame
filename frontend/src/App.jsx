// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';

// Importar páginas
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Common/Dashboard';
import DocenteDashboard from './pages/Docente/DocenteDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Importar componentes protegidos
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rutas para docente */}
              <Route path="/docente" element={
                <RoleBasedRoute allowedRoles={['docente']}>
                  <DocenteDashboard />
                </RoleBasedRoute>
              } />
              
              {/* Rutas para administrativo */}
              <Route path="/admin" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              } />
            </Route>
          </Route>
          
          {/* Ruta por defecto (si no está autenticado) */}
          <Route path="/" element={<Navigate to="/signup" />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>404 - Página no encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;