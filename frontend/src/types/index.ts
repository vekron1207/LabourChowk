export type Language = 'hi' | 'en';

export type UserRole = 'labour' | 'employer';

export type SkillKey =
  | 'mason'
  | 'painter'
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'helper'
  | 'cleaner'
  | 'welder'
  | 'loader'
  | 'construction_worker';

export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  language: Language;
  location: Location;
  createdAt: string;
}

export interface LabourProfile {
  userId: string;
  skills: SkillKey[];
  dailyRate: number;
  available: boolean;
  updatedAt: string;
}

export interface CounterOffer {
  id: string;
  labourId: string;
  labourName: string;
  offeredRate: number;
  message?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface JobApplication {
  id: string;
  labourId: string;
  labourName: string;
  labourPhone?: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Job {
  id: string;
  postedBy: string;
  skill: SkillKey;
  rate: number;
  location: Location;
  status: 'open' | 'closed' | 'in_progress' | 'completed';
  duration: number;
  createdAt: string;
  description?: string;
  views?: number;
  viewedBy?: string[]; // Array of user IDs who viewed this job
  counterOffers?: CounterOffer[];
  applications?: JobApplication[];
  acceptedLabourId?: string; // ID of labour who got the job
}

export interface Skill {
  key: SkillKey;
  icon: string;
  nameHi: string;
  nameEn: string;
}
