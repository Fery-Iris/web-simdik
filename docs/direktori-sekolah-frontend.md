# Direktori Sekolah Frontend - Dokumentasi

## 📋 Overview

Halaman frontend direktori sekolah yang menampilkan data sekolah dari admin panel dengan fitur pencarian, filter, dan pagination.

## 🎯 Features

### 1. **Halaman Listing** (`/direktori-sekolah`)
- ✅ Fetch data dari API `/api/sekolahs`
- ✅ Search by nama sekolah
- ✅ Filter by jenjang (PAUD, SD, SMP)
- ✅ Filter by kecamatan (dynamic dari data)
- ✅ Pagination (9 items per page)
- ✅ Loading state
- ✅ Error handling
- ✅ Empty state dengan reset filter
- ✅ Card dengan gambar, badges, dan info kontak
- ✅ Responsive grid layout

### 2. **Halaman Detail** (`/direktori-sekolah/[id]`)
- ✅ Fetch single school by ID
- ✅ Hero image (gambar utama)
- ✅ Full school information
- ✅ Gallery (foto 1, foto 2)
- ✅ Contact info sidebar
- ✅ Quick stats card
- ✅ Back button
- ✅ Loading & error states

## 📊 Data Structure

```typescript
interface Sekolah {
  id: string                 // BigInt converted to string
  nama: string              // School name
  alamat?: string           // Full address
  kecamatan?: string        // District
  jenjang?: string          // PAUD | SD | SMP
  akreditasi?: string       // A | B | C
  status?: string           // Negeri | Swasta
  telepon?: string          // Phone number
  email?: string            // Email address
  tahunBerdiri?: string     // Founding year
  deskripsi?: string        // Description
  gambarUtama?: string      // Main image path
  foto1?: string            // Gallery photo 1
  foto2?: string            // Gallery photo 2
}
```

## 🎨 UI Components

### Listing Page
1. **Hero Section**: Title dan deskripsi
2. **Filters Card**: 
   - Search input (by nama)
   - Jenjang dropdown
   - Kecamatan dropdown (dynamic)
3. **Results Grid**: 3 columns responsive
4. **School Card**:
   - Image/placeholder
   - Nama sekolah
   - Badges (jenjang, akreditasi, status)
   - Alamat (dengan icon)
   - Telepon (dengan icon)
   - Email (dengan icon)
   - "Lihat Detail" button
5. **Pagination**: Dengan ellipsis

### Detail Page
1. **Back Button**: Kembali ke listing
2. **Main Content** (2/3 width):
   - Hero image
   - School info card
   - Tentang sekolah
   - Galeri foto (2 columns)
3. **Sidebar** (1/3 width):
   - Contact info card
   - Quick stats card

## 🎨 Badge Colors

### Akreditasi
- **A**: Green (`bg-green-100 text-green-800`)
- **B**: Blue (`bg-blue-100 text-blue-800`)
- **C**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Default**: Gray

### Status
- **Negeri**: Blue (`bg-blue-100 text-blue-800`)
- **Swasta**: Purple (`bg-purple-100 text-purple-800`)

## 🔍 Filter Logic

```typescript
// Search filter (case insensitive)
nama.toLowerCase().includes(searchTerm.toLowerCase())

// Jenjang filter
!selectedLevel || selectedLevel === "Semua Jenjang" || jenjang === selectedLevel

// Kecamatan filter
!selectedDistrict || selectedDistrict === "Semua Kecamatan" || kecamatan === selectedDistrict
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 1 column grid
- **Tablet (md)**: 2 columns grid
- **Desktop (lg)**: 3 columns grid

### Detail Page
- **Mobile**: Stacked layout
- **Desktop (lg)**: 2/3 content + 1/3 sidebar

## 🔄 State Management

### Listing Page States
```typescript
const [searchTerm, setSearchTerm] = useState("")
const [selectedLevel, setSelectedLevel] = useState("")
const [selectedDistrict, setSelectedDistrict] = useState("")
const [currentPage, setCurrentPage] = useState(1)
const [schools, setSchools] = useState<Sekolah[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
```

### Detail Page States
```typescript
const [school, setSchool] = useState<Sekolah | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
```

## 🌐 API Integration

### Fetch All Schools
```typescript
const response = await fetch("/api/sekolahs")
const result = await response.json()
// result.success, result.data
```

### Fetch Single School
```typescript
const response = await fetch(`/api/sekolahs/${id}`)
const result = await response.json()
// result.success, result.data
```

## 🎯 User Experience

### Loading States
- Spinner dengan text "Memuat data sekolah..."

### Error States
- Icon + error message + reload button

### Empty States
- "Tidak ada sekolah ditemukan"
- Reset filter button

### Image Handling
- Show image if `gambarUtama` exists
- Fallback to gradient with school icon
- Gallery shows only if foto1/foto2 exists

## 📁 File Structure

```
app/
├── direktori-sekolah/
│   ├── page.tsx           # Listing page
│   └── [id]/
│       └── page.tsx       # Detail page
```

## 🚀 Testing Checklist

- [ ] Data muncul dari admin
- [ ] Search berfungsi
- [ ] Filter jenjang berfungsi
- [ ] Filter kecamatan berfungsi (dynamic)
- [ ] Pagination berfungsi
- [ ] Click "Lihat Detail" buka detail page
- [ ] Detail page menampilkan semua info
- [ ] Gambar muncul (atau placeholder)
- [ ] Back button berfungsi
- [ ] Responsive di mobile/tablet/desktop
- [ ] Loading states muncul
- [ ] Error handling berfungsi
- [ ] Empty state dengan reset filter

## 🎨 Design Consistency

Mengikuti design pattern dari:
- ✅ Agenda listing/detail
- ✅ Berita listing/detail
- ✅ Consistent card styling
- ✅ Consistent badges
- ✅ Consistent buttons
- ✅ Consistent spacing

## 📝 Notes

1. **Data Statis Dihapus**: Semua data dummy sudah dihapus, sekarang 100% dari database
2. **Dynamic Districts**: Kecamatan dropdown otomatis generate dari data yang ada
3. **Jenjang Options**: Hanya PAUD, SD, SMP (no SMA/SMK)
4. **Image Paths**: Menggunakan local storage di `/uploads/sekolahs/`
5. **BigInt Handling**: ID dari BigInt dikonversi ke string di API


