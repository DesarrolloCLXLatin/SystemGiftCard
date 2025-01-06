import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
  try {
    console.log("Sending data:", userData);  // Añade este logging
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    localStorage.setItem('token', response.data.token); // Almacenar el token al iniciar sesión
    return response.data;
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (emailData) => {
  try {
    const response = await axios.post(`${API_URL}/forgot_password`, emailData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset_password/${token}`, { newPassword }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkUsername = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/check_username`, { username }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/current_user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Asegúrate de tener un token de autenticación
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  register,
  login,
  forgotPassword,
  resetPassword,
  checkUsername,
  getCurrentUser,
};

export default authService;