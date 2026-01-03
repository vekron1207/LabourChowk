import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SkillKey, Job } from '../types';
import { Card, Button, Input, SkillSelector } from '../components';
import { t } from '../utils/translations';
import { saveJob } from '../services/dataService';

export const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<SkillKey[]>([]);
  const [rateOffered, setRateOffered] = useState('');
  const [duration, setDuration] = useState('1');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skill: SkillKey) => {
    // For jobs, only allow single skill selection
    setSelectedSkill([skill]);
  };

  const handleSubmit = () => {
    if (selectedSkill.length > 0 && rateOffered && user) {
      setIsSubmitting(true);

      const newJob: Job = {
        id: 'job_' + Date.now(),
        postedBy: user.id,
        skill: selectedSkill[0],
        rate: Number(rateOffered),
        location: user.location || { lat: 28.6139, lng: 77.2090 },
        status: 'open',
        duration: Number(duration),
        createdAt: new Date().toISOString(),
        description: description.trim() || undefined,
      };

      // Save to localStorage
      saveJob(newJob);

      // Show success message
      setTimeout(() => {
        setIsSubmitting(false);
        alert(language === 'hi' ? 'काम पोस्ट किया गया! ✓' : 'Job posted successfully! ✓');
        navigate('/employer-home');
      }, 500);
    }
  };

  const isValid = selectedSkill.length > 0 && rateOffered;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-2 text-white hover:text-primary-100"
        >
          ← {t('back', language)}
        </button>
        <h1 className={`text-2xl font-bold ${language === 'hi' ? 'font-hindi' : ''}`}>
          {t('postJob', language)}
        </h1>
      </div>

      <div className="p-4">
        <Card padding="large">
          <div className="space-y-6">
            {/* Required Skill */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('requiredSkill', language)} <span className="text-red-500">*</span>
              </label>
              <SkillSelector
                selectedSkills={selectedSkill}
                onToggle={handleSkillToggle}
                language={language}
                multiple={false}
              />
            </div>

            {/* Rate Offered */}
            <Input
              label={t('rateOffered', language)}
              value={rateOffered}
              onChange={setRateOffered}
              type="number"
              placeholder="700"
              required
            />

            {/* Duration */}
            <Input
              label={t('duration', language)}
              value={duration}
              onChange={setDuration}
              type="number"
              placeholder="1"
              required
            />

            {/* Job Description (Optional) */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('jobDescription', language)}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'काम का विवरण (वैकल्पिक)'
                    : 'Job description (optional)'
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            {/* Location */}
            <div className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
              <p className="mb-2">{t('location', language)}</p>
              <Button variant="outline" size="small">
                📍 {t('useCurrentLocation', language)}
              </Button>
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} fullWidth size="large" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin">⏳</span>
                  <span className={language === 'hi' ? 'font-hindi' : ''}>
                    {language === 'hi' ? 'पोस्ट कर रहे हैं...' : 'Posting...'}
                  </span>
                </span>
              ) : (
                t('postJob', language)
              )}
            </Button>

            <p className={`text-xs text-gray-500 text-center ${language === 'hi' ? 'font-hindi' : ''}`}>
              {language === 'hi'
                ? 'नोट: आस-पास के मजदूर इस काम को देख पाएंगे'
                : 'Note: Nearby labourers will be able to see this job'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
