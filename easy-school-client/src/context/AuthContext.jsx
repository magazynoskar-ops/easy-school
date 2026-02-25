import React, { createContext, useState } from 'react';
import { api } from '../api/api.js';

const AuthContext = createContext();

function readStoredUser() {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  if (!token || !userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

function persistAuth(token, user, setUser) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    const { token, user: backendUser } = res.data;
    persistAuth(token, backendUser, setUser);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.register({ username, email, password });
    const { token, user: backendUser } = res.data;
    persistAuth(token, backendUser, setUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
