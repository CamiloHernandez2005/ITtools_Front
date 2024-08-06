import axios from 'axios';

// Configurar Axios
axios.defaults.baseURL = 'http://localhost:8080'; // Cambia según tu baseURL

// Interceptor de solicitud para incluir el token JWT
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Obtener el token JWT desde localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
