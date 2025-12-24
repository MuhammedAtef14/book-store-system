// API Configuration and Token Management
let accessToken = null;

export const api = {
  baseURL: 'http://localhost:8080',
  
  setToken: (token) => {
    accessToken = token;
  },
  
  getToken: () => accessToken,
  
  clearToken: () => {
    accessToken = null;
  },
  
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: 'include',
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    // Auto-refresh token on 401
    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return fetch(`${this.baseURL}${endpoint}`, config);
      }
    }
    
    return response;
  },
  
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setToken(data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
};