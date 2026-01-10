import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input } from '../components';
import { t } from '../utils/translations';
import { UserRole } from '../types';
import { logger } from '../utils/logger';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { register } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get role from localStorage (set in RoleSelection screen)
  const selectedRole = (localStorage.getItem('selectedRole') as UserRole) || 'labour';

  const handleRegister = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(phone, password, selectedRole, language);
      localStorage.removeItem('selectedRole'); // Clean up
      navigate('/profile-setup');
    } catch (err: any) {
      logger.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="large">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('register', language)}
          </h1>
          <p className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t(selectedRole === 'labour' ? 'labour' : 'employer', language)}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={t('enterPhone', language)}
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            required
          />

          <div className="relative">
            <Input
              label={t('password', language)}
              value={password}
              onChange={setPassword}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('enterPassword', language)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <Input
            label={language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
            value={confirmPassword}
            onChange={setConfirmPassword}
            type={showPassword ? 'text' : 'password'}
            placeholder={language === 'hi' ? 'पासवर्ड फिर से दर्ज करें' : 'Re-enter your password'}
            required
          />

          <Button
            onClick={handleRegister}
            fullWidth
            size="large"
            disabled={
              phone.length !== 10 ||
              password.length < 6 ||
              confirmPassword.length < 6 ||
              loading
            }
          >
            {loading ? (language === 'hi' ? 'रजिस्टर हो रहा है...' : 'Registering...') : t('register', language)}
          </Button>

          <div className="text-center mt-4">
            <span className={`text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
              {language === 'hi' ? 'पहले से खाता है?' : 'Already have account?'}{' '}
            </span>
            <button
              onClick={handleLogin}
              className={`text-primary-600 hover:text-primary-700 font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}
              disabled={loading}
            >
              {t('login', language)}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
