import axios from '../axios';

const API_URL = 'http://localhost:8080'; // Asegúrate de que esta URL sea correcta

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const token = response.data; // `response.data` es el token directamente
      if (token) {
        localStorage.setItem('token', token); // Guarda el token en el localStorage
        return { token }; // Opcionalmente, devuelve un objeto con el token
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Login error:', error); // Añade más detalles del error
      throw new Error(error.response?.data || 'Login failed');
    }
  },

  logout() {
    localStorage.removeItem('token');
  },
  getToken() {
    return localStorage.getItem('token');
  },
  async getUsers() {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data || 'Failed to fetch users');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  },
  async updateUser(userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${userData.id}`, userData);
      return response.data; // O el mensaje de éxito del backend
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data || 'Update failed');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  }
};

export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data; // O el mensaje de éxito del backend
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  };