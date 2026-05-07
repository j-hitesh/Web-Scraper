import { createContext, useContext, useState } from 'react';

import { authAPI } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persistSession = (session) => {
    localStorage.setItem('token', session.token);
    localStorage.setItem('user', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const register = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(email, password);
      persistSession(response.data);
      return response.data;
    } catch (apiError) {
      const message = apiError.response?.data?.error || 'Registration failed';
      setError(message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(email, password);
      persistSession(response.data);
      return response.data;
    } catch (apiError) {
      const message = apiError.response?.data?.error || 'Login failed';
      setError(message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    error,
    isAuthenticated: Boolean(token),
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
