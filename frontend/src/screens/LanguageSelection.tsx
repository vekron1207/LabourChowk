import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { LANGUAGES } from '../utils/constants';
import { Button, Card } from '../components';

export const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="large">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Labour Chowk</h1>
          <h2 className="text-2xl font-bold text-gray-900 font-hindi mb-4">लेबर चौक</h2>
          <p className="text-gray-600">Select your preferred language</p>
          <p className="text-gray-600 font-hindi">अपनी भाषा चुनें</p>
        </div>

        <div className="space-y-3">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <Button
              key={code}
              onClick={() => handleLanguageSelect(code as Language)}
              variant="outline"
              size="large"
              fullWidth
              className={code === 'hi' ? 'font-hindi' : ''}
            >
              <span className="text-xl">{name}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
