# Set Vercel Environment Variables

Your app is deployed at: **https://labour-chowk-six.vercel.app**

Now you need to add environment variables to Vercel. Here are two ways:

## Method 1: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/vekron1207s-projects/labour-chowk
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add these variables one by one:

### Variable 1: DATABASE_URL
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://postgres.rzrxtersdpqwxealyzme:110043@vV110043@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres`
- **Environment**: Production (check the box)
- Click "Save"

### Variable 2: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: `labour_chowk_production_secret_2026_change_this_to_something_random`
- **Environment**: Production
- Click "Save"

### Variable 3: JWT_EXPIRE
- **Name**: `JWT_EXPIRE`
- **Value**: `7d`
- **Environment**: Production
- Click "Save"

### Variable 4: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production
- Click "Save"

### Variable 5: VITE_API_URL
- **Name**: `VITE_API_URL`
- **Value**: `https://labour-chowk-six.vercel.app/api`
- **Environment**: Production
- Click "Save"

## Method 2: Using Vercel CLI

Run these commands in PowerShell (answer 'y' for sensitive when asked):

```powershell
cd "f:\Work\Labour Chowk"

# Add DATABASE_URL
vercel env add DATABASE_URL production
# When prompted, paste: postgresql://postgres.rzrxtersdpqwxealyzme:110043@vV110043@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres

# Add JWT_SECRET
vercel env add JWT_SECRET production
# When prompted, paste: labour_chowk_production_secret_2026_change_this_to_something_random

# Add JWT_EXPIRE
vercel env add JWT_EXPIRE production
# When prompted, paste: 7d

# Add NODE_ENV
vercel env add NODE_ENV production
# When prompted, paste: production

# Add VITE_API_URL
vercel env add VITE_API_URL production
# When prompted, paste: https://labour-chowk-six.vercel.app/api
```

## After Adding Environment Variables

Redeploy your app to apply the changes:

```bash
cd "f:\Work\Labour Chowk"
vercel --prod
```

Or just push to GitHub and it will auto-deploy:

```bash
git push origin main
```

## Test Your Deployment

Visit: https://labour-chowk-six.vercel.app

Try:
1. Register a new account
2. Login
3. Check that data persists

Your app will now automatically redeploy every time you push to the `main` branch on GitHub!
