import React, { createContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const userObj = {
          email: userData.email,
          userId: userData.userId,
          role: userData.userRole
        };
        setUser(userObj);
        // Store user data in localStorage for easy access
        localStorage.setItem('user', JSON.stringify(userObj));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    const newToken = data.accessToken;
    
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
    
    // Fetch user info after setting token
    await fetchUserInfoWithToken(newToken);
    
    return data;
  };

  const fetchUserInfoWithToken = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const userObj = {
          email: userData.email,
          userId: userData.userId,
          role: userData.userRole
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const signup = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }

    return await response.text();
  };

  const logout = async () => {
    if (user?.userId) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.userId })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};