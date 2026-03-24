import React, { createContext, useContext, useState } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token ? { token, role } : null;
  });

  const login = async (username, password) => {
    const data = await apiService.login(username, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setUser({ token: data.token, role: data.role });
      return { success: true, role: data.role };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      admin: 4,
      doctor: 3,
      nurse: 2,
      receptionist: 1,
      billing: 1,
    };
    return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}