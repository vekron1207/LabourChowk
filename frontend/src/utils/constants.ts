import { Skill } from '../types';

export const SKILLS: Skill[] = [
  { key: 'mason', icon: '🧱', nameHi: 'मिस्त्री', nameEn: 'Mason' },
  { key: 'painter', icon: '🎨', nameHi: 'पेंटर', nameEn: 'Painter' },
  { key: 'electrician', icon: '⚡', nameHi: 'इलेक्ट्रीशियन', nameEn: 'Electrician' },
  { key: 'plumber', icon: '🚰', nameHi: 'प्लम्बर', nameEn: 'Plumber' },
  { key: 'carpenter', icon: '🪚', nameHi: 'बढ़ई', nameEn: 'Carpenter' },
  { key: 'helper', icon: '🧱', nameHi: 'हेल्पर', nameEn: 'Helper' },
  { key: 'cleaner', icon: '🧹', nameHi: 'सफाई कामगार', nameEn: 'Cleaner' },
  { key: 'welder', icon: '🛠️', nameHi: 'वेल्डर', nameEn: 'Welder' },
  { key: 'loader', icon: '🚚', nameHi: 'माल ढोने वाला', nameEn: 'Loader / Porter' },
  { key: 'construction_worker', icon: '🏗️', nameHi: 'साइट वर्कर', nameEn: 'Construction Worker' },
];

export const LANGUAGES = {
  hi: 'हिंदी',
  en: 'English'
} as const;
