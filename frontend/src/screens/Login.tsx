import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input } from '../components';
import { t } from '../utils/translations';
import { logger } from '../utils/logger';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(phone, password);
      navigate('/profile-setup');
    } catch (err: any) {
      logger.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="large">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('loginWithPhone', language)}
          </h1>
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

          <Button
            onClick={handleLogin}
            fullWidth
            size="large"
            disabled={phone.length !== 10 || password.length < 6 || loading}
          >
            {loading ? 'Logging in...' : t('login', language)}
          </Button>

          <div className="text-center mt-4">
            <span className={`text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
              {t('newUser', language)}{' '}
            </span>
            <button
              onClick={handleRegister}
              className={`text-primary-600 hover:text-primary-700 font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}
              disabled={loading}
            >
              {t('register', language)}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
