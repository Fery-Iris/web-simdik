# Implementasi CRUD Admin untuk Agenda

## Overview
Implementasi sistem CRUD (Create, Read, Update, Delete) untuk manajemen agenda dalam aplikasi SIMDIK Admin menggunakan Next.js, PostgreSQL, dan Prisma.

## Struktur Database

### Schema Prisma
```prisma
model Agenda {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  date      DateTime @db.Date
  time      String   @db.VarChar(10)
  location  String   @db.VarChar(255)
  status    Status   @default(SCHEDULED)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("agendas")
}

enum Status {
  SCHEDULED   @map("Terjadwal")
  ONGOING     @map("Berlangsung")
  COMPLETED   @map("Selesai")
  CANCELLED   @map("Dibatalkan")
}
```

## API Endpoints

### 1. GET /api/agendas
Mengambil semua agenda dengan fitur pagination dan filtering.

**Query Parameters:**
- `status`: Filter berdasarkan status (SCHEDULED, ONGOING, COMPLETED, CANCELLED)
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "title": "Rapat Koordinasi",
      "date": "2024-01-15T00:00:00.000Z",
      "time": "09:00",
      "location": "Aula Dinas Pendidikan",
      "status": "SCHEDULED",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. POST /api/agendas
Membuat agenda baru.

**Request Body:**
```json
{
  "title": "Workshop Kurikulum Merdeka",
  "date": "2024-01-20",
  "time": "08:00",
  "location": "SMAN 1 Banjarmasin",
  "status": "SCHEDULED"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* agenda object */ },
  "message": "Agenda berhasil dibuat"
}
```

### 3. GET /api/agendas/[id]
Mengambil detail agenda berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": { /* agenda object */ }
}
```

### 4. PUT /api/agendas/[id]
Memperbarui agenda berdasarkan ID.

**Request Body:** (sama dengan POST)

**Response:**
```json
{
  "success": true,
  "data": { /* updated agenda object */ },
  "message": "Agenda berhasil diperbarui"
}
```

### 5. DELETE /api/agendas/[id]
Menghapus agenda berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "message": "Agenda berhasil dihapus"
}
```

## Halaman Admin

### 1. /admin/agendas (Manajemen Agenda)
- **Fitur:**
  - Daftar agenda dengan tabel
  - Pencarian berdasarkan judul dan lokasi
  - Filter berdasarkan status
  - Statistik agenda (total, berlangsung, selesai)
  - Tombol aksi: Lihat, Edit, Hapus
  - Dialog untuk menambah agenda baru

### 2. /admin/agendas/[id] (Detail Agenda)
- **Fitur:**
  - Informasi lengkap agenda
  - Tombol edit dan hapus
  - Navigasi kembali ke daftar

### 3. /admin/agendas/[id]/edit (Edit Agenda)
- **Fitur:**
  - Form edit dengan validasi
  - Pratinjau perubahan
  - Tombol simpan dan batal

## Validasi Data

### Backend Validation (Zod)
- `title`: Required, min 1 karakter, max 255 karakter
- `date`: Required, format YYYY-MM-DD
- `time`: Required, format HH:MM
- `location`: Required, min 1 karakter, max 255 karakter
- `status`: Optional, enum (SCHEDULED, ONGOING, COMPLETED, CANCELLED)

### Frontend Validation
- Required field validation
- Date format validation
- Time format validation

## Setup dan Testing

### 1. Setup Database
```bash
# Generate Prisma client dan push schema
npm run agenda:setup
```

### 2. Test API
```bash
# Jalankan test untuk semua endpoint
npm run agenda:test
```

### 3. Development
```bash
# Jalankan development server
npm run dev

# Akses halaman admin agenda
http://localhost:3000/admin/agendas
```

## Struktur File

```
app/
├── api/
│   └── agendas/
│       ├── route.ts              # GET, POST /api/agendas
│       └── [id]/
│           └── route.ts          # GET, PUT, DELETE /api/agendas/[id]
├── admin/
│   └── agendas/
│       ├── page.tsx              # Daftar agenda
│       └── [id]/
│           ├── page.tsx          # Detail agenda
│           └── edit/
│               └── page.tsx      # Edit agenda
lib/
└── prisma.ts                     # Prisma client setup
prisma/
└── schema.prisma                 # Database schema
scripts/
├── setup-agenda-db.js           # Setup database dan seed data
└── test-agenda-api.js           # Test API endpoints
```

## Fitur Tambahan

### 1. Error Handling
- Validasi input dengan pesan error yang jelas
- Error handling untuk database operations
- User-friendly error messages

### 2. UI/UX
- Loading states untuk semua operasi
- Confirmation dialogs untuk delete
- Responsive design
- Modern UI dengan Tailwind CSS

### 3. Status Management
- 4 status agenda: Terjadwal, Berlangsung, Selesai, Dibatalkan
- Badge dengan warna berbeda untuk setiap status
- Filter berdasarkan status

### 4. Search dan Filter
- Pencarian berdasarkan judul dan lokasi
- Filter berdasarkan status
- Real-time filtering

## Catatan Penting

1. **Database Connection**: Pastikan `DATABASE_URL` dan `DIRECT_URL` sudah dikonfigurasi di `.env`
2. **Prisma Client**: Jalankan `npm run db:generate` setelah mengubah schema
3. **CORS**: API routes sudah dikonfigurasi untuk development
4. **Security**: Untuk production, tambahkan authentication dan authorization
5. **Validation**: Semua input sudah divalidasi baik di frontend maupun backend

## Troubleshooting

### Database Connection Issues
```bash
# Test koneksi database
npm run db:test
```

### Schema Issues
```bash
# Reset dan push schema
npm run db:push
```

### API Issues
```bash
# Test semua endpoint
npm run agenda:test
```
