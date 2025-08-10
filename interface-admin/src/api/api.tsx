import axios from 'axios';

const API_PORT = process.env.REACT_APP_API_PORT || '3002';
const getBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  if (isLocalhost) {
    return `http://localhost:${API_PORT}`;
  }
  return `http:// 172.20.10.1:${API_PORT}`;
};
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur Axios:', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response ? error.response.data : null,
    });
    return Promise.reject(error);
  }
);

export default api;