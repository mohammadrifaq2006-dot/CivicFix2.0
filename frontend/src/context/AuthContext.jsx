import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('civicroad_token');
    const savedUser = localStorage.getItem('civicroad_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('civicroad_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, id, fullName, role } = res.data;
    const userData = { id, email, fullName, role };
    localStorage.setItem('civicroad_token', token);
    localStorage.setItem('civicroad_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, id, email, fullName, role } = res.data;
    const userData = { id, email, fullName, role };
    localStorage.setItem('civicroad_token', token);
    localStorage.setItem('civicroad_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('civicroad_token');
    localStorage.removeItem('civicroad_user');
    setUser(null);
  };

  const quickDemoLogin = async (type) => {
    let email = 'citizen.arun@civicroad.ai';
    let password = 'Citizen@123';
    if (type === 'officer') {
      email = 'officer.rahul@civicroad.ai';
      password = 'Officer@123';
    } else if (type === 'admin') {
      email = 'admin@civicroad.ai';
      password = 'Admin@123';
    }
    return await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, loading, login, register, logout, quickDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
