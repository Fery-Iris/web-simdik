# Complete clean restart script for fixing Prisma cache issues

Write-Host "🧹 Starting complete cleanup..." -ForegroundColor Cyan

# Step 1: Stop any running Next.js processes
Write-Host "1. Stopping Next.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*web-simdik*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Step 2: Remove Next.js cache
Write-Host "2. Removing Next.js cache (.next folder)..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Step 3: Remove Prisma cache
Write-Host "3. Removing Prisma cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Step 4: Regenerate Prisma Client
Write-Host "4. Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Cyan
Write-Host ""

