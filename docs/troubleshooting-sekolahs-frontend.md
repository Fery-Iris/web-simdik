# Troubleshooting - Direktori Sekolah Frontend

## ❌ Masalah: Data Tidak Muncul di Frontend

### Diagnosis

Jika data sekolah sudah ada di admin panel tetapi tidak muncul di frontend `/direktori-sekolah`, lakukan langkah berikut:

## 🔍 Step 1: Cek API Response

### Test API Endpoint
```bash
# PowerShell
curl http://localhost:3000/api/sekolahs

# Atau buka di browser
http://localhost:3000/api/sekolahs
```

### Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nama": "SD Islam Al-Azhar",
      "alamat": "Jl. A. Yani Km. 4.5",
      "kecamatan": "Banjarmasin Selatan",
      "jenjang": "SD",
      "akreditasi": "A",
      "status": "Swasta",
      "telepon": "0511-1234567",
      "email": "sdislam@example.com",
      "tahunBerdiri": "1990",
      "deskripsi": "...",
      "gambarUtama": "/uploads/sekolahs/...",
      "foto1": "/uploads/sekolahs/...",
      "foto2": "/uploads/sekolahs/..."
    }
  ]
}
```

### ❌ Jika Response Error
- Check console for error messages
- Verify Prisma client is generated: `npx prisma generate`
- Check database connection in `.env`

## 🔍 Step 2: Cek Browser Console

1. Buka frontend: `http://localhost:3000/direktori-sekolah`
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for API request

### Common Console Errors

#### Error: "Gagal mengambil data sekolah"
```typescript
// Check if API is returning correct format
// Frontend expects: { success: true, data: [...] }
```

#### Error: "result.data is undefined"
```typescript
// API response format mismatch
// Verify API route.ts returns:
{
  success: true,
  data: serialized
}
```

## 🔍 Step 3: Clear Cache

### Browser Cache
```
1. Hard Refresh: Ctrl + Shift + R (Windows/Linux)
2. Clear Cache: Ctrl + Shift + Delete
3. Or: DevTools > Network > Disable cache (checkbox)
```

### Next.js Cache
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

## 🔍 Step 4: Verify Database

### Check Data in Supabase
```sql
-- Run in Supabase SQL Editor
SELECT * FROM sekolahs ORDER BY created_at DESC;
```

### Expected Columns
- `id_sekolahs` (BIGINT)
- `nama` (VARCHAR)
- `alamat`, `kecamatan`, `jenjang`, `akreditasi`, `status`
- `telepon`, `email`, `tahun_berdiri`
- `deskripsi`
- `gambar_utama`, `foto_1`, `foto_2`
- `created_at`, `updated_at`

## 🔍 Step 5: Verify Prisma Schema

### Check schema.prisma
```prisma
model Sekolah {
  id           BigInt   @id @default(autoincrement()) @map("id_sekolahs")
  nama         String   @db.VarChar(255)
  alamat       String?  @db.Text
  // ... other fields
  gambarUtama  String?  @map("gambar_utama")
  foto1        String?  @map("foto_1")
  foto2        String?  @map("foto_2")
  
  @@map("sekolahs")
}
```

### Regenerate Prisma Client
```bash
npx prisma generate
```

## 🔍 Step 6: Check Frontend Code

### Verify API Call in page.tsx
```typescript
useEffect(() => {
  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/sekolahs")
      const result = await response.json()
      
      console.log("API Response:", result) // Add this for debugging
      
      if (result.success && result.data) {
        setSchools(result.data)
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }
  fetchSchools()
}, [])
```

## ✅ Solutions Applied

### Fix 1: API Response Format
**Problem**: API returned array directly instead of `{ success, data }`

**Solution**: Updated `app/api/sekolahs/route.ts`
```typescript
// Before
return NextResponse.json(serialized)

// After
return NextResponse.json({
  success: true,
  data: serialized
})
```

### Fix 2: Frontend Data Handling
**Problem**: Frontend expects `result.data` but API returns direct array

**Solution**: Updated frontend to check `result.success && result.data`
```typescript
if (result.success && result.data) {
  setSchools(result.data)
}
```

### Fix 3: Admin Panel Fetch
**Problem**: Admin also needs to handle new response format

**Solution**: Updated `app/admin/schools/page.tsx`
```typescript
const result = await response.json()
if (result.success && result.data) {
  setSekolahList(result.data)
}
```

## 🧪 Testing Checklist

- [ ] API endpoint returns `{ success: true, data: [...] }`
- [ ] Frontend console shows no errors
- [ ] Data count matches admin panel (e.g., 4 schools)
- [ ] School cards display correctly
- [ ] Images show (or placeholder if no image)
- [ ] Search works
- [ ] Filters work (jenjang, kecamatan)
- [ ] Pagination works (if >9 items)
- [ ] Click "Lihat Detail" opens detail page
- [ ] Detail page shows all info
- [ ] Back button works

## 🚀 Quick Fix Commands

```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart dev server
npm run dev

# 4. Test API
curl http://localhost:3000/api/sekolahs

# 5. Hard refresh browser
# Press: Ctrl + Shift + R
```

## 📞 Still Not Working?

1. Check terminal for server errors
2. Check browser console for client errors
3. Verify `.env` database connection
4. Run SQL script in Supabase: `scripts/setup-sekolahs-table.sql`
5. Ensure admin panel can create/read schools
6. Check file permissions for `/public/uploads/sekolahs/`

## 📝 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "0 sekolah" shown | API not returning data | Check API response format |
| Loading forever | API error/timeout | Check server console |
| Images not showing | Wrong path or upload failed | Check `/uploads/sekolahs/` folder |
| Filter not working | Data type mismatch | Check jenjang/kecamatan values |
| "Tidak ada data sekolah" | Empty database | Add schools in admin panel |

## 🎯 Expected Behavior

1. **Frontend loads** → Shows loading spinner
2. **API fetches data** → Returns 4 schools
3. **Data renders** → Shows 4 cards in grid
4. **Search/filter** → Updates results
5. **Click detail** → Opens detail page with full info

If this flow breaks anywhere, check the corresponding step above.

