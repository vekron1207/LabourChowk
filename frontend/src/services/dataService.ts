/**
 * Data Service - Works with localStorage for local development
 * Can be easily swapped to Firebase later
 */

import { Job, LabourProfile } from '../types';
import { logger } from '../utils/logger';

const STORAGE_KEYS = {
  JOBS: 'labour_chowk_jobs',
  LABOUR_PROFILES: 'labour_chowk_labour_profiles',
  USERS: 'labour_chowk_users',
};

// ============= JOBS =============

export const saveJob = (job: Job): void => {
  const jobs = getAllJobs();
  jobs.push(job);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const getAllJobs = (): Job[] => {
  const data = localStorage.getItem(STORAGE_KEYS.JOBS);
  return data ? JSON.parse(data) : [];
};

export const getOpenJobs = (): Job[] => {
  return getAllJobs().filter((job) => job.status === 'open');
};

export const updateJobStatus = (
  jobId: string,
  status: 'open' | 'closed' | 'in_progress' | 'completed'
): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) =>
    job.id === jobId ? { ...job, status } : job
  );
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const deleteJob = (jobId: string): void => {
  const jobs = getAllJobs().filter((job) => job.id !== jobId);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const incrementJobViews = (jobId: string, userId: string): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) => {
    if (job.id === jobId) {
      const viewedBy = job.viewedBy || [];
      if (!viewedBy.includes(userId)) {
        return {
          ...job,
          views: (job.views || 0) + 1,
          viewedBy: [...viewedBy, userId],
        };
      }
    }
    return job;
  });
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const addCounterOffer = (
  jobId: string,
  counterOffer: import('../types').CounterOffer
): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) => {
    if (job.id === jobId) {
      const counterOffers = job.counterOffers || [];
      return {
        ...job,
        counterOffers: [...counterOffers, counterOffer],
      };
    }
    return job;
  });
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const updateCounterOfferStatus = (
  jobId: string,
  offerId: string,
  status: 'pending' | 'accepted' | 'rejected'
): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) => {
    if (job.id === jobId && job.counterOffers) {
      return {
        ...job,
        counterOffers: job.counterOffers.map((offer) =>
          offer.id === offerId ? { ...offer, status } : offer
        ),
      };
    }
    return job;
  });
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const addJobApplication = (
  jobId: string,
  application: import('../types').JobApplication
): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) => {
    if (job.id === jobId) {
      const applications = job.applications || [];
      return {
        ...job,
        applications: [...applications, application],
      };
    }
    return job;
  });
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const acceptJobApplication = (
  jobId: string,
  applicationId: string,
  labourId: string
): void => {
  const jobs = getAllJobs();
  const updated = jobs.map((job) => {
    if (job.id === jobId && job.applications) {
      return {
        ...job,
        status: 'in_progress' as const,
        acceptedLabourId: labourId,
        applications: job.applications.map((app) =>
          app.id === applicationId
            ? { ...app, status: 'accepted' as const }
            : { ...app, status: 'rejected' as const }
        ),
      };
    }
    return job;
  });
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
};

export const getJobsByEmployer = (employerId: string): Job[] => {
  return getAllJobs().filter((job) => job.postedBy === employerId);
};

// ============= LABOUR PROFILES =============

export const saveLabourProfile = (profile: LabourProfile): void => {
  const profiles = getAllLabourProfiles();

  // Check if profile already exists for this user
  const existingIndex = profiles.findIndex((p) => p.userId === profile.userId);

  if (existingIndex >= 0) {
    // Update existing profile
    profiles[existingIndex] = profile;
  } else {
    // Add new profile
    profiles.push(profile);
  }

  localStorage.setItem(STORAGE_KEYS.LABOUR_PROFILES, JSON.stringify(profiles));
};

export const getAllLabourProfiles = (): LabourProfile[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LABOUR_PROFILES);
  return data ? JSON.parse(data) : [];
};

export const getAvailableLabourProfiles = (): LabourProfile[] => {
  return getAllLabourProfiles().filter((profile) => profile.available);
};

export const getLabourProfileByUserId = (userId: string): LabourProfile | null => {
  const profiles = getAllLabourProfiles();
  return profiles.find((p) => p.userId === userId) || null;
};

export const updateLabourAvailability = (
  userId: string,
  available: boolean
): void => {
  const profiles = getAllLabourProfiles();
  const updated = profiles.map((profile) =>
    profile.userId === userId
      ? { ...profile, available, updatedAt: new Date().toISOString() }
      : profile
  );
  localStorage.setItem(STORAGE_KEYS.LABOUR_PROFILES, JSON.stringify(updated));
};

// ============= USERS (Extended Info) =============

export const saveUserExtendedInfo = (
  userId: string,
  info: { name: string; phone?: string; location?: { lat: number; lng: number } }
): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.id === userId);

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...info };
  } else {
    users.push({ id: userId, ...info });
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getAllUsers = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (userId: string): any | null => {
  const users = getAllUsers();
  return users.find((u) => u.id === userId) || null;
};

// ============= COMBINED QUERIES =============

/**
 * Get labour profiles with user details
 */
export const getLabourWithUserDetails = (): Array<
  LabourProfile & { name: string; phone?: string; location: { lat: number; lng: number } }
> => {
  const profiles = getAllLabourProfiles();
  const users = getAllUsers();

  return profiles
    .map((profile) => {
      const user = users.find((u) => u.id === profile.userId);
      return user
        ? {
            ...profile,
            name: user.name,
            phone: user.phone,
            location: user.location || { lat: 0, lng: 0 },
          }
        : null;
    })
    .filter(Boolean) as any[];
};

/**
 * Get available labour with user details
 */
export const getAvailableLabourWithUserDetails = (): Array<
  LabourProfile & { name: string; phone?: string; location: { lat: number; lng: number } }
> => {
  return getLabourWithUserDetails().filter((profile) => profile.available);
};

// ============= UTILITY FUNCTIONS =============

/**
 * Clear all data (useful for testing)
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.JOBS);
  localStorage.removeItem(STORAGE_KEYS.LABOUR_PROFILES);
  localStorage.removeItem(STORAGE_KEYS.USERS);
};

/**
 * Get data statistics
 */
export const getDataStats = () => {
  return {
    totalJobs: getAllJobs().length,
    openJobs: getOpenJobs().length,
    totalLabourProfiles: getAllLabourProfiles().length,
    availableLabourProfiles: getAvailableLabourProfiles().length,
    totalUsers: getAllUsers().length,
  };
};

/**
 * Initialize with sample data (for first-time setup)
 */
export const initializeSampleData = (): void => {
  // Only initialize if no data exists
  if (getAllJobs().length === 0 && getAllLabourProfiles().length === 0) {
    logger.log('No data found. You can start posting jobs or registering as labour!');
  }
};
