import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SkillKey, Job, LabourProfile } from '../types';
import { Card, ToggleSwitch, DistanceSlider, Button, Header } from '../components';
import { t } from '../utils/translations';
import { SKILLS } from '../utils/constants';
import { calculateDistance, formatDistance } from '../utils/location';
import {
  getAllJobs,
  getOpenJobs,
  saveLabourProfile,
  getLabourProfileByUserId,
  updateLabourAvailability,
  saveUserExtendedInfo,
  incrementJobViews,
  addCounterOffer,
  addJobApplication,
} from '../services/dataService';

export const LabourHome: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [available, setAvailable] = useState(true);
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [activeTab, setActiveTab] = useState<'status' | 'jobs' | 'assignments'>('status');
  const [jobs, setJobs] = useState<Job[]>([]);

  // Load jobs from localStorage with real-time updates
  useEffect(() => {
    const loadJobs = () => {
      // Load ALL jobs (not just open) so labour can see their accepted assignments
      const allJobs = getAllJobs();
      setJobs(allJobs);
    };

    loadJobs();

    // Reload jobs when tab becomes visible (in case new jobs were posted)
    const handleFocus = () => loadJobs();
    window.addEventListener('focus', handleFocus);

    // Auto-refresh jobs every 3 seconds when on jobs tab
    let intervalId: number | null = null;
    if (activeTab === 'jobs') {
      intervalId = setInterval(loadJobs, 3000);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  // Save/update labour profile when component mounts
  useEffect(() => {
    if (user && user.role === 'labour') {
      // Save user extended info
      saveUserExtendedInfo(user.id, {
        name: user.name,
        phone: user.phone,
        location: user.location,
      });

      // Check if labour profile exists
      const existingProfile = getLabourProfileByUserId(user.id);

      if (!existingProfile) {
        // Create initial profile
        const newProfile: LabourProfile = {
          userId: user.id,
          skills: [], // Will be set during profile setup
          dailyRate: 0,
          available: true,
          updatedAt: new Date().toISOString(),
        };
        saveLabourProfile(newProfile);
      } else {
        setAvailable(existingProfile.available);
      }
    }
  }, [user]);

  // Update availability in localStorage when toggle changes
  useEffect(() => {
    if (user) {
      updateLabourAvailability(user.id, available);
    }
  }, [available, user]);

  const getSkillName = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill ? (language === 'hi' ? skill.nameHi : skill.nameEn) : skillKey;
  };

  const getSkillIcon = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill?.icon || '🔧';
  };

  // Filter jobs by distance and user's skills (only show open jobs)
  const nearbyJobs = jobs
    .filter((job) => job.status === 'open') // Only show open jobs in the jobs tab
    .map((job) => ({
      ...job,
      distance: user?.location
        ? calculateDistance(user.location, job.location)
        : 0,
    }))
    .filter((job) => job.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  // Get labour's assigned jobs (where application was accepted)
  const myAssignments = jobs
    .filter((job) => {
      if (!user) return false;
      // Check if this labour has an accepted application
      const hasAcceptedApplication = job.applications?.some(
        (app) => app.labourId === user.id && app.status === 'accepted'
      );
      // Or check if labour has an accepted counter offer
      const hasAcceptedOffer = job.counterOffers?.some(
        (offer) => offer.labourId === user.id && offer.status === 'accepted'
      );
      return hasAcceptedApplication || hasAcceptedOffer;
    })
    .map((job) => ({
      ...job,
      distance: user?.location
        ? calculateDistance(user.location, job.location)
        : 0,
    }));

  // Track job views when jobs are displayed
  useEffect(() => {
    if (user && nearbyJobs.length > 0 && activeTab === 'jobs') {
      nearbyJobs.forEach((job) => {
        incrementJobViews(job.id, user.id);
      });
    }
  }, [nearbyJobs.length, activeTab, user]);

  const handleApplyForJob = (jobId: string) => {
    if (!user) return;

    const confirmMsg = language === 'hi'
      ? 'क्या आप इस काम के लिए आवेदन करना चाहते हैं?'
      : 'Do you want to apply for this job?';

    if (window.confirm(confirmMsg)) {
      const application = {
        id: 'app_' + Date.now(),
        labourId: user.id,
        labourName: user.name,
        labourPhone: user.phone,
        appliedAt: new Date().toISOString(),
        status: 'pending' as const,
      };

      addJobApplication(jobId, application);
      alert(language === 'hi' ? 'आवेदन सफलतापूर्वक जमा किया गया!' : 'Application submitted successfully!');

      // Reload jobs to show updated status
      const allJobs = getOpenJobs();
      setJobs(allJobs);
    }
  };

  const handleMakeCounterOffer = (jobId: string, currentRate: number) => {
    if (!user) return;

    const promptMsg = language === 'hi'
      ? `अपनी प्रस्तावित दैनिक दर दर्ज करें (वर्तमान: ₹${currentRate}):`
      : `Enter your offered daily rate (current: ₹${currentRate}):`;

    const offeredRateStr = window.prompt(promptMsg);
    if (!offeredRateStr) return;

    const offeredRate = Number(offeredRateStr);
    if (isNaN(offeredRate) || offeredRate <= 0) {
      alert(language === 'hi' ? 'कृपया मान्य दर दर्ज करें' : 'Please enter a valid rate');
      return;
    }

    const messagePrompt = language === 'hi'
      ? 'संदेश (वैकल्पिक):'
      : 'Message (optional):';
    const message = window.prompt(messagePrompt) || undefined;

    const counterOffer = {
      id: 'offer_' + Date.now(),
      labourId: user.id,
      labourName: user.name,
      offeredRate,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    addCounterOffer(jobId, counterOffer);
    alert(language === 'hi' ? 'काउंटर ऑफर भेजा गया!' : 'Counter offer sent!');

    // Reload jobs
    const allJobs = getOpenJobs();
    setJobs(allJobs);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={`${language === 'hi' ? 'नमस्ते' : 'Hello'}, ${user?.name || (language === 'hi' ? 'श्रमिक' : 'Worker')}!`}
      />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('status')}
            className={`
              flex-1 py-3 text-center font-medium transition-colors
              ${
                activeTab === 'status'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
              ${language === 'hi' ? 'font-hindi' : ''}
            `}
          >
            {language === 'hi' ? 'मेरी स्थिति' : 'My Status'}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`
              flex-1 py-3 text-center font-medium transition-colors relative
              ${
                activeTab === 'jobs'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
              ${language === 'hi' ? 'font-hindi' : ''}
            `}
          >
            {language === 'hi' ? 'आस-पास के काम' : 'Nearby Jobs'}
            {nearbyJobs.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {nearbyJobs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`
              flex-1 py-3 text-center font-medium transition-colors relative
              ${
                activeTab === 'assignments'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
              ${language === 'hi' ? 'font-hindi' : ''}
            `}
          >
            {language === 'hi' ? 'मेरे काम' : 'My Jobs'}
            {myAssignments.length > 0 && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {myAssignments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'status' ? (
          /* Status Tab */
          <>
            <Card padding="large">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('available', language)}
                </h2>
                <ToggleSwitch enabled={available} onToggle={setAvailable} />
              </div>
              <p className={`text-gray-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {available ? t('availableForWork', language) : t('notAvailableForWork', language)}
              </p>
            </Card>

            <Card padding="large">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">👷</div>
                <p className={`${language === 'hi' ? 'font-hindi' : ''} text-sm`}>
                  {language === 'hi'
                    ? 'जब आप उपलब्ध हों, आस-पास के ठेकेदार आपको देख सकेंगे और आपसे संपर्क कर सकेंगे'
                    : 'When you are available, nearby contractors can see you and contact you'}
                </p>
              </div>
            </Card>
          </>
        ) : activeTab === 'jobs' ? (
          /* Jobs Tab */
          <>
            <Card padding="medium">
              <DistanceSlider
                distance={maxDistance}
                onChange={setMaxDistance}
                language={language}
                min={1}
                max={50}
              />
            </Card>

            <h2 className={`text-lg font-bold text-gray-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
              {language === 'hi' ? 'उपलब्ध काम' : 'Available Jobs'} ({nearbyJobs.length})
            </h2>

            {nearbyJobs.length === 0 ? (
              <Card padding="large">
                <div className="text-center text-gray-500">
                  <div className="text-5xl mb-3">🔍</div>
                  <p className={language === 'hi' ? 'font-hindi' : ''}>
                    {language === 'hi'
                      ? `${maxDistance} किमी के दायरे में कोई काम उपलब्ध नहीं है`
                      : `No jobs available within ${maxDistance} km`}
                  </p>
                  <p className={`text-sm mt-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {language === 'hi'
                      ? 'दूरी बढ़ाकर देखें'
                      : 'Try increasing the distance range'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {nearbyJobs.map((job) => (
                  <Card key={job.id} padding="medium" hover>
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getSkillIcon(job.skill)}</div>
                          <div>
                            <h3 className={`text-lg font-bold text-gray-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                              {getSkillName(job.skill)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              📍 {formatDistance(job.distance, language)} {t('away', language)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {language === 'hi' ? 'खुला' : 'Open'}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          💰 ₹{job.rate}/{language === 'hi' ? 'दिन' : 'day'}
                        </span>
                        <span>
                          📅 {job.duration} {language === 'hi' ? 'दिन' : job.duration === 1 ? 'day' : 'days'}
                        </span>
                      </div>

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {job.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleApplyForJob(job.id)}
                          variant="primary"
                          size="medium"
                        >
                          <span className={language === 'hi' ? 'font-hindi' : ''}>
                            {language === 'hi' ? 'आवेदन करें' : 'Apply'}
                          </span>
                        </Button>
                        <Button
                          onClick={() => handleMakeCounterOffer(job.id, job.rate)}
                          variant="outline"
                          size="medium"
                        >
                          <span className={language === 'hi' ? 'font-hindi' : ''}>
                            {language === 'hi' ? 'काउंटर ऑफर' : 'Counter Offer'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* My Assignments Tab */
          <>
            <h2 className={`text-lg font-bold text-gray-900 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
              {language === 'hi' ? 'मेरे काम' : 'My Assigned Jobs'} ({myAssignments.length})
            </h2>

            {myAssignments.length === 0 ? (
              <Card padding="large">
                <div className="text-center text-gray-500">
                  <div className="text-5xl mb-3">📋</div>
                  <p className={language === 'hi' ? 'font-hindi' : ''}>
                    {language === 'hi'
                      ? 'अभी तक कोई काम असाइन नहीं किया गया'
                      : 'No jobs assigned yet'}
                  </p>
                  <p className={`text-sm mt-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {language === 'hi'
                      ? 'जब ठेकेदार आपके आवेदन को स्वीकार करेगा, तो वह यहां दिखाई देगा'
                      : 'When a contractor accepts your application, it will appear here'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {myAssignments.map((job) => {
                  const myOffer = job.counterOffers?.find(
                    (offer) => offer.labourId === user?.id && offer.status === 'accepted'
                  );

                  return (
                    <Card key={job.id} padding="medium" className="border-2 border-green-500">
                      <div className="space-y-3">
                        {/* Success Badge */}
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex items-center gap-2">
                          <span className="text-2xl">🎉</span>
                          <div className="flex-1">
                            <p className={`font-bold text-green-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                              {language === 'hi' ? 'बधाई हो! आपको यह काम मिल गया है' : 'Congratulations! You got this job'}
                            </p>
                            <p className="text-sm text-green-700">
                              {myOffer
                                ? (language === 'hi' ? 'आपका काउंटर ऑफर स्वीकार किया गया' : 'Your counter offer was accepted')
                                : (language === 'hi' ? 'आपका आवेदन स्वीकार किया गया' : 'Your application was accepted')}
                            </p>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{getSkillIcon(job.skill)}</div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold text-gray-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                              {getSkillName(job.skill)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              📍 {formatDistance(job.distance, language)} {t('away', language)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {job.status === 'in_progress'
                              ? (language === 'hi' ? 'प्रगति में' : 'In Progress')
                              : (language === 'hi' ? 'पूर्ण' : 'Completed')}
                          </div>
                        </div>

                        {/* Pay & Duration */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded">
                            <span>💰</span>
                            <span className="font-bold text-green-700">
                              ₹{myOffer ? myOffer.offeredRate : job.rate}/{language === 'hi' ? 'दिन' : 'day'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>📅</span>
                            <span>{job.duration} {language === 'hi' ? 'दिन' : job.duration === 1 ? 'day' : 'days'}</span>
                          </div>
                        </div>

                        {/* Description */}
                        {job.description && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {job.description}
                          </p>
                        )}

                        {/* Important Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className={`text-sm font-medium text-yellow-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {language === 'hi' ? '⚠️ महत्वपूर्ण जानकारी:' : '⚠️ Important:'}
                          </p>
                          <ul className={`text-sm text-yellow-800 mt-1 space-y-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            <li>• {language === 'hi' ? 'समय पर काम की जगह पर पहुंचें' : 'Reach the work location on time'}</li>
                            <li>• {language === 'hi' ? 'ठेकेदार से संपर्क करें और विवरण की पुष्टि करें' : 'Contact contractor and confirm details'}</li>
                            <li>• {language === 'hi' ? 'आवश्यक उपकरण/औजार साथ लाएं' : 'Bring necessary tools/equipment'}</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
