import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validation';
import Alert from '../common/Alert';
import Input from '../common/Input';
import Button from '../common/Button';

export default function EmailVerification({ email, onSuccess, onResend }) {
  const { verifyEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setAlert(null);
    setError('');

    const validationError = validators.otp(otp);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(otp);
      setAlert({ type: 'success', message: 'Email verified successfully!' });
      setTimeout(() => onSuccess(), 2000);
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('token entered is wrong') || 
          errorMessage.includes('invalid')) {
        setError('Invalid OTP code');
        errorMessage = 'The OTP code you entered is incorrect';
      } else if (errorMessage.includes('expired')) {
        errorMessage = 'This OTP code has expired. Please request a new one.';
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">Enter the 6-digit code sent to</p>
        <p className="font-semibold text-blue-600">{email}</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="space-y-4 mt-4">
        <Input
          name="otp"
          label="Verification Code"
          placeholder="000000"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          error={error}
          required
        />

        <Button loading={loading} onClick={handleSubmit} fullWidth>
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <button
          type="button"
          onClick={onResend}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
}