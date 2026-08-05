import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('kisaan_token');
    
    if (!token) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      return;
    }

    try {
      const currentUser = await api.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('kisaan_token');
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = (token) => {
    localStorage.setItem('kisaan_token', token);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('kisaan_token');
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      authChecked,
      login,
      logout,
      navigateToLogin,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};