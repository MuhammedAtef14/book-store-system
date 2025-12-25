import React from 'react';
import { AuthProvider } from './auth/AuthContext';
import App from './App';

const Root = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default Root;