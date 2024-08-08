import axios from '../axios'; // Asegúrate de importar la instancia configurada

export const authService = {
  // Función para manejar el login con email y contraseña
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

  // Función para manejar el login con Google
  async loginWithGoogle(googleToken) {
    try {
      const response = await axios.post('/auth/login/google', { token: googleToken });
      const token = response.data; // `response.data` es el token directamente
      if (token) {
        localStorage.setItem('token', token); // Guarda el token en el localStorage
        return { token }; // Opcionalmente, devuelve un objeto con el token
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Google login error:', error); // Añade más detalles del error
      throw new Error(error.response?.data || 'Google login failed');
    }
  },

  // Función para manejar el logout
  logout() {
    localStorage.removeItem('token');
  },

  // Función para obtener el token del localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Función para obtener usuarios
  async getUsers() {
    try {
      const response = await axios.get('/users');
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

  // Función para actualizar un usuario
  async updateUser(userData) {
    try {
      const response = await axios.put(`/users/${userData.id}`, userData);
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

// Función para registrar un usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
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
