import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ role: 'guest' }); // Default role is 'guest'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser({ role: 'guest' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({ role: 'guest' });
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // Almacenar el token al iniciar sesión
  };

  const logout = () => {
    setUser({ role: 'guest' });
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Eliminar el token al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
