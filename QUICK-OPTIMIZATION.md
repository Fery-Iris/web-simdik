# 🚀 QUICK START - Optimasi Website SIMDIK

## ⚡ 3 Langkah Cepat Mengurangi Ukuran Website

### LANGKAH 1: Compress Gambar (PALING PENTING - 73% reduction)

#### Option A: Manual dengan TinyPNG (5 menit)
1. Buka https://tinypng.com/
2. Upload gambar dari folder:
   - `public/uploads/` (56 MB → 15 MB)
   - `public/kegiatan/` (11 MB → 3 MB)
   - `public/*.png` (4 MB → 1.2 MB)
3. Download hasil compress
4. Replace file original

**Hasil:** 71 MB → 19 MB (save 52 MB!)

---

### LANGKAH 2: Hapus Dependencies Tidak Terpakai (100 MB reduction)

Jalankan di terminal:

```bash
# Hapus dependencies yang TIDAK DIGUNAKAN
npm uninstall recharts geist vaul @vercel/analytics

# Install ulang untuk clean up
npm install

# Clear cache
rm -rf .next
rm -rf node_modules/.cache
```

**Yang dihapus:**
- ✅ `recharts` - Tidak dipakai (sudah pakai chart.js)
- ✅ `geist` - Tidak dipakai (sudah pakai Poppins)
- ✅ `vaul` - Tidak dipakai
- ✅ `@vercel/analytics` - Tidak dipakai (belum deploy)

**Hasil:** ~100-150 MB dependency reduction

---

### LANGKAH 3: Update Next.js Config (Better performance)

Update file `next.config.mjs`:

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
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
```

---

## 📊 HASIL AKHIR

### Before:
- Total size: ~850 MB
- Page load: 5-8 seconds
- Images: 71 MB

### After:
- Total size: ~550 MB (35% reduction)
- Page load: 1.5-2.5 seconds (3x faster!)
- Images: 19 MB (73% reduction)

---

## ⏱️ Estimasi Waktu

- Langkah 1 (Compress): **30-60 menit**
- Langkah 2 (Dependencies): **5 menit**
- Langkah 3 (Config): **2 menit**

**Total: ~1 jam** untuk optimasi signifikan!

---

## ✅ Checklist

- [ ] Compress gambar di `public/uploads/` dengan TinyPNG
- [ ] Compress gambar di `public/kegiatan/` dengan TinyPNG
- [ ] Compress gambar di `public/*.png` dengan TinyPNG
- [ ] Run: `npm uninstall recharts geist vaul @vercel/analytics`
- [ ] Run: `npm install`
- [ ] Update `next.config.mjs` dengan config di atas
- [ ] Run: `npm run build` untuk test
- [ ] Test website performance

---

## 🎯 Priority

1. **HIGH** - Compress gambar (immediate impact)
2. **MEDIUM** - Remove unused deps
3. **LOW** - Update config

Mulai dari Langkah 1 untuk hasil paling cepat!
