import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Job, SkillKey } from '../types';
import { Card, Button, Header } from '../components';
import { SKILLS } from '../utils/constants';
import {
  getJobsByEmployer,
  updateCounterOfferStatus,
  acceptJobApplication,
  updateJobStatus,
  deleteJob,
} from '../services/dataService';

export const JobDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      loadJobs();

      // Auto-refresh jobs every 3 seconds to see new applications/offers
      const intervalId = setInterval(loadJobs, 3000);

      return () => clearInterval(intervalId);
    }
  }, [user]);

  const loadJobs = () => {
    if (user) {
      const employerJobs = getJobsByEmployer(user.id);
      setJobs(employerJobs);
    }
  };

  const getSkillName = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill ? (language === 'hi' ? skill.nameHi : skill.nameEn) : skillKey;
  };

  const getSkillIcon = (skillKey: SkillKey) => {
    const skill = SKILLS.find((s) => s.key === skillKey);
    return skill?.icon || '🔧';
  };

  const handleAcceptCounterOffer = (jobId: string, offerId: string) => {
    updateCounterOfferStatus(jobId, offerId, 'accepted');
    loadJobs();
  };

  const handleRejectCounterOffer = (jobId: string, offerId: string) => {
    updateCounterOfferStatus(jobId, offerId, 'rejected');
    loadJobs();
  };

  const handleAcceptApplication = (jobId: string, applicationId: string, labourId: string) => {
    acceptJobApplication(jobId, applicationId, labourId);
    loadJobs();
    alert(language === 'hi' ? 'आवेदन स्वीकार किया गया!' : 'Application accepted!');
  };

  const handleCloseJob = (jobId: string) => {
    updateJobStatus(jobId, 'closed');
    loadJobs();
  };

  const handleDeleteJob = (jobId: string) => {
    const confirmMsg = language === 'hi'
      ? 'क्या आप इस काम को हटाना चाहते हैं?'
      : 'Are you sure you want to delete this job?';
    if (window.confirm(confirmMsg)) {
      deleteJob(jobId);
      loadJobs();
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    const statusConfig = {
      open: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: language === 'hi' ? 'खुला' : 'Open',
      },
      in_progress: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: language === 'hi' ? 'प्रगति में' : 'In Progress',
      },
      closed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: language === 'hi' ? 'बंद' : 'Closed',
      },
      completed: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: language === 'hi' ? 'पूर्ण' : 'Completed',
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={language === 'hi' ? 'मेरे काम' : 'My Jobs'}
      />

      <div className="p-4">
        {jobs.length === 0 ? (
          <Card padding="large">
            <div className="text-center text-gray-500">
              <div className="text-5xl mb-3">📋</div>
              <p className={language === 'hi' ? 'font-hindi' : ''}>
                {language === 'hi'
                  ? 'अभी तक कोई काम पोस्ट नहीं किया गया'
                  : 'No jobs posted yet'}
              </p>
              <Button
                onClick={() => navigate('/post-job')}
                variant="primary"
                size="medium"
                className="mt-4"
              >
                {language === 'hi' ? '+ काम पोस्ट करें' : '+ Post a Job'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} padding="medium">
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
                          {language === 'hi' ? 'पोस्ट किया' : 'Posted'}: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>💰 ₹{job.rate}/{language === 'hi' ? 'दिन' : 'day'}</span>
                    <span>📅 {job.duration} {language === 'hi' ? 'दिन' : job.duration === 1 ? 'day' : 'days'}</span>
                    <span>👁️ {job.views || 0} {language === 'hi' ? 'देखा' : 'views'}</span>
                  </div>

                  {job.description && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {job.description}
                    </p>
                  )}

                  {/* Counter Offers */}
                  {job.counterOffers && job.counterOffers.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className={`text-sm font-semibold mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {language === 'hi' ? 'काउंटर ऑफर' : 'Counter Offers'} ({job.counterOffers.length})
                      </h4>
                      <div className="space-y-2">
                        {job.counterOffers.map((offer) => (
                          <div key={offer.id} className="bg-yellow-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium">{offer.labourName}</p>
                                <p className="text-sm text-gray-600">
                                  {language === 'hi' ? 'प्रस्तावित दर' : 'Offered Rate'}: ₹{offer.offeredRate}/{language === 'hi' ? 'दिन' : 'day'}
                                </p>
                                {offer.message && (
                                  <p className="text-sm text-gray-700 mt-1">{offer.message}</p>
                                )}
                              </div>
                              {offer.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAcceptCounterOffer(job.id, offer.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => handleRejectCounterOffer(job.id, offer.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    ✗
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-xs font-semibold ${
                                  offer.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {offer.status === 'accepted'
                                    ? (language === 'hi' ? 'स्वीकृत' : 'Accepted')
                                    : (language === 'hi' ? 'अस्वीकृत' : 'Rejected')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Applications */}
                  {job.applications && job.applications.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className={`text-sm font-semibold mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {language === 'hi' ? 'आवेदन' : 'Applications'} ({job.applications.length})
                      </h4>
                      <div className="space-y-2">
                        {job.applications.map((app) => (
                          <div key={app.id} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{app.labourName}</p>
                                {app.labourPhone && (
                                  <p className="text-sm text-gray-600">📞 {app.labourPhone}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                  {language === 'hi' ? 'आवेदित' : 'Applied'}: {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                              </div>
                              {app.status === 'pending' && job.status === 'open' ? (
                                <Button
                                  onClick={() => handleAcceptApplication(job.id, app.id, app.labourId)}
                                  variant="primary"
                                  size="small"
                                >
                                  {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
                                </Button>
                              ) : (
                                <span className={`text-xs font-semibold ${
                                  app.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {app.status === 'accepted'
                                    ? (language === 'hi' ? 'स्वीकृत' : 'Accepted')
                                    : (language === 'hi' ? 'अस्वीकृत' : 'Rejected')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {job.status === 'open' && (
                      <Button
                        onClick={() => handleCloseJob(job.id)}
                        variant="outline"
                        size="small"
                      >
                        {language === 'hi' ? 'बंद करें' : 'Close Job'}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteJob(job.id)}
                      variant="outline"
                      size="small"
                      className="text-red-600 hover:bg-red-50"
                    >
                      {language === 'hi' ? 'हटाएं' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
