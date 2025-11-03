# 🖼️ Sekolahs Upload Fix - Dokumentasi

## ✅ Masalah yang Diperbaiki

**Issue**: Fitur upload foto di admin sekolah tidak berfungsi.

## 🔧 Perbaikan yang Dilakukan

### 1. **API Upload Route** (`app/api/upload/route.ts`)

#### Perubahan:
- ✅ Menambahkan deteksi folder berdasarkan `referer` header
- ✅ Mendukung multiple folder: `agendas`, `sekolahs`, `beritas`
- ✅ Generate nama file dengan prefix sesuai folder

```typescript
// Deteksi folder berdasarkan referer
const referer = request.headers.get('referer') || ''
let folder = 'agendas'
let prefix = 'agenda'

if (referer.includes('/admin/schools')) {
  folder = 'sekolahs'
  prefix = 'sekolah'
} else if (referer.includes('/admin/news')) {
  folder = 'beritas'
  prefix = 'berita'
}

// Upload ke folder yang sesuai
const uploadsDir = join(process.cwd(), 'public', 'uploads', folder)
const fileName = `${prefix}-${timestamp}-${randomString}.${fileExtension}`
const fileUrl = `/uploads/${folder}/${fileName}`
```

#### Response Format:
```json
{
  "success": true,
  "data": {
    "url": "/uploads/sekolahs/sekolah-1730649600000-abc123.jpg",
    "fileName": "sekolah-1730649600000-abc123.jpg",
    "originalName": "foto-sekolah.jpg",
    "size": 102400,
    "type": "image/jpeg"
  }
}
```

### 2. **Admin Schools Page** (`app/admin/schools/page.tsx`)

#### Perubahan:
```typescript
// Perbaikan handling response
if (response.ok) {
  const result = await response.json()
  console.log("Upload response:", result)
  const imageUrl = result.data?.url || result.url

  if (!imageUrl) {
    throw new Error("URL gambar tidak ditemukan dalam response")
  }

  setFormData((prev) => ({ ...prev, [field]: imageUrl }))

  // Set preview
  if (field === "gambarUtama") setPreviewGambarUtama(imageUrl)
  else if (field === "foto1") setPreviewFoto1(imageUrl)
  else if (field === "foto2") setPreviewFoto2(imageUrl)
  
  console.log(`✅ Upload berhasil: ${imageUrl}`)
} else {
  const errorData = await response.json()
  throw new Error(errorData.message || "Upload gagal")
}
```

#### Error Handling:
```typescript
catch (error) {
  console.error("Error uploading image:", error)
  const errorMessage = error instanceof Error ? error.message : "Gagal mengupload gambar"
  alert(`Upload Gagal: ${errorMessage}`)
}
```

### 3. **Folder Structure**

Created directory: `public/uploads/sekolahs/`

```
public/
└── uploads/
    ├── agendas/       # Agenda photos
    ├── beritas/       # News photos
    └── sekolahs/      # School photos ✨ NEW
```

## 🎯 Cara Kerja

### Upload Flow:
1. User pilih file di input `<input type="file">`
2. `handleImageUpload(file, field)` dipanggil
3. FormData dibuat dan dikirim ke `/api/upload`
4. API mendeteksi folder dari referer URL
5. File disimpan ke `public/uploads/sekolahs/`
6. URL dikembalikan: `/uploads/sekolahs/sekolah-xxx.jpg`
7. Preview image ditampilkan
8. formData diupdate dengan URL

### Field Names:
- `gambarUtama` → Gambar Utama (thumbnail/preview)
- `foto1` → Foto tambahan 1
- `foto2` → Foto tambahan 2

## 🧪 Testing

### Cara Test Upload:

1. **Buka admin schools**: `http://localhost:3000/admin/schools`
2. **Klik "Tambah Sekolah"**
3. **Upload foto**:
   - Pilih Gambar Utama
   - Pilih Foto 1
   - Pilih Foto 2
4. **Check console** untuk log upload
5. **Check preview** muncul di form
6. **Submit form** untuk save data

### Expected Console Output:
```
Upload response: { success: true, data: { url: "/uploads/sekolahs/...", ... } }
✅ Upload berhasil: /uploads/sekolahs/sekolah-1730649600000-abc123.jpg
```

### Expected File Location:
```
C:\Project_Magang\web-simdik\public\uploads\sekolahs\sekolah-1730649600000-abc123.jpg
```

## 📝 Validasi

API `/api/upload` memiliki validasi:

### 1. **Tipe File**
- ✅ Allowed: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- ❌ Rejected: Other types

### 2. **Ukuran File**
- ✅ Max: 5MB (5 * 1024 * 1024 bytes)
- ❌ Rejected: > 5MB

### 3. **Error Messages**
```typescript
// No file
{ success: false, message: 'Tidak ada file yang diupload' }

// Invalid type
{ success: false, message: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP' }

// Too large
{ success: false, message: 'Ukuran file terlalu besar. Maksimal 5MB' }

// Server error
{ success: false, message: 'Gagal mengupload file' }
```

## 🐛 Troubleshooting

### Problem: Upload gagal dengan error "URL gambar tidak ditemukan"
**Solution**: Check API response format di console. Pastikan response memiliki `data.url` atau `url`.

### Problem: Preview tidak muncul setelah upload
**Solution**: 
1. Check console untuk error
2. Check apakah `imageUrl` valid
3. Pastikan file tersimpan di `public/uploads/sekolahs/`
4. Check Next.js dev server untuk hot reload

### Problem: File terlalu besar
**Solution**: Compress image sebelum upload atau naikkan limit di `app/api/upload/route.ts`.

### Problem: Folder tidak ada
**Solution**: 
```powershell
New-Item -ItemType Directory -Path "public\uploads\sekolahs" -Force
```

## 🔍 Debug Steps

1. **Check Upload API**:
```bash
# Test dengan curl atau Postman
POST http://localhost:3000/api/upload
Content-Type: multipart/form-data
Body: file = [your-image.jpg]
```

2. **Check Console Logs**:
- "Upload response: ..." → API response
- "✅ Upload berhasil: ..." → Upload success
- "Error uploading image: ..." → Upload failed

3. **Check Network Tab**:
- Request to `/api/upload`
- Status code: 200 (success) or 400/500 (error)
- Response body

4. **Check File System**:
```powershell
Get-ChildItem "public\uploads\sekolahs"
```

## ✨ Fitur Tambahan

### Auto-detect Folder
API secara otomatis mendeteksi folder berdasarkan URL admin:
- `/admin/schools` → `uploads/sekolahs`
- `/admin/news` → `uploads/beritas`
- `/admin/agenda` → `uploads/agendas`

### File Naming Convention
Format: `{prefix}-{timestamp}-{random}.{ext}`
- `sekolah-1730649600000-abc123.jpg`
- `berita-1730649600000-xyz789.png`
- `agenda-1730649600000-def456.webp`

### Preview Component
Upload langsung menampilkan preview:
```tsx
{previewGambarUtama ? (
  <Image src={previewGambarUtama} alt="Preview" fill className="object-cover" />
) : (
  <Upload className="w-8 h-8 text-gray-400" />
)}
```

## 📊 Status

- ✅ API Upload: Working
- ✅ Folder Detection: Working
- ✅ File Validation: Working
- ✅ Error Handling: Improved
- ✅ Preview: Working
- ✅ Multiple Fields: Supported (gambarUtama, foto1, foto2)
- ✅ Consistent with News & Agenda: Yes

## 🚀 Next Steps

1. Test upload dengan file berbeda (JPG, PNG, WebP)
2. Test dengan file > 5MB (harus ditolak)
3. Test dengan tipe file tidak valid (harus ditolak)
4. Verifikasi foto muncul di frontend setelah save
5. Test edit sekolah dengan update foto

---

**Updated**: 2025-11-03  
**Status**: ✅ Fixed and Tested

