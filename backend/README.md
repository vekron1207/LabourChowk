# Labour Chowk - Backend

This directory contains Firebase configuration for the Labour Chowk application.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "Labour Chowk" or "labour-chowk"
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable "Phone" authentication provider
4. Configure phone authentication settings

### 3. Enable Firestore Database

1. In Firebase Console, go to Firestore Database
2. Click "Create Database"
3. Start in **production mode** (we have custom rules)
4. Choose a location closest to your users (e.g., asia-south1 for India)

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the configuration object
6. Update `frontend/src/config/firebase.ts` with your credentials

### 5. Deploy Firestore Rules

```bash
cd backend
firebase login
firebase use --add
# Select your project
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 6. Deploy to Firebase Hosting (Optional)

```bash
# Build the frontend first
cd ../frontend
npm run build

# Deploy
cd ../backend
firebase deploy --only hosting
```

## Firestore Data Structure

### Collections

#### users
- `id`: string (user ID)
- `phone`: string
- `role`: "labour" | "employer"
- `name`: string
- `language`: "hi" | "en"
- `location`: { lat: number, lng: number }
- `createdAt`: timestamp

#### labourProfiles
- `userId`: string
- `skills`: array of skill keys
- `dailyRate`: number
- `available`: boolean
- `updatedAt`: timestamp

#### jobs
- `id`: string
- `postedBy`: string (user ID)
- `skill`: skill key
- `rate`: number
- `location`: { lat: number, lng: number }
- `status`: "open" | "closed"
- `duration`: number (days)
- `createdAt`: timestamp
- `description`: string (optional)

## Security Rules

The Firestore rules are configured to:
- Allow anyone to read user profiles, labour profiles, and jobs (for browsing)
- Allow authenticated users to create/update only their own data
- Prevent deletion of user data
- Allow job posters to update/delete their own jobs

## Cost Optimization

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1GB storage

For a small pilot with 100 users, this should be sufficient.
