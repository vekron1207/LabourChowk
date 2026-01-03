import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';
import { Card, LanguageToggle } from '../components';
import { t } from '../utils/translations';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleRoleSelect = (role: UserRole) => {
    // Store selected role in localStorage temporarily
    localStorage.setItem('selectedRole', role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex justify-end mb-6">
          <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        <Card padding="large">
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
              {t('selectRole', language)}
            </h1>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('labour')}
              className="w-full p-6 rounded-lg border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">👷</div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold text-gray-900 mb-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('labour', language)}
                  </h3>
                  <p className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('lookingForWork', language)}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('employer')}
              className="w-full p-6 rounded-lg border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">🧑‍💼</div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold text-gray-900 mb-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('employer', language)}
                  </h3>
                  <p className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('lookingToHire', language)}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
