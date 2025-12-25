import React, { useState } from 'react';
import { apiCall } from '../api/api';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const VerifyEmailPage = ({ email, onVerified, onBackToLogin }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!token.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiCall('/auth/verify-user', {
        method: 'POST',
        body: JSON.stringify({ token: token.trim() })
      });

      setSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      // You'll need to add a resend endpoint in your backend
      await apiCall('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      alert('Verification code resent to your email!');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
          <p className="text-gray-600">Your account has been successfully verified.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a verification code to
          </p>
          <p className="text-indigo-600 font-semibold mt-1">{email}</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <div className="text-center space-y-3">
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm disabled:opacity-50"
            >
              Didn't receive the code? Resend
            </button>

            <div>
              <button
                onClick={onBackToLogin}
                className="text-gray-600 hover:text-gray-700 font-medium text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;