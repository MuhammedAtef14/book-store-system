import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const email = await authService.getCurrentUser();
      if (email) {
        setUser({ email });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (signupData) => {
    const response = await authService.signup(signupData);
    return response;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser({ email });
    setIsAuthenticated(true);
    return data;
  };

  const logout = useCallback(async (userId) => {
    try {
      await authService.logout(userId);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      api.clearToken();
    }
  }, []);

  const verifyEmail = async (token) => {
    const response = await authService.verifyEmail(token);
    return response;
  };

  const forgotPassword = async (email) => {
    const response = await authService.forgotPassword(email);
    return response;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const response = await authService.resetPassword(email, otp, newPassword);
    return response;
  };

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}