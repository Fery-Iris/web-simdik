# 📦 ANALISIS UKURAN DAN OPTIMASI WEBSITE SIMDIK

## 📊 Hasil Analisis Ukuran File

### Total Ukuran:
- **node_modules**: 700 MB (NORMAL)
- **.next (build)**: 63 MB (NORMAL)
- **public/uploads**: 56.2 MB ⚠️ **TERLALU BESAR**
- **public/kegiatan**: 11 MB ⚠️ **TERLALU BESAR**
- **public (root)**: 4 MB (OK)

---

## 🔴 MASALAH UTAMA

### 1. Gambar Tidak Teroptimasi (71 MB total)

**File Terbesar di `/public/uploads/`:**
- sekolah-1762173059351-xb4t82.png - 3.51 MB
- agenda-1762172546759-43evba.png - 3.36 MB
- agenda-1761634021127-l1ozjk.jpg - 3.28 MB
- agenda-1762164686526-9eg7wv.png - 3.25 MB
- berita-1762178327366-7scti1.png - 3.13 MB
- + 40 file lainnya (1-3 MB each)

**File di `/public/kegiatan/`:**
- digital-2.png - 968 KB
- digital-1.png - 939 KB
- evaluasi-1.png - 904 KB
- beasiswa-1.png - 857 KB
- sistem-3.png - 859 KB
- + 13 file lainnya

**File di `/public/` root:**
- teachers-digital-training.png - 947 KB
- school-discussion-forum.png - 908 KB
- scholarship-presentation.png - 904 KB
- education-officials-evaluation.png - 816 KB
- curriculum-discussion.png - 661 KB

### 2. Dependencies Duplikat/Tidak Terpakai

**Potential Redundancy:**
- ✅ `chart.js` + `recharts` - Dua library chart (pilih salah satu)
- ✅ `geist` - Font yang tidak dipakai (sudah pakai Poppins)
- ⚠️ `@vercel/analytics` - Hanya perlu jika deploy di Vercel
- ⚠️ `vaul`, `input-otp`, `cmdk` - Perlu cek apakah terpakai

---

## 🚀 SOLUSI DAN REKOMENDASI

### A. OPTIMASI GAMBAR (PRIORITAS TINGGI)

#### Target Pengurangan:
```
public/uploads:  56 MB → 15 MB (reduce 73%)
public/kegiatan: 11 MB → 3 MB (reduce 72%)
public root:     4 MB → 1.2 MB (reduce 70%)
----------------------------------------
TOTAL SAVINGS:   71 MB → 19.2 MB (reduce 73%)
```

#### Cara 1: Manual dengan TinyPNG (TERMUDAH)
1. Buka https://tinypng.com/
2. Upload gambar (max 20 files per batch)
3. Download hasil compress
4. Replace file original

#### Cara 2: Batch Compress dengan Script
```bash
# Install dependencies
npm install --save-dev imagemin imagemin-pngquant imagemin-mozjpeg

# Jalankan script
node scripts/compress-images.js
```

#### Cara 3: Next.js Image Optimization
Update code untuk gunakan `<Image>` component dari Next.js:
```tsx
// SEBELUM
<img src="/kegiatan/digital-1.png" alt="Digital Training" />

// SESUDAH
import Image from 'next/image'
<Image 
  src="/kegiatan/digital-1.png" 
  alt="Digital Training"
  width={800}
  height={600}
  quality={85}
  loading="lazy"
/>
```

### B. HAPUS DEPENDENCIES TIDAK TERPAKAI

#### 1. Check dependencies yang benar-benar tidak terpakai:
```bash
npx depcheck
```

#### 2. Hapus dependencies yang tidak perlu:
```bash
# Jika hanya pakai chart.js (bukan recharts)
npm uninstall recharts

# Jika tidak pakai font geist
npm uninstall geist

# Jika tidak deploy di Vercel
npm uninstall @vercel/analytics

# Setelah hapus, install ulang
npm install
```

#### 3. Pilih satu library chart:
**Rekomendasi:** Pakai `chart.js` saja (sudah digunakan di dashboard)
```bash
npm uninstall recharts
```

### C. TAMBAHKAN IMAGE SIZE LIMIT DI UPLOAD

#### Update form upload untuk limit ukuran file:
```tsx
// Tambahkan validasi di form
const MAX_FILE_SIZE = 500 * 1024; // 500KB

const handleImageUpload = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error('Ukuran gambar maksimal 500KB. Silakan compress terlebih dahulu.');
    return;
  }
  // ... upload logic
}
```

### D. ENABLE COMPRESSION DI NEXT.JS

#### Update `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // Enable gzip compression
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
}

export default nextConfig
```

### E. LAZY LOAD IMAGES

Pastikan semua gambar di bawah fold menggunakan lazy loading:
```tsx
<Image 
  src="..." 
  alt="..."
  loading="lazy" // ← Penting!
/>
```

---

## 📝 CHECKLIST OPTIMASI

### Immediate Actions (Sekarang):
- [ ] Compress semua gambar di `public/kegiatan/` dengan TinyPNG
- [ ] Compress semua gambar di `public/uploads/` dengan TinyPNG
- [ ] Compress gambar di `public/` root dengan TinyPNG
- [ ] Replace file original dengan hasil compress

### Code Changes (Development):
- [ ] Update all `<img>` tags dengan Next.js `<Image>` component
- [ ] Add `loading="lazy"` untuk semua images
- [ ] Update `next.config.mjs` dengan image optimization config
- [ ] Add file size validation di upload forms (max 500KB)

### Dependencies (Clean up):
- [ ] Run `npx depcheck` untuk cek unused dependencies
- [ ] Remove `recharts` (jika tidak dipakai)
- [ ] Remove `geist` (jika hanya pakai Poppins)
- [ ] Remove `@vercel/analytics` (jika tidak deploy di Vercel)
- [ ] Run `npm install` setelah uninstall

### Testing:
- [ ] Test website speed dengan Google PageSpeed Insights
- [ ] Test loading time di slow 3G connection
- [ ] Verify semua gambar masih tampil dengan baik
- [ ] Check bundle size: `npm run build`

---

## 📈 EXPECTED IMPROVEMENTS

### Before Optimization:
- **Images:** 71 MB
- **Page Load:** ~5-8 seconds
- **Lighthouse Score:** ~40-60

### After Optimization:
- **Images:** ~19 MB (73% reduction)
- **Page Load:** ~1.5-2.5 seconds (3-4x faster)
- **Lighthouse Score:** ~80-95

---

## 🛠️ TOOLS & RESOURCES

### Image Compression:
1. **TinyPNG** - https://tinypng.com/ (Paling mudah)
2. **Squoosh** - https://squoosh.app/ (Advanced)
3. **ImageOptim** - https://imageoptim.com/ (Mac)
4. **RIOT** - https://riot-optimizer.com/ (Windows)

### Performance Testing:
1. **Google PageSpeed Insights** - https://pagespeed.web.dev/
2. **GTmetrix** - https://gtmetrix.com/
3. **WebPageTest** - https://www.webpagetest.org/

### Dependency Analysis:
```bash
# Check unused dependencies
npx depcheck

# Check bundle size
npm run build

# Analyze bundle
npx next-bundle-analyzer
```

---

## ⚠️ CATATAN PENTING

1. **BACKUP** gambar original sebelum compress
2. Compress dengan quality 80-85% untuk balance size vs quality
3. Test visual quality setelah compress
4. Untuk production, consider CDN untuk serve images
5. Implement progressive image loading
6. Monitor website speed setelah optimasi

---

## 🎯 PRIORITY ORDER

1. **HIGH PRIORITY** - Compress gambar (immediate 73% size reduction)
2. **MEDIUM PRIORITY** - Update code dengan Next.js Image component
3. **LOW PRIORITY** - Clean up unused dependencies

**Estimasi waktu:** 2-4 jam untuk optimasi penuh
**Expected improvement:** 3-4x faster page load
