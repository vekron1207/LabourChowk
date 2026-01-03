# Labour Chowk - Frontend

React + Vite + TypeScript + Tailwind CSS Progressive Web App

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── SkillSelector.tsx
│   ├── LanguageToggle.tsx
│   └── ToggleSwitch.tsx
├── screens/          # Page components (routes)
│   ├── LanguageSelection.tsx
│   ├── RoleSelection.tsx
│   ├── Login.tsx
│   ├── ProfileSetup.tsx
│   └── LabourHome.tsx
├── contexts/         # React contexts
│   ├── LanguageContext.tsx
│   └── AuthContext.tsx
├── types/            # TypeScript definitions
│   └── index.ts
├── utils/            # Utilities and constants
│   ├── constants.ts
│   └── translations.ts
├── config/           # Configuration
│   └── firebase.ts
├── App.tsx           # Main app component with routing
├── main.tsx          # Entry point
└── index.css         # Global styles + Tailwind
```

## Key Features

### Bilingual Support
- Hindi and English translations
- Language persistence in localStorage
- Hindi font (Noto Sans Devanagari)

### Reusable Components
All components accept data as props for maximum reusability:

```tsx
// Button with variants and sizes
<Button variant="primary" size="large" fullWidth>
  Click Me
</Button>

// Input with validation
<Input
  label="Name"
  value={name}
  onChange={setName}
  error={error}
  required
/>

// Skill selector (multi-select)
<SkillSelector
  selectedSkills={skills}
  onToggle={handleToggle}
  language={language}
/>
```

### State Management
- **AuthContext** - User authentication state
- **LanguageContext** - App language preference

### Routing
React Router v6 with protected routes

### PWA Support
- Manifest configured
- Service worker ready
- Installable on mobile devices

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Styling

- **Tailwind CSS** for utility-first styling
- **Mobile-first** responsive design
- **Large touch targets** (44px minimum) for accessibility
- **Custom color palette** defined in tailwind.config.js

## TypeScript

Full TypeScript support with strict mode enabled. Types are defined in `src/types/index.ts`.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome 67+

## Build Output

- Optimized bundle with code splitting
- Minified CSS and JS
- Assets with cache busting
- Target: ES2015 for wider compatibility
