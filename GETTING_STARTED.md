# Getting Started with Labour Chowk

## What We've Built

A complete starter codebase for the Labour Chowk MVP with:

✅ Clean separation between frontend and backend
✅ Reusable component library
✅ Bilingual support (Hindi/English)
✅ Type-safe TypeScript code
✅ PWA-ready configuration
✅ Firebase backend setup
✅ Mobile-first responsive design

## Current Status

### ✅ Completed
- Project structure with frontend/backend folders
- React + Vite + TypeScript + Tailwind setup
- 6 reusable UI components (Button, Input, Card, SkillSelector, LanguageToggle, ToggleSwitch)
- Language context with Hindi/English support
- Authentication context
- 5 screens (Language Selection, Role Selection, Login, Profile Setup, Labour Home)
- Routing with React Router
- Firebase configuration files
- Firestore security rules
- Type definitions for all data models

### 🚧 Next Steps (To Complete MVP)

1. **Firebase Integration**
   - Set up Firebase project
   - Enable Phone Authentication
   - Connect OTP login flow
   - Test authentication

2. **Location Services**
   - Request GPS permissions
   - Get user coordinates
   - Calculate distance between users
   - Display on map

3. **Employer Features**
   - Job posting screen
   - Labour browsing/search
   - Filter by skill and distance
   - Click-to-call functionality

4. **Data Persistence**
   - Save user profiles to Firestore
   - Save labour profiles to Firestore
   - Save jobs to Firestore
   - Real-time updates

5. **Testing & Polish**
   - Test on real devices
   - Optimize performance
   - Add loading states
   - Error handling

## Installation

Since npm is not available in your current environment, you'll need to:

1. Open the project in VS Code or your preferred editor
2. Open a terminal (PowerShell, CMD, or Git Bash)
3. Navigate to the frontend folder:
   ```bash
   cd "g:\Work\Labour Chowk\frontend"
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure Overview

```
Labour Chowk/
│
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components (6 files)
│   │   │   ├── Button.tsx      # Customizable button
│   │   │   ├── Input.tsx       # Form input with validation
│   │   │   ├── Card.tsx        # Container component
│   │   │   ├── SkillSelector.tsx  # Multi-skill picker
│   │   │   ├── LanguageToggle.tsx # Language switcher
│   │   │   └── ToggleSwitch.tsx   # ON/OFF toggle
│   │   │
│   │   ├── screens/            # Page components (5 screens)
│   │   │   ├── LanguageSelection.tsx
│   │   │   ├── RoleSelection.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ProfileSetup.tsx
│   │   │   └── LabourHome.tsx
│   │   │
│   │   ├── contexts/           # React contexts
│   │   │   ├── LanguageContext.tsx  # Language state
│   │   │   └── AuthContext.tsx      # Auth state
│   │   │
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts        # All type definitions
│   │   │
│   │   ├── utils/              # Utilities
│   │   │   ├── constants.ts    # Skills, languages
│   │   │   └── translations.ts # Hindi/English text
│   │   │
│   │   ├── config/             # Configuration
│   │   │   └── firebase.ts     # Firebase setup
│   │   │
│   │   ├── App.tsx             # Main app + routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   │
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Vite + PWA config
│   ├── tailwind.config.js      # Tailwind theme
│   └── tsconfig.json           # TypeScript config
│
├── backend/                     # Firebase configuration
│   ├── firebase.json           # Hosting config
│   ├── firestore.rules         # Security rules
│   ├── firestore.indexes.json  # Database indexes
│   └── README.md               # Backend setup guide
│
├── readme.md                   # Original project vision
├── PROJECT_SETUP.md            # Detailed setup guide
└── GETTING_STARTED.md          # This file
```

## How The Code Is Organized

### 1. Reusable Components
All UI components accept data through props, making them reusable:

```tsx
// Example: Using Button component
<Button
  variant="primary"    // or "secondary" or "outline"
  size="large"         // or "medium" or "small"
  fullWidth={true}     // optional
  onClick={handleClick}
>
  Click Me
</Button>
```

### 2. Clean Data Flow
- User data flows through **AuthContext**
- Language preference through **LanguageContext**
- No prop drilling needed

### 3. Type Safety
All data structures are typed in `types/index.ts`:
- User
- LabourProfile
- Job
- Skill
- Language

### 4. Bilingual Support
Translations centralized in `utils/translations.ts`:
```tsx
import { t } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';

const { language } = useLanguage();
<h1>{t('selectRole', language)}</h1>
// Shows: "अपनी भूमिका चुनें" (Hindi) or "Select Your Role" (English)
```

## Key Design Decisions

1. **Mobile-First**: All components designed for touch
2. **Large Touch Targets**: Minimum 44px height for accessibility
3. **Icon-Heavy UI**: Works for low-literacy users
4. **Offline-First**: PWA support for unstable internet
5. **Hindi Primary**: Hindi shown first, English secondary
6. **No Dark Patterns**: Simple, honest UX

## Technologies Used

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool (fast!) |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Firebase | Backend (Auth, Database, Hosting) |
| Capacitor | Future mobile app packaging |

## What Makes This Code Clean

1. **Separation of Concerns**
   - Components only handle UI
   - Contexts handle state
   - Utils handle logic
   - Types handle contracts

2. **DRY Principle**
   - Components are reusable
   - Translations centralized
   - Constants defined once

3. **Type Safety**
   - No `any` types
   - All props typed
   - API contracts defined

4. **Scalability**
   - Easy to add new screens
   - Easy to add new components
   - Easy to add new languages

## Next Actions

To continue development:

1. **Install dependencies** (in a proper terminal)
2. **Set up Firebase project** (see backend/README.md)
3. **Update Firebase config** (frontend/src/config/firebase.ts)
4. **Run development server** (`npm run dev`)
5. **Test the flow** (Language → Role → Login → Profile → Home)

## Questions?

- Frontend details: See [frontend/README.md](frontend/README.md)
- Backend setup: See [backend/README.md](backend/README.md)
- Full guide: See [PROJECT_SETUP.md](PROJECT_SETUP.md)
- Original vision: See [readme.md](readme.md)

---

**You now have a solid foundation to build Labour Chowk!** 🏗️
