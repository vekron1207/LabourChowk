import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input } from '../components';
import { t } from '../utils/translations';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      // Get the role from localStorage (set in RoleSelection)
      const selectedRole = (localStorage.getItem('selectedRole') as 'labour' | 'employer') || 'labour';

      console.log('Login: Selected role =', selectedRole);

      // Clear the temporary role from localStorage
      localStorage.removeItem('selectedRole');

      const mockUser = {
        id: 'user_' + Date.now(),
        phone,
        role: selectedRole,
        name: '',
        language,
        location: { lat: 0, lng: 0 },
        createdAt: new Date().toISOString(),
      };

      console.log('Login: Creating user with role =', mockUser.role);
      login(mockUser);
      navigate('/profile-setup');
    }
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

        {step === 'phone' ? (
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
            <Button onClick={handleSendOTP} fullWidth size="large" disabled={phone.length !== 10}>
              {t('sendOTP', language)}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`text-sm text-gray-600 mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
              OTP sent to +91 {phone}
            </div>
            <Input
              label={t('enterOTP', language)}
              value={otp}
              onChange={setOtp}
              type="number"
              placeholder="123456"
              maxLength={6}
              required
            />
            <Button onClick={handleVerifyOTP} fullWidth size="large" disabled={otp.length !== 6}>
              {t('verify', language)}
            </Button>
            <Button onClick={() => setStep('phone')} fullWidth size="medium" variant="outline">
              {t('back', language)}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
