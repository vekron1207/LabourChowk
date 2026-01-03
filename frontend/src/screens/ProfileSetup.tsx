import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SkillKey, LabourProfile } from '../types';
import { Button, Card, Input, SkillSelector, LocationPermission } from '../components';
import { t } from '../utils/translations';
import { saveLabourProfile, saveUserExtendedInfo } from '../services/dataService';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<SkillKey[]>([]);
  const [dailyRate, setDailyRate] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'received' | 'skipped'>('pending');

  // Debug: Log user role when component mounts
  React.useEffect(() => {
    console.log('ProfileSetup: User role =', user?.role);
  }, [user]);

  const handleSkillToggle = (skill: SkillKey) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleLocationReceived = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setLocationStatus('received');
  };

  const handleSkipLocation = () => {
    // Use default location (Delhi center as fallback)
    setLocation({ lat: 28.6139, lng: 77.2090 });
    setLocationStatus('skipped');
  };

  const handleSubmit = () => {
    const finalLocation = location || { lat: 28.6139, lng: 77.2090 };

    if (name && user) {
      // For labour, require skills and daily rate
      if (user.role === 'labour' && (!selectedSkills.length || !dailyRate)) return;

      // Update user in AuthContext
      updateUser({
        name,
        location: finalLocation,
      });

      // Save user extended info to localStorage
      saveUserExtendedInfo(user.id, {
        name,
        phone: user.phone,
        location: finalLocation,
      });

      // If labour, save labour profile
      if (user.role === 'labour') {
        const labourProfile: LabourProfile = {
          userId: user.id,
          skills: selectedSkills,
          dailyRate: Number(dailyRate),
          available: true,
          updatedAt: new Date().toISOString(),
        };
        saveLabourProfile(labourProfile);
      }

      // Navigate to home screen
      navigate(user.role === 'labour' ? '/labour-home' : '/employer-home');
    }
  };

  const isValid =
    name.trim() &&
    (user?.role === 'employer' || (selectedSkills.length > 0 && dailyRate));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-8">
        <Card padding="large">
          <h1 className={`text-2xl font-bold text-gray-900 mb-6 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('createProfile', language)}
          </h1>

          <div className="space-y-6">
            <Input
              label={t('yourName', language)}
              value={name}
              onChange={setName}
              placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
              required
            />

            {user?.role === 'labour' && (
              <>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('selectSkills', language)} <span className="text-red-500">*</span>
                  </label>
                  <SkillSelector
                    selectedSkills={selectedSkills}
                    onToggle={handleSkillToggle}
                    language={language}
                  />
                </div>

                <Input
                  label={t('dailyRate', language)}
                  value={dailyRate}
                  onChange={setDailyRate}
                  type="number"
                  placeholder="500"
                  required
                />
              </>
            )}

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('location', language)} <span className="text-red-500">*</span>
              </label>

              {locationStatus === 'received' ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-600 text-xl">✓</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-green-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {language === 'hi' ? 'स्थान प्राप्त हो गई' : 'Location received'}
                    </p>
                    <p className="text-xs text-green-700">
                      {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : locationStatus === 'skipped' ? (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                  <p className={`text-sm text-yellow-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {language === 'hi'
                      ? 'डिफ़ॉल्ट स्थान का उपयोग किया जाएगा'
                      : 'Using default location'}
                  </p>
                </div>
              ) : (
                <>
                  <LocationPermission
                    onLocationReceived={handleLocationReceived}
                    language={language}
                  />
                  <button
                    onClick={handleSkipLocation}
                    className={`mt-2 text-sm text-gray-600 hover:text-gray-900 underline ${language === 'hi' ? 'font-hindi' : ''}`}
                  >
                    {language === 'hi' ? 'अभी के लिए छोड़ें' : 'Skip for now'}
                  </button>
                </>
              )}
            </div>

            <Button onClick={handleSubmit} fullWidth size="large" disabled={!isValid}>
              {t('continue', language)}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
