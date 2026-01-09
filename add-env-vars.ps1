# PowerShell script to add environment variables to Vercel
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# DATABASE_URL
Write-Host "`nAdding DATABASE_URL..." -ForegroundColor Yellow
$dbUrl = "postgresql://postgres.rzrxtersdpqwxealyzme:110043@vV110043@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
echo $dbUrl | vercel env add DATABASE_URL production

# JWT_SECRET
Write-Host "`nAdding JWT_SECRET..." -ForegroundColor Yellow
$jwtSecret = "labour_chowk_production_secret_2026_$(Get-Random -Maximum 999999)"
echo $jwtSecret | vercel env add JWT_SECRET production

# JWT_EXPIRE
Write-Host "`nAdding JWT_EXPIRE..." -ForegroundColor Yellow
echo "7d" | vercel env add JWT_EXPIRE production

# NODE_ENV
Write-Host "`nAdding NODE_ENV..." -ForegroundColor Yellow
echo "production" | vercel env add NODE_ENV production

# VITE_API_URL
Write-Host "`nAdding VITE_API_URL..." -ForegroundColor Yellow
echo "https://labour-chowk-six.vercel.app/api" | vercel env add VITE_API_URL production

Write-Host "`nAll environment variables added!" -ForegroundColor Green
Write-Host "Now redeploying..." -ForegroundColor Yellow
vercel --prod

Write-Host "`nDeployment complete! Visit https://labour-chowk-six.vercel.app" -ForegroundColor Green
