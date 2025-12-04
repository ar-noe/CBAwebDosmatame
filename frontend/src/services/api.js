// src/services/api.js
/*import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funciones específicas para cada tabla
export const personaApi = {
  getAll: () => api.get('/personas'),
  getById: (id) => api.get(`/personas/${id}`),
  create: (data) => api.post('/personas', data),
  update: (id, data) => api.put(`/personas/${id}`, data),
  delete: (id) => api.delete(`/personas/${id}`),
};

export const usuarioApi = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  getByRol: (rolId) => api.get(`/usuarios/rol/${rolId}`),
  login: (credentials) => api.post('/usuarios/login', credentials),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
};

export const moduloImpartidoApi = {
  getAll: () => api.get('/modulos-impartidos'),
  getById: (id) => api.get(`/modulos-impartidos/${id}`),
  getByDocente: (docenteId) => api.get(`/modulos-impartidos/docente/${docenteId}`),
  create: (data) => api.post('/modulos-impartidos', data),
  update: (id, data) => api.put(`/modulos-impartidos/${id}`, data),
  delete: (id) => api.delete(`/modulos-impartidos/${id}`),
};

export const aulaApi = {
  getAll: () => api.get('/aulas'),
  getById: (id) => api.get(`/aulas/${id}`),
  getBySucursal: (sucursalId) => api.get(`/aulas/sucursal/${sucursalId}`),
  create: (data) => api.post('/aulas', data),
  update: (id, data) => api.put(`/aulas/${id}`, data),
  updateEstado: (id, estadoId) => api.put(`/aulas/${id}/estado`, { estado_aula_id: estadoId }),
};

export const horarioApi = {
  getAll: () => api.get('/horarios'),
  getById: (id) => api.get(`/horarios/${id}`),
  create: (data) => api.post('/horarios', data),
};

export const bimestreApi = {
  getAll: () => api.get('/bimestres'),
  getCurrent: () => api.get('/bimestres/current'),
};

export const sucursalApi = {
  getAll: () => api.get('/sucursals'),
};

export const estadoAulaApi = {
  getAll: () => api.get('/estado-aulas'),
};

export default api;*/