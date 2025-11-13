# 🖼️ Panduan Optimasi Gambar Website SIMDIK

## Masalah
Website berat karena gambar berukuran besar (total ~71 MB di public folder)

## Solusi

### A. MANUAL - Menggunakan Tools Online (MUDAH)
1. **TinyPNG** (https://tinypng.com/)
   - Upload gambar PNG/JPG
   - Reduce hingga 70-80% tanpa kehilangan kualitas visual
   - Download hasil compress

2. **Squoosh** (https://squoosh.app/)
   - Tools dari Google
   - Bisa compare before/after
   - Support WebP format (lebih ringan)

### B. OTOMATIS - Menggunakan Next.js Image Component

#### 1. Install sharp (image optimization library)
```bash
npm install sharp
```

#### 2. Update next.config.mjs
Tambahkan konfigurasi image:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
}

export default nextConfig
```

#### 3. Ganti <img> dengan <Image> dari Next.js
Contoh:
```tsx
// BEFORE
<img src="/kegiatan/digital-1.png" alt="..." />

// AFTER
import Image from 'next/image'
<Image 
  src="/kegiatan/digital-1.png" 
  alt="..." 
  width={800} 
  height={600}
  quality={85}
  loading="lazy"
/>
```

### C. BATCH COMPRESS - Menggunakan Script

#### 1. Install imagemin
```bash
npm install --save-dev imagemin imagemin-pngquant imagemin-mozjpeg
```

#### 2. Buat script compress
File: `scripts/compress-images.js`
```javascript
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async () => {
  // Compress images di folder kegiatan
  await imagemin(['public/kegiatan/*.{jpg,png}'], {
    destination: 'public/kegiatan-compressed',
    plugins: [
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminMozjpeg({ quality: 85 })
    ]
  });

  // Compress images di folder uploads
  await imagemin(['public/uploads/**/*.{jpg,png}'], {
    destination: 'public/uploads-compressed',
    plugins: [
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminMozjpeg({ quality: 85 })
    ]
  });

  console.log('✅ Images compressed!');
})();
```

#### 3. Jalankan script
```bash
node scripts/compress-images.js
```

### D. CONVERT KE WebP (Format Lebih Modern)

WebP 25-35% lebih kecil dari PNG/JPG dengan kualitas sama.

#### Using cwebp (Command line)
```bash
# Install cwebp
# Windows: Download dari https://developers.google.com/speed/webp/download

# Convert single file
cwebp input.png -q 80 -o output.webp

# Batch convert (PowerShell)
Get-ChildItem -Path "public/kegiatan" -Filter "*.png" | ForEach-Object {
  cwebp $_.FullName -q 80 -o ($_.FullName -replace '.png', '.webp')
}
```

## Target Optimasi

### File Priority (Paling Besar):
1. ✅ `/public/uploads/` - 56 MB → Target: **15 MB** (reduce 73%)
2. ✅ `/public/kegiatan/` - 11 MB → Target: **3 MB** (reduce 72%)
3. ✅ `/public/*.png` - 4 MB → Target: **1.2 MB** (reduce 70%)

**Total savings: ~50 MB (70% reduction)**

## Best Practices

1. **Ukuran Maksimal Per Gambar:**
   - Hero images: 200-300 KB (WebP) / 400-600 KB (JPG)
   - Thumbnail: 50-100 KB
   - Icons: 20-50 KB

2. **Resolusi:**
   - Web standard: 1920x1080px max
   - Thumbnail: 400x300px
   - Mobile: 800x600px

3. **Format:**
   - WebP untuk web modern
   - JPG untuk foto
   - PNG untuk logo/icon dengan transparency
   - SVG untuk vector graphics

4. **Lazy Loading:**
   Selalu gunakan `loading="lazy"` untuk gambar di bawah fold

5. **Responsive Images:**
   Gunakan srcset untuk serve different sizes:
   ```html
   <img 
     srcset="image-small.webp 400w, image-large.webp 800w"
     sizes="(max-width: 600px) 400px, 800px"
     src="image-large.webp"
   />
   ```

## Checklist Optimasi

- [ ] Compress semua gambar di `/public/kegiatan/`
- [ ] Compress semua gambar di `/public/uploads/`
- [ ] Compress gambar di `/public/` root
- [ ] Convert ke WebP format
- [ ] Update code untuk gunakan Next.js Image component
- [ ] Test website speed setelah optimasi
- [ ] Implement lazy loading
- [ ] Add image size validation di upload form (max 500KB)

## Tools Rekomendasi

1. **TinyPNG** - https://tinypng.com/ (Paling mudah)
2. **Squoosh** - https://squoosh.app/ (Advanced options)
3. **ImageOptim** - https://imageoptim.com/ (Mac only)
4. **RIOT** - https://riot-optimizer.com/ (Windows)
5. **Sharp** - npm package untuk Node.js automation

## Expected Results

**Before:** ~71 MB total images
**After:** ~20 MB total images
**Improvement:** 72% size reduction
**Page Load:** 3-5x faster

## Notes

⚠️ **PENTING:** 
- Backup gambar original sebelum compress
- Test visual quality setelah compress
- Jangan compress gambar yang sudah WebP
- Untuk upload user, implement size limit di backend
