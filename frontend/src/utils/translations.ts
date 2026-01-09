import { Language } from '../types';

export const translations = {
  // Common
  continue: { hi: 'जारी रखें', en: 'Continue' },
  cancel: { hi: 'रद्द करें', en: 'Cancel' },
  save: { hi: 'सहेजें', en: 'Save' },
  next: { hi: 'आगे', en: 'Next' },
  back: { hi: 'पीछे', en: 'Back' },

  // Language Selection
  selectLanguage: { hi: 'भाषा चुनें', en: 'Select Language' },

  // Role Selection
  selectRole: { hi: 'अपनी भूमिका चुनें', en: 'Select Your Role' },
  labour: { hi: 'श्रमिक', en: 'Labour' },
  employer: { hi: 'ठेकेदार / व्यक्ति', en: 'Contractor / Individual' },
  lookingForWork: { hi: 'काम की तलाश में', en: 'Looking for work' },
  lookingToHire: { hi: 'मजदूर चाहिए', en: 'Looking to hire' },

  // Login
  loginWithPhone: { hi: 'फोन नंबर से लॉगिन करें', en: 'Login with Phone Number' },
  enterPhone: { hi: 'अपना फोन नंबर दर्ज करें', en: 'Enter your phone number' },
  sendOTP: { hi: 'OTP भेजें', en: 'Send OTP' },
  enterOTP: { hi: 'OTP दर्ज करें', en: 'Enter OTP' },
  verify: { hi: 'सत्यापित करें', en: 'Verify' },
  login: { hi: 'लॉगिन करें', en: 'Login' },
  password: { hi: 'पासवर्ड', en: 'Password' },
  enterPassword: { hi: 'अपना पासवर्ड दर्ज करें', en: 'Enter your password' },
  register: { hi: 'रजिस्टर करें', en: 'Register' },
  newUser: { hi: 'नए उपयोगकर्ता?', en: 'New user?' },

  // Profile
  createProfile: { hi: 'प्रोफाइल बनाएं', en: 'Create Profile' },
  yourName: { hi: 'आपका नाम', en: 'Your Name' },
  selectSkills: { hi: 'अपने कौशल चुनें', en: 'Select Your Skills' },
  dailyRate: { hi: 'दैनिक मजदूरी (₹)', en: 'Daily Rate (₹)' },
  location: { hi: 'स्थान', en: 'Location' },
  useCurrentLocation: { hi: 'वर्तमान स्थान उपयोग करें', en: 'Use Current Location' },

  // Availability
  available: { hi: 'उपलब्ध', en: 'Available' },
  notAvailable: { hi: 'अनुपलब्ध', en: 'Not Available' },
  availableForWork: { hi: 'आप आस-पास के काम के लिए उपलब्ध हैं', en: 'You are available for nearby work' },
  notAvailableForWork: { hi: 'आप काम के लिए उपलब्ध नहीं हैं', en: 'You are not available for work' },

  // Job Posting
  postJob: { hi: 'काम पोस्ट करें', en: 'Post a Job' },
  requiredSkill: { hi: 'आवश्यक कौशल', en: 'Required Skill' },
  rateOffered: { hi: 'दी जाने वाली मजदूरी (₹)', en: 'Rate Offered (₹)' },
  duration: { hi: 'अवधि (दिन)', en: 'Duration (days)' },
  jobDescription: { hi: 'काम का विवरण', en: 'Job Description' },

  // Browse Labour
  findLabour: { hi: 'मजदूर खोजें', en: 'Find Labour' },
  nearbyLabour: { hi: 'आस-पास के मजदूर', en: 'Nearby Labour' },
  filterBySkill: { hi: 'कौशल से छाँटें', en: 'Filter by Skill' },
  callNow: { hi: 'अभी कॉल करें', en: 'Call Now' },
  perDay: { hi: 'प्रति दिन', en: 'per day' },

  // Distance
  away: { hi: 'दूर', en: 'away' },
  km: { hi: 'किमी', en: 'km' },
} as const;

export const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
