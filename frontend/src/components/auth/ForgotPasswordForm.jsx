import React, { useState } from 'react';
import { Mail, Lock, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validation';
import Alert from '../common/Alert';
import Input from '../common/Input';
import Button from '../common/Button';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';

export default function ForgotPasswordForm({ onSuccess, onBack }) {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
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

  const handleSendOTP = async () => {
    setAlert(null);
    
    const emailError = validators.email(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(formData.email);
      setAlert({ type: 'success', message: 'OTP sent to your email!' });
      setTimeout(() => setStep(2), 1500);
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('not in db') || errorMessage.includes('not found')) {
        setErrors({ email: 'No account found with this email' });
        errorMessage = 'No account found with this email address';
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setAlert(null);

    const otpError = validators.otp(formData.otp);
    const passwordError = validators.password(formData.newPassword);
    
    const newErrors = {};
    if (otpError) newErrors.otp = otpError;
    if (passwordError) newErrors.newPassword = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ otp: true, newPassword: true });
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword);
      setAlert({ type: 'success', message: 'Password reset successfully!' });
      setTimeout(() => onSuccess(), 2000);
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('token you entered is wrong') || 
          errorMessage.includes('invalid')) {
        setErrors({ otp: 'Invalid OTP code' });
        errorMessage = 'The OTP code you entered is incorrect';
      } else if (errorMessage.includes('expired')) {
        errorMessage = 'This OTP code has expired. Please request a new one.';
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
          <Key className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="text-gray-600 text-sm mt-1">
          {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
        </p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="space-y-4 mt-4">
        {step === 1 ? (
          <>
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
            <Button loading={loading} onClick={handleSendOTP} fullWidth>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <Input
              name="otp"
              label="OTP Code"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, otp: value }));
              }}
              onBlur={handleBlur}
              error={touched.otp && errors.otp}
              maxLength={6}
              required
            />
            <div className="space-y-2">
              <Input
                icon={Lock}
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && errors.newPassword}
                required
              />
              <PasswordStrengthMeter password={formData.newPassword} />
            </div>
            <Button loading={loading} onClick={handleResetPassword} fullWidth>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </>
        )}

        <Button variant="outline" onClick={onBack} fullWidth>
          Back to Login
        </Button>
      </div>
    </div>
  );
}