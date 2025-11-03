# Complete Prisma Client Fix Script
Write-Host "🧹 Starting complete Prisma client fix..." -ForegroundColor Cyan

# Step 1: Kill all Node processes
Write-Host "`n📌 Step 1: Killing Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Step 2: Delete all Prisma cache and client
Write-Host "`n📌 Step 2: Deleting Prisma cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .\node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\node_modules\@prisma\client -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.next -ErrorAction SilentlyContinue
Write-Host "✅ Deleted Prisma cache" -ForegroundColor Green

# Step 3: Reinstall Prisma Client
Write-Host "`n📌 Step 3: Reinstalling Prisma Client..." -ForegroundColor Yellow
npm install @prisma/client@6.17.1 --force
Write-Host "✅ Reinstalled Prisma Client" -ForegroundColor Green

# Step 4: Generate Prisma Client
Write-Host "`n📌 Step 4: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Generated Prisma Client" -ForegroundColor Green

# Step 5: Verify
Write-Host "`n📌 Step 5: Verifying..." -ForegroundColor Yellow
if (Test-Path ".\node_modules\@prisma\client\index.d.ts") {
    Write-Host "✅ Prisma Client exists" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma Client not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Complete! Now run 'npm run dev'" -ForegroundColor Green

