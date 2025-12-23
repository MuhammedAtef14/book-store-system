import React, { useState } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validation';
import Alert from '../common/Alert';
import Input from '../common/Input';
import Button from '../common/Button';

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validators[name] ? validators[name](value) : '';
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validators[name] ? validators[name](value) : '';
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setAlert(null);

    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setAlert({ type: 'success', message: 'Login successful!' });
      setTimeout(() => onSuccess(), 1000);
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('not found')) {
        setErrors(prev => ({ ...prev, email: 'Account not found' }));
        errorMessage = 'No account found with this email';
      } else if (errorMessage.includes('Bad Credentials') || 
                 errorMessage.includes('credentials')) {
        setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
        errorMessage = 'Incorrect email or password';
      } else if (errorMessage.includes('not been verified')) {
        errorMessage = 'Please verify your email before logging in';
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-gray-600 text-sm mt-1">Login to your account</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="space-y-4 mt-4">
        <Input
          icon={Mail}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          required
        />

        <Input
          icon={Lock}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          required
        />

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>

        <Button loading={loading} onClick={handleSubmit} fullWidth>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}