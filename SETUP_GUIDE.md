# Labour Chowk - Setup Guide

## PostgreSQL + Express Backend with Phone/Password Authentication

This guide will help you set up and run the Labour Chowk application with PostgreSQL database and Node.js Express backend.

## Prerequisites

- Node.js v16 or higher
- PostgreSQL installed and running
- npm or yarn package manager

## Database Setup

### 1. Update PostgreSQL Password

Edit the `.env` file in `backend/api/`:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/lcdb
```

Replace `YOUR_ACTUAL_PASSWORD` with your PostgreSQL password.

### 2. Initialize Database Schema

Run the setup script to create all required tables:

```bash
cd backend/api
node setup-database.js
```

This will create the following tables:
- `users` - User accounts with phone and password
- `labour_profiles` - Labour skill profiles
- `jobs` - Job postings
- `job_applications` - Job applications from labour
- `counter_offers` - Counter offer submissions

## Backend Setup

### 1. Install Dependencies

```bash
cd backend/api
npm install
```

### 2. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The API server will start on `http://localhost:5000`

### 3. Test the API

Health check endpoint:
```bash
curl http://localhost:5000/api/health
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Testing the Application

### 1. Open the App

Navigate to `http://localhost:5173` in your browser

### 2. Registration Flow

1. Select language (Hindi or English)
2. Select role (Labour or Employer)
3. Click "Register" on login screen
4. Enter phone number (10 digits)
5. Enter password (minimum 6 characters)
6. Confirm password
7. Click "Register"
8. Complete profile setup

### 3. Login Flow

1. Select language
2. Select role
3. Enter phone number
4. Enter password
5. Click "Login"

## API Endpoints

### Authentication

**POST `/api/auth/register`**
```json
{
  "phone": "9876543210",
  "password": "yourpassword",
  "role": "labour",
  "language": "hi"
}
```

**POST `/api/auth/login`**
```json
{
  "phone": "9876543210",
  "password": "yourpassword"
}
```

**GET `/api/auth/me`** (Protected)
- Requires: `Authorization: Bearer <token>` header

### Users

**PUT `/api/users/me`** (Protected)
```json
{
  "name": "John Doe",
  "language": "en",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  }
}
```

**GET `/api/users/:id`** (Protected)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('labour', 'employer')),
  name VARCHAR(255),
  language VARCHAR(2) DEFAULT 'hi',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication Flow

1. **Registration**: User provides phone + password → Backend hashes password with bcrypt → Creates user in PostgreSQL → Returns JWT token
2. **Login**: User provides credentials → Backend verifies password → Returns JWT token
3. **Session**: JWT token stored in localStorage → Sent in Authorization header → Backend verifies token → Returns user data

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Phone number validation (exactly 10 digits)
- Password minimum length (6 characters)
- Protected routes with JWT middleware
- SQL injection prevention with parameterized queries

## Environment Variables

### Backend (`backend/api/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/lcdb
JWT_SECRET=labour_chowk_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Connection Error

**Error**: `Connection refused` or `Authentication failed`

**Solution**:
1. Ensure PostgreSQL is running
2. Check username/password in DATABASE_URL
3. Verify database `lcdb` exists
4. Check PostgreSQL is listening on port 5432

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
1. Change PORT in `backend/api/.env`
2. Update VITE_API_URL in `frontend/.env`

### Frontend Cannot Connect to Backend

**Error**: `Network error` or `Failed to fetch`

**Solution**:
1. Ensure backend server is running (`npm start` in backend/api)
2. Check backend is running on http://localhost:5000
3. Verify CORS is configured correctly
4. Check browser console for errors

### Registration Fails

**Error**: `Phone number already registered`

**Solution**: User already exists. Use the login flow instead.

**Error**: `Password must be at least 6 characters`

**Solution**: Enter a longer password.

## Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/api/`
   - Server auto-reloads with nodemon
   - Check logs in terminal

2. **Frontend Changes**:
   - Edit files in `frontend/src/`
   - Page auto-reloads with Vite HMR
   - Check browser console

### Testing API with Thunder Client / Postman

1. **Register a User**:
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "phone": "9999999999",
     "password": "test123",
     "role": "labour",
     "language": "hi"
   }
   ```

2. **Login**:
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "phone": "9999999999",
     "password": "test123"
   }
   ```

3. **Get Current User** (use token from login response):
   ```
   GET http://localhost:5000/api/auth/me
   Authorization: Bearer <your_jwt_token>
   ```

## Production Deployment

### Backend Deployment

1. **Environment Variables**: Update `.env` with production values
2. **Database**: Use production PostgreSQL (AWS RDS, Railway, etc.)
3. **Security**: Change JWT_SECRET to a strong random string
4. **CORS**: Update allowed origins in `server.js`

### Frontend Deployment

1. **Build**: Run `npm run build` in frontend
2. **Deploy**: Deploy `dist/` folder to Vercel, Netlify, etc.
3. **Environment**: Set VITE_API_URL to production backend URL

## Next Steps

1. ✅ Authentication system working
2. ✅ User registration and login
3. ✅ Protected routes
4. 🔲 Complete profile setup integration
5. 🔲 Migrate jobs and labour profiles to PostgreSQL
6. 🔲 Add API endpoints for jobs CRUD
7. 🔲 Deploy to production

## Support

For issues or questions:
1. Check this guide first
2. Review error messages in terminal/browser console
3. Verify all setup steps completed correctly
4. Check PostgreSQL database status

## Benefits of PostgreSQL + Password Auth

✅ No SMS costs (no OTP)
✅ Simple one-step login
✅ Full control over data
✅ No Firebase billing required
✅ Standard authentication users understand
✅ Works offline with token cache
✅ No rate limits on authentication
