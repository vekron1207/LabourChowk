# Quick Start Guide

## Get Your App Running in 5 Minutes

### Step 1: Update PostgreSQL Password

1. Open `backend/api/.env`
2. Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password
3. Save the file

### Step 2: Setup Database

Open terminal and run:

```bash
cd backend/api
node setup-database.js
```

You should see:
```
Connected to PostgreSQL database
Setting up database schema...
Database schema created successfully!
Tables created:
- users
- labour_profiles
- jobs
- job_applications
- counter_offers
```

### Step 3: Start Backend

In the same terminal:

```bash
npm start
```

You should see:
```
Server is running on port 5000
Environment: development
Connected to PostgreSQL database
```

Keep this terminal running!

### Step 4: Start Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### Step 5: Test the App

1. Open your browser to `http://localhost:5173`
2. Select language (Hindi or English)
3. Select role (Labour or Employer)
4. You'll see the new Login screen with:
   - Phone number input
   - Password input
   - "Register" link

### Step 6: Create Your First User

1. Click "Register" (or "रजिस्टर करें" in Hindi)
2. Enter phone: `9876543210`
3. Enter password: `test123`
4. Confirm password: `test123`
5. Click "Register"
6. You should be logged in and redirected to profile setup!

### Step 7: Test Login

1. Logout (if there's a logout button) or open in incognito
2. Go through language and role selection
3. On login screen, enter:
   - Phone: `9876543210`
   - Password: `test123`
4. Click "Login"
5. You should be logged in!

## What Changed?

### Before (Firebase)
- Two-step OTP process
- SMS costs (10 free per day, then $0.01 each)
- Required Firebase Blaze plan
- reCAPTCHA verification
- Stuck at "Verifying..." if Firestore not enabled

### After (PostgreSQL)
- Simple phone + password login
- No SMS costs
- No Firebase billing
- No reCAPTCHA
- One-step login process
- Full control of your data

## Verification Checklist

✅ PostgreSQL database `lcdb` created
✅ Backend running on port 5000
✅ Frontend running on port 5173
✅ Can register new user
✅ Can login with credentials
✅ JWT token stored in localStorage
✅ Protected routes working

## Common Issues

### "Connection refused" Error

**Problem**: Can't connect to PostgreSQL

**Solution**:
1. Open pgAdmin or PostgreSQL
2. Verify database `lcdb` exists
3. Check PostgreSQL is running
4. Verify password in `.env` is correct

### "Port 5000 already in use"

**Problem**: Another app using port 5000

**Solution**:
1. Stop other app, or
2. Change PORT in `backend/api/.env` to 5001
3. Update `frontend/.env` VITE_API_URL to use new port

### Registration Shows "Phone number already registered"

**Problem**: You already registered this phone number

**Solution**: Use the Login screen instead, or register with different phone number

### Login Shows "Invalid phone number or password"

**Problem**: Wrong credentials

**Solution**: Double-check phone number and password, or register new account

## Testing Different Scenarios

### Test Registration

```bash
# Phone: 9111111111
# Password: labour123
# Role: Labour
```

### Test Login

```bash
# Use same phone/password from registration
```

### Test Different Roles

```bash
# Register as Labour: 9111111111
# Register as Employer: 9222222222
# Login as each to see different home screens
```

## Next Steps

Once authentication is working:

1. Complete profile setup
2. Test labour/employer home screens
3. Test job posting (employer)
4. Test browsing labour (employer)
5. Share app on network with friends!

## Quick Commands Reference

```bash
# Setup database
cd backend/api && node setup-database.js

# Start backend
cd backend/api && npm start

# Start frontend
cd frontend && npm run dev

# Check backend health
curl http://localhost:5000/api/health

# Build frontend for production
cd frontend && npm run build
```

## Success!

If you can register and login, your migration from Firebase to PostgreSQL is complete! 🎉

No more Firebase billing concerns, no more SMS costs, and you have full control over your authentication system.
