import { api } from './api';

export const authService = {
  async signup(signupData) {
    const response = await api.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }

    return await response.text();
  },

  async login(email, password) {
    const response = await api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    api.setToken(data.accessToken);
    return data;
  },

  async verifyEmail(token) {
    const response = await api.request('/auth/verify-user', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Verification failed');
    }

    return await response.text();
  },

  async forgotPassword(email) {
    const response = await api.request('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    return await response.json();
  },

  async resetPassword(email, otp, newPassword) {
    const response = await api.request('/auth/checkforgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email, OTP: otp, newPassword }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Password reset failed');
    }

    return await response.text();
  },

  async getCurrentUser() {
    const response = await api.request('/auth/me');
    if (response.ok) {
      return await response.text();
    }
    return null;
  },

  async logout(userId) {
    try {
      await api.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } finally {
      api.clearToken();
    }
  }
};