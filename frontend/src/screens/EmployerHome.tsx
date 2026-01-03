import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SkillKey } from '../types';
import { Card, Button, DistanceSlider, Header } from '../components';
import { t } from '../utils/translations';
import { SKILLS } from '../utils/constants';
import { calculateDistance, formatDistance } from '../utils/location';
import { getAvailableLabourWithUserDetails } from '../services/dataService';

export const EmployerHome: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<SkillKey | 'all'>('all');
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [labourData, setLabourData] = useState<any[]>([]);

  // Load labour data from localStorage with real-time updates
  useEffect(() => {
    const loadLabour = () => {
      const availableLabour = getAvailableLabourWithUserDetails();
      setLabourData(availableLabour);
    };

    loadLabour();

    // Reload when window gets focus (in case new labour registered)
    const handleFocus = () => loadLabour();
    window.addEventListener('focus', handleFocus);

    // Auto-refresh labour list every 3 seconds
    const intervalId = setInterval(loadLabour, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  // Calculate distance and filter labour
  const nearbyLabour = labourData
    .map((labour) => ({
      ...labour,
      distance: user?.location
        ? calculateDistance(user.location, labour.location)
        : 0,
    }))
    .filter((labour) => {
      // Filter by distance
      if (labour.distance > maxDistance) return false;
      // Filter by skill
      if (selectedSkillFilter === 'all') return true;
      return labour.skills.includes(selectedSkillFilter);
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance

  const getSkillName = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill ? (language === 'hi' ? skill.nameHi : skill.nameEn) : skillKey;
  };

  const getSkillIcon = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill?.icon || '🔧';
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={`${language === 'hi' ? 'नमस्ते' : 'Hello'}, ${user?.name || (language === 'hi' ? 'ठेकेदार' : 'Contractor')}!`}
      />

      {/* Action Buttons */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => navigate('/post-job')}
            variant="primary"
            size="large"
          >
            <span className={language === 'hi' ? 'font-hindi' : ''}>
              + {t('postJob', language)}
            </span>
          </Button>
          <Button
            onClick={() => navigate('/job-dashboard')}
            variant="outline"
            size="large"
          >
            <span className={language === 'hi' ? 'font-hindi' : ''}>
              📋 {language === 'hi' ? 'मेरे काम' : 'My Jobs'}
            </span>
          </Button>
        </div>

        {/* Distance Slider */}
        <Card padding="medium" className="mb-4">
          <DistanceSlider
            distance={maxDistance}
            onChange={setMaxDistance}
            language={language}
            min={1}
            max={50}
          />
        </Card>

        {/* Skill Filter */}
        <Card padding="medium" className="mb-4">
          <h3 className={`text-sm font-semibold text-gray-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('filterBySkill', language)}
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSkillFilter('all')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${
                  selectedSkillFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
                ${language === 'hi' ? 'font-hindi' : ''}
              `}
            >
              {language === 'hi' ? 'सभी' : 'All'}
            </button>
            {SKILLS.map((skill) => (
              <button
                key={skill.key}
                onClick={() => setSelectedSkillFilter(skill.key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
                  ${
                    selectedSkillFilter === skill.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                  ${language === 'hi' ? 'font-hindi' : ''}
                `}
              >
                <span>{skill.icon}</span>
                <span>{language === 'hi' ? skill.nameHi : skill.nameEn}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Labour List */}
        <h2 className={`text-lg font-bold text-gray-900 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
          {t('nearbyLabour', language)} ({nearbyLabour.length})
        </h2>

        <div className="space-y-3">
          {nearbyLabour.length === 0 ? (
            <Card padding="large">
              <div className="text-center text-gray-500">
                <div className="text-5xl mb-3">🔍</div>
                <p className={language === 'hi' ? 'font-hindi' : ''}>
                  {language === 'hi'
                    ? `${maxDistance} किमी के दायरे में कोई मजदूर उपलब्ध नहीं है`
                    : `No labour available within ${maxDistance} km`}
                </p>
                <p className={`text-sm mt-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'hi'
                    ? 'दूरी बढ़ाकर देखें या फ़िल्टर बदलें'
                    : 'Try increasing distance or changing filters'}
                </p>
              </div>
            </Card>
          ) : (
            nearbyLabour.map((labour) => (
              <Card key={labour.id} padding="medium" hover>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                      👷
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`text-lg font-bold text-gray-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                          {labour.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          📍 {formatDistance(labour.distance, language)} {t('away', language)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {t('available', language)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {labour.skills.map((skillKey: SkillKey) => (
                        <span
                          key={skillKey}
                          className={`
                            inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm
                            ${language === 'hi' ? 'font-hindi' : ''}
                          `}
                        >
                          <span>{getSkillIcon(skillKey)}</span>
                          <span>{getSkillName(skillKey)}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary-600">
                        ₹{labour.dailyRate}
                        <span className={`text-sm text-gray-500 font-normal ml-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                          / {t('perDay', language)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleCall(labour.phone)}
                        variant="primary"
                        size="small"
                      >
                        <span className="flex items-center gap-2">
                          <span>📞</span>
                          <span className={language === 'hi' ? 'font-hindi' : ''}>
                            {t('callNow', language)}
                          </span>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
