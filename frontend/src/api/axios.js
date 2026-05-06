import axios from 'axios';

const api = axios.create({
  baseURL: 'https://teamorbit-production.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orbit_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('orbit_token');
      localStorage.removeItem('orbit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
