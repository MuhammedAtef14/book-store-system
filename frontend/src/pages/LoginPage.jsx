import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { Book, AlertCircle, Mail, KeyRound } from 'lucide-react';

const LoginPage = ({ onSwitchToSignup, onNeedVerification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [OTP, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();

  // 🔹 Login
  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);

      if (
        errorMessage.includes('not been verified') ||
        errorMessage.includes('verified')
      ) {
        setTimeout(() => {
          onNeedVerification(email);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send OTP
  const handleSendOtp = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send OTP');

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP + reset password
  const handleResetPassword = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/auth/checkforgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OTP,
          email,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error('Invalid OTP');

      setSuccessMsg('Password changed successfully. You can login now.');
      setTimeout(() => {
        setShowForgot(false);
        setStep(1);
        setOtp('');
        setNewPassword('');
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Book className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Bookstore</h1>
          <p className="text-gray-600 mt-2">
            {showForgot ? 'Reset your password' : 'Sign in to your account'}
          </p>
        </div>

        {(error || successMsg) && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg flex gap-2 ${
              error
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p>{error || successMsg}</p>
          </div>
        )}

        {!showForgot ? (
          <>
            {/* 🔹 LOGIN FORM */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                onClick={() => setShowForgot(true)}
                className="text-sm text-indigo-600 hover:underline w-full text-center"
              >
                Forgot password?
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToSignup}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 🔹 FORGOT PASSWORD */}
            {step === 1 ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                
                <input
                  placeholder="OTP"
                  value={OTP}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg mb-3"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                />
                <input
                  type="password"
                  placeholder="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                />
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setStep(1);
                setError('');
              }}
              className="mt-4 text-sm text-gray-600 hover:underline w-full"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
