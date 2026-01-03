import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SkillKey, LabourProfile } from '../types';
import { Button, Card, Input, SkillSelector, LocationPermission, Header } from '../components';
import { t } from '../utils/translations';
import {
  saveLabourProfile,
  saveUserExtendedInfo,
  getLabourProfileByUserId,
} from '../services/dataService';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [selectedSkills, setSelectedSkills] = useState<SkillKey[]>([]);
  const [dailyRate, setDailyRate] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    user?.location || null
  );
  const [locationStatus, setLocationStatus] = useState<'pending' | 'received' | 'skipped'>(
    user?.location ? 'received' : 'pending'
  );
  const [isSaving, setIsSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setLocation(user.location);

      if (user.role === 'labour') {
        const profile = getLabourProfileByUserId(user.id);
        if (profile) {
          setSelectedSkills(profile.skills);
          setDailyRate(profile.dailyRate.toString());
        }
      }
    }
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
    setLocation({ lat: 28.6139, lng: 77.2090 });
    setLocationStatus('skipped');
  };

  const handleSave = () => {
    if (!user || !name.trim()) return;

    // Additional validation for labour
    if (user.role === 'labour' && (!selectedSkills.length || !dailyRate)) return;

    setIsSaving(true);

    const finalLocation = location || { lat: 28.6139, lng: 77.2090 };

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
    if (user.role === 'labour' && dailyRate) {
      const labourProfile: LabourProfile = {
        userId: user.id,
        skills: selectedSkills,
        dailyRate: Number(dailyRate),
        available: true,
        updatedAt: new Date().toISOString(),
      };
      saveLabourProfile(labourProfile);
    }

    setTimeout(() => {
      setIsSaving(false);
      alert(language === 'hi' ? 'प्रोफाइल सहेजी गई! ✓' : 'Profile saved! ✓');
      navigate(user.role === 'labour' ? '/labour-home' : '/employer-home');
    }, 500);
  };

  const isValid =
    name.trim() &&
    (user?.role === 'employer' || (selectedSkills.length > 0 && dailyRate));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={language === 'hi' ? 'प्रोफाइल संपादित करें' : 'Edit Profile'}
        showProfile={false}
      />

      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <Card padding="large">
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="text-5xl mb-2">{user?.role === 'labour' ? '👷' : '🧑‍💼'}</div>
                <p className="text-sm text-gray-500">
                  {language === 'hi' ? 'फोन' : 'Phone'}: {user?.phone}
                </p>
                <p className="text-xs text-gray-400">
                  {language === 'hi' ? 'भूमिका' : 'Role'}: {user?.role === 'labour' ? (language === 'hi' ? 'श्रमिक' : 'Labour') : (language === 'hi' ? 'ठेकेदार' : 'Contractor')}
                </p>
              </div>

              {/* Name */}
              <Input
                label={t('yourName', language)}
                value={name}
                onChange={setName}
                placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                required
              />

              {/* Skills and Daily Rate (Labour only) */}
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

              {/* Location */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('location', language)}
                </label>

                {locationStatus === 'received' ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600 text-xl">✓</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium text-green-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {language === 'hi' ? 'स्थान सहेजा गया' : 'Location saved'}
                      </p>
                      <p className="text-xs text-green-700">
                        {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={() => setLocationStatus('pending')}
                      className="text-sm text-primary-600 hover:text-primary-700 underline"
                    >
                      {language === 'hi' ? 'बदलें' : 'Change'}
                    </button>
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
                      {language === 'hi' ? 'डिफ़ॉल्ट स्थान उपयोग करें' : 'Use default location'}
                    </button>
                  </>
                )}
              </div>

              {/* Save Button */}
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  size="large"
                  className="flex-1"
                >
                  {t('cancel', language)}
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="large"
                  disabled={!isValid || isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="animate-spin">⏳</span>
                      <span>{language === 'hi' ? 'सहेज रहे हैं...' : 'Saving...'}</span>
                    </span>
                  ) : (
                    t('save', language)
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
