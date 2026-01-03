# Labour Chowk (लेबर चौक)

Labour Chowk is a digital platform designed to modernize the traditional daily-wage labour marketplace found at physical labour gathering points across India. The application connects daily-wage workers directly with contractors and individuals seeking their services, eliminating intermediaries and reducing friction in the hiring process.

## Overview

This platform addresses a real-world problem by providing a simple, accessible solution for both labourers seeking work and employers looking to hire skilled daily-wage workers. The system facilitates direct connections through location-based matching and phone-based communication.

**Target Users:**
- Daily-wage labourers seeking short or long-term work opportunities
- Contractors and individuals requiring skilled labour for construction and maintenance projects

## Project Philosophy

The project adheres to several core principles:

- **Problem-First Approach**: Focused on solving an observed, real-world challenge
- **Accessibility**: Designed for users with varying literacy levels and low-end devices
- **Language Support**: Hindi-first interface with English translation support
- **Simplicity**: No forced monetization or manipulative design patterns
- **Cross-Platform**: Single codebase serving Android, iOS, and web platforms

## Core Features

### For Labour (श्रमिक)

- Create and manage professional profiles
- Set expected daily wage rates
- Toggle real-time availability status
- Share location and skill information
- Receive direct contact from potential employers

### For Employers (ठेकेदार / व्यक्ति)

- Post job requirements with offered rates
- Browse nearby available labourers
- Filter by skill type and distance
- Contact workers directly via phone
- Manage job status and completion

### Platform Functionality

- **Location-Based Matching**: Workers and jobs are matched based on proximity
- **Direct Communication**: Phone-based contact system (no in-app chat in v1)
- **Skill Categories**: Comprehensive list of trade skills with bilingual support
- **Simple Authentication**: Phone number OTP-based login system
- **No Payment Processing**: Trust-based, direct payment outside the app (v1)

## Technical Architecture

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Progressive Web App**: PWA-enabled for installability
- **Mobile Packaging**: Capacitor for native Android and iOS builds

### Backend

- **Authentication**: Firebase Phone OTP
- **Database**: Cloud Firestore (NoSQL)
- **Hosting**: Firebase Hosting
- **Functions**: Cloud Functions (optional for future features)

### Platform Support

| Platform | Status |
|----------|--------|
| Web (PWA) | Supported |
| Android | Supported |
| iOS | Supported |

## Supported Skills

The platform supports the following trade categories with bilingual labels:

| Skill | Hindi Name | English Name |
|-------|------------|--------------|
| Mason | मिस्त्री | Mason |
| Painter | पेंटर | Painter |
| Electrician | इलेक्ट्रीशियन | Electrician |
| Plumber | प्लम्बर | Plumber |
| Carpenter | बढ़ई | Carpenter |
| Helper | हेल्पर | Helper |
| Cleaner | सफाई कामगार | Cleaner |
| Welder | वेल्डर | Welder |
| Loader | माल ढोने वाला | Loader/Porter |
| Construction Worker | साइट वर्कर | Construction Worker |

## Data Model

### User
```typescript
{
  id: string
  phone: string
  role: 'labour' | 'employer'
  name: string
  language: 'hi' | 'en'
  location: { lat: number, lng: number }
  createdAt: string
}
```

### LabourProfile
```typescript
{
  userId: string
  skills: SkillKey[]
  dailyRate: number
  available: boolean
  updatedAt: string
}
```

### Job
```typescript
{
  id: string
  postedBy: string
  skill: SkillKey
  rate: number
  location: { lat: number, lng: number }
  status: 'open' | 'closed' | 'in_progress' | 'completed'
  duration: number
  createdAt: string
  description?: string
}
```

## User Flow

### Initial Setup (All Users)

1. Select preferred language (Hindi or English)
2. Authenticate using phone number via OTP
3. Choose user role (Labour or Employer)

### Labour Workflow

1. Complete profile setup
   - Enter name and personal details
   - Select applicable skills
   - Set expected daily wage rate
   - Enable location access
2. Set availability status
3. Receive calls from interested employers
4. Accept or decline opportunities

### Employer Workflow

1. Create job posting
   - Specify required skill
   - Set offered wage rate
   - Define job location and duration
2. Browse nearby available labourers
3. Filter by skill type and proximity
4. Contact selected workers directly
5. Update job status upon completion

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install frontend dependencies
cd frontend
npm install

# Install Firebase tools
npm install -g firebase-tools
```

### Local Development

```bash
# Run development server (localhost only)
cd frontend
npm run dev

# Run development server (network accessible)
npm run dev:network
```

### Build for Production

```bash
# Build optimized production bundle
cd frontend
npm run build
```

### Deployment

#### Web (Firebase Hosting)

```bash
cd backend
firebase login
firebase deploy --only hosting
```

#### Android

```bash
# Build and sync with Capacitor
npx cap sync android
npx cap open android
```

#### iOS (requires macOS)

```bash
# Build and sync with Capacitor
npx cap sync ios
npx cap open ios
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| PWA-first approach | Single codebase, minimal development cost |
| Phone OTP authentication | Email not required for target demographic |
| Hindi with icon support | Accommodates users with limited literacy |
| No in-app payments (v1) | Maintains simplicity and builds trust |
| Location-based matching | Reflects real-world proximity requirements |
| Direct phone communication | Familiar and accessible for all users |

## Out of Scope (v1)

The following features are intentionally excluded from the initial release:

- In-app payment processing or digital wallet
- Real-time chat or messaging system
- Rating and review mechanisms
- Escrow or payment guarantee services
- AI-powered matching algorithms
- Formal dispute resolution system
- Advanced analytics or reporting

## Development Roadmap

### Phase 1: Foundation
- React + Vite project setup
- Tailwind CSS integration
- Firebase authentication (Phone OTP)
- PWA configuration
- Multi-language support system

### Phase 2: Core Features
- Labour profile creation and management
- Job posting functionality
- Labour browsing and filtering
- Location-based search and matching

### Phase 3: Mobile Distribution
- Android application build via Capacitor
- iOS application build (requires macOS)
- Platform-specific testing and optimization

### Phase 4: Pilot Program
- Onboard initial group of labourers (10-20 users)
- Test with real contractors
- Gather feedback and iterate on design

## Deployment Platforms

| Platform | Distribution Method |
|----------|-------------------|
| Web | Firebase Hosting, installable as PWA |
| Android | Google Play Store (Internal Testing, then Production) |
| iOS | TestFlight (Beta), then App Store |

## Future Monetization Options

The platform is designed as a free-first service. Potential future revenue models include:

- Minimal per-hire transaction fee (₹10-₹20)
- Premium employer subscription tiers
- Corporate Social Responsibility (CSR) partnerships
- Municipal government integrations
- Community donations and grants

All monetization strategies will prioritize user dignity and platform accessibility.

## Performance Optimization

The application is optimized for:

- Low-end Android devices (2GB RAM or less)
- Unstable network connections (2G/3G)
- Minimal data consumption
- Small application bundle size
- Large touch targets for accessibility
- Icon-based navigation to reduce text dependency

## Contributing

Contributions are welcome. Please ensure all contributions:

- Maintain accessibility standards
- Support bilingual interface (Hindi and English)
- Optimize for low-end devices
- Follow existing code style and conventions
- Include appropriate documentation

## License

License to be determined. The project aims to remain:

- Open-source and transparent
- Community-driven
- Non-exploitative
- Accessible to all

## Project Mission

Labour Chowk exists to provide dignity and accessibility to daily-wage workers while simplifying the hiring process for employers. The platform prioritizes solving real problems over maximizing profit, with a commitment to serving its community effectively and ethically.
