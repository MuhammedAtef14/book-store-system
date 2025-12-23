import React, { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validation';
import Alert from '../common/Alert';
import Input from '../common/Input';
import Button from '../common/Button';
import RoleSelector from '../common/RoleSelector';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';

export default function SignupForm({ onSuccess }) {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: '',
    phone: '',
    userRole: 'CUSTOMER',
  });

  const validateField = (name, value) => {
    if (name === 'passwordConfirmation') {
      return validators.passwordConfirmation(value, formData.password);
    }
    return validators[name] ? validators[name](value) : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    if (name === 'password' && touched.passwordConfirmation) {
      const confirmError = validators.passwordConfirmation(
        formData.passwordConfirmation, 
        value
      );
      setErrors(prev => ({ ...prev, passwordConfirmation: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, userRole: role }));
    setTouched(prev => ({ ...prev, userRole: true }));
    const error = validators.userRole(role);
    setErrors(prev => ({ ...prev, userRole: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['username', 'email', 'password', 'passwordConfirmation', 'firstName', 'lastName', 'phone', 'userRole'];
    
    requiredFields.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      setAlert({ 
        type: 'error', 
        message: 'Please fix all validation errors before submitting' 
      });
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      setAlert({ 
        type: 'success', 
        message: 'Account created! Check your email for verification code.' 
      });
      setTimeout(() => onSuccess && onSuccess(formData.email), 2000);
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('email is already registered') || 
          errorMessage.includes('email is already registerd')) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (errorMessage.includes('confirmation password does not match')) {
        setErrors(prev => ({ 
          ...prev, 
          passwordConfirmation: 'Passwords do not match' 
        }));
        errorMessage = 'Password confirmation does not match';
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-gray-600 text-sm mt-1">Join our bookstore community</p>
      </div>
      
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="space-y-4 mt-4">
        <RoleSelector 
          selectedRole={formData.userRole}
          onRoleChange={handleRoleChange}
          error={touched.userRole && errors.userRole}
        />

        <Input
          icon={User}
          name="username"
          label="Username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.username && errors.username}
          required
        />
        
        <Input
          icon={Mail}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First Name"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && errors.firstName}
            required
          />
          <Input
            name="lastName"
            label="Last Name"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && errors.lastName}
            required
          />
        </div>

        <Input
          icon={Phone}
          name="phone"
          label="Phone Number"
          placeholder="01XXXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone && errors.phone}
          required
        />

        <div className="space-y-2">
          <Input
            icon={Lock}
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            required
          />
          <PasswordStrengthMeter password={formData.password} />
        </div>

        <Input
          icon={Lock}
          name="passwordConfirmation"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formData.passwordConfirmation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.passwordConfirmation && errors.passwordConfirmation}
          required
        />

        <div className="pt-2">
          <Button loading={loading} onClick={handleSubmit} fullWidth>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}