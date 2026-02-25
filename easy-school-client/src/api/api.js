import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),

  getAdminUsers: () => axios.get(`${API_BASE}/admin/users`, { headers: authHeader() }),
  updateAdminUser: (id, updates) => axios.put(`${API_BASE}/admin/users/${id}`, updates, { headers: authHeader() }),
  deleteAdminUser: (id) => axios.delete(`${API_BASE}/admin/users/${id}`, { headers: authHeader() }),

  getSets: () => axios.get(`${API_BASE}/sets`, { headers: authHeader() }),
  getPublicSets: () => axios.get(`${API_BASE}/sets/public`, { headers: authHeader() }),
  createSet: (set) => axios.post(`${API_BASE}/sets`, set, { headers: authHeader() }),
  updateSet: (id, updates) => axios.put(`${API_BASE}/sets/${id}`, updates, { headers: authHeader() }),
  deleteSet: (id) => axios.delete(`${API_BASE}/sets/${id}`, { headers: authHeader() })
};
