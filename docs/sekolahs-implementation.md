# Implementasi Table Sekolahs

## 📝 Overview

Dokumentasi lengkap untuk setup dan implementasi table `sekolahs` di Supabase dengan integrasi frontend dan backend.

## 🗂️ Struktur Database

### Table: `sekolahs`

| Column Name | Data Type | Nullable | Description |
|-------------|-----------|----------|-------------|
| `id_sekolahs` | BIGSERIAL | ❌ | Primary Key (auto-increment) |
| `nama` | VARCHAR(255) | ❌ | Nama sekolah |
| `alamat` | TEXT | ✅ | Alamat lengkap sekolah |
| `kecamatan` | VARCHAR(100) | ✅ | Kecamatan lokasi sekolah |
| `jenjang` | VARCHAR(50) | ✅ | PAUD / SD / SMP |
| `akreditasi` | VARCHAR(10) | ✅ | A / B / C / Belum Terakreditasi |
| `status` | VARCHAR(50) | ✅ | Negeri / Swasta |
| `telepon` | VARCHAR(20) | ✅ | Nomor telepon sekolah |
| `email` | VARCHAR(150) | ✅ | Email sekolah |
| `tahun_berdiri` | VARCHAR(10) | ✅ | Tahun berdiri sekolah |
| `deskripsi` | TEXT | ✅ | Deskripsi/profil sekolah |
| `gambar_utama` | VARCHAR(255) | ✅ | Gambar utama (thumbnail/preview) |
| `foto_1` | VARCHAR(255) | ✅ | Foto tambahan 1 |
| `foto_2` | VARCHAR(255) | ✅ | Foto tambahan 2 |
| `created_at` | TIMESTAMPTZ | ❌ | Timestamp dibuat |
| `updated_at` | TIMESTAMPTZ | ❌ | Timestamp diupdate |

### Indexes:
- `sekolahs_jenjang_idx` → untuk filter by jenjang
- `sekolahs_kecamatan_idx` → untuk filter by kecamatan
- `sekolahs_akreditasi_idx` → untuk filter by akreditasi
- `sekolahs_status_idx` → untuk filter by status
- `sekolahs_nama_idx` → untuk search by nama

### ❌ Kolom yang Dihapus:
- `fasilitas` (dihapus sesuai permintaan)
- `prestasi` (dihapus sesuai permintaan)
- `achievements` (dihapus sesuai permintaan)
- `facilities` (dihapus sesuai permintaan)
- `id_beritas` (foreign key yang tidak diperlukan)

## 🚀 Setup Instructions

### Step 1: Run SQL Script di Supabase

1. Buka **Supabase SQL Editor**
2. Copy-paste isi file `scripts/setup-sekolahs-table.sql`
3. Klik **Run**
4. Verify hasil dengan query:

```sql
SELECT COUNT(*) FROM sekolahs;
SELECT * FROM sekolahs LIMIT 5;
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Restart Development Server

```bash
npm run dev
```

## 📋 Prisma Model

```prisma
model Sekolah {
  id            BigInt   @id @default(autoincrement()) @map("id_sekolahs")
  nama          String   @db.VarChar(255)
  alamat        String?  @db.Text
  kecamatan     String?  @db.VarChar(100)
  jenjang       String?  @db.VarChar(50)
  akreditasi    String?  @db.VarChar(10)
  status        String?  @db.VarChar(50)
  telepon       String?  @db.VarChar(20)
  email         String?  @db.VarChar(150)
  kepalaSekolah String?  @map("kepala_sekolah") @db.VarChar(255)
  tahunBerdiri  String?  @map("tahun_berdiri") @db.VarChar(10)
  jumlahSiswa   Int?     @default(0) @map("jumlah_siswa")
  jumlahGuru    Int?     @default(0) @map("jumlah_guru")
  deskripsi     String?  @db.Text
  gambarUtama   String?  @map("gambar_utama") @db.VarChar(255)
  fotoGaleri    Json?    @map("foto_galeri") @db.JsonB
  latitude      Decimal? @db.Decimal(10, 8)
  longitude     Decimal? @db.Decimal(11, 8)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("sekolahs")
  @@index([jenjang])
  @@index([kecamatan])
  @@index([akreditasi])
  @@index([status])
  @@index([nama])
}
```

## 🎯 TypeScript Interface (Frontend)

```typescript
interface Sekolah {
  id: string // Converted from BigInt
  nama: string
  alamat?: string
  kecamatan?: string
  jenjang?: string // "PAUD" | "SD" | "SMP"
  akreditasi?: string // "A" | "B" | "C" | "Belum Terakreditasi"
  status?: string // "Negeri" | "Swasta"
  telepon?: string
  email?: string
  tahunBerdiri?: string
  deskripsi?: string
  gambarUtama?: string // Main image (thumbnail/preview)
  foto1?: string // Additional photo 1
  foto2?: string // Additional photo 2
  createdAt: string
  updatedAt: string
}
```

## 🔄 Sample Data (Seed)

Script sudah include 3 sample data:

1. **SDN Sungai Miai 5**
   - Jenjang: SD
   - Akreditasi: A
   - Status: Negeri
   - Kecamatan: Banjarmasin Utara

2. **SMPN 1 Banjarmasin**
   - Jenjang: SMP
   - Akreditasi: A
   - Status: Negeri
   - Kecamatan: Banjarmasin Tengah

3. **SD Islam Al-Azhar**
   - Jenjang: SD
   - Akreditasi: A
   - Status: Swasta
   - Kecamatan: Banjarmasin Selatan

## 📝 Next Steps untuk Frontend/Backend Integration

### 1. **Create API Routes**

File: `app/api/sekolahs/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all sekolahs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jenjang = searchParams.get("jenjang")
    const kecamatan = searchParams.get("kecamatan")
    const akreditasi = searchParams.get("akreditasi")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}

    if (jenjang && jenjang !== "Semua") {
      where.jenjang = jenjang
    }

    if (kecamatan && kecamatan !== "Semua") {
      where.kecamatan = kecamatan
    }

    if (akreditasi && akreditasi !== "Semua") {
      where.akreditasi = akreditasi
    }

    if (status && status !== "Semua") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } }
      ]
    }

    const sekolahs = await prisma.sekolah.findMany({
      where,
      orderBy: { nama: "asc" },
    })

    // Convert BigInt to string
    const serialized = sekolahs.map((s) => ({
      ...s,
      id: s.id.toString(),
      latitude: s.latitude ? parseFloat(s.latitude.toString()) : null,
      longitude: s.longitude ? parseFloat(s.longitude.toString()) : null,
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching sekolahs:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data sekolah" },
      { status: 500 }
    )
  }
}

// POST create sekolah
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sekolah = await prisma.sekolah.create({
      data: {
        nama: body.nama,
        alamat: body.alamat,
        kecamatan: body.kecamatan,
        jenjang: body.jenjang,
        akreditasi: body.akreditasi,
        status: body.status,
        telepon: body.telepon,
        email: body.email,
        kepalaSekolah: body.kepalaSekolah,
        tahunBerdiri: body.tahunBerdiri,
        jumlahSiswa: body.jumlahSiswa || 0,
        jumlahGuru: body.jumlahGuru || 0,
        deskripsi: body.deskripsi,
        gambarUtama: body.gambarUtama,
        fotoGaleri: body.fotoGaleri || [],
        latitude: body.latitude,
        longitude: body.longitude,
      },
    })

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
      latitude: sekolah.latitude ? parseFloat(sekolah.latitude.toString()) : null,
      longitude: sekolah.longitude ? parseFloat(sekolah.longitude.toString()) : null,
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error("Error creating sekolah:", error)
    return NextResponse.json(
      { error: "Gagal menyimpan data sekolah" },
      { status: 500 }
    )
  }
}
```

### 2. **Create Single Sekolah API**

File: `app/api/sekolahs/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: BigInt(params.id) },
    })

    if (!sekolah) {
      return NextResponse.json(
        { error: "Sekolah tidak ditemukan" },
        { status: 404 }
      )
    }

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
      latitude: sekolah.latitude ? parseFloat(sekolah.latitude.toString()) : null,
      longitude: sekolah.longitude ? parseFloat(sekolah.longitude.toString()) : null,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching sekolah:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data sekolah" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const sekolah = await prisma.sekolah.update({
      where: { id: BigInt(params.id) },
      data: {
        nama: body.nama,
        alamat: body.alamat,
        kecamatan: body.kecamatan,
        jenjang: body.jenjang,
        akreditasi: body.akreditasi,
        status: body.status,
        telepon: body.telepon,
        email: body.email,
        kepalaSekolah: body.kepalaSekolah,
        tahunBerdiri: body.tahunBerdiri,
        jumlahSiswa: body.jumlahSiswa,
        jumlahGuru: body.jumlahGuru,
        deskripsi: body.deskripsi,
        gambarUtama: body.gambarUtama,
        fotoGaleri: body.fotoGaleri,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    })

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
      latitude: sekolah.latitude ? parseFloat(sekolah.latitude.toString()) : null,
      longitude: sekolah.longitude ? parseFloat(sekolah.longitude.toString()) : null,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error updating sekolah:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate data sekolah" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sekolah.delete({
      where: { id: BigInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sekolah:", error)
    return NextResponse.json(
      { error: "Gagal menghapus data sekolah" },
      { status: 500 }
    )
  }
}
```

### 3. **Update Frontend Pages**

Sekarang frontend pages perlu diupdate untuk fetch dari API:

**File: `app/direktori-sekolah/page.tsx`**
- Remove hardcoded `schoolsData`
- Fetch dari `/api/sekolahs`
- Add loading state
- Add error handling

**File: `app/direktori-sekolah/[id]/page.tsx`**
- Remove hardcoded data
- Fetch dari `/api/sekolahs/[id]`
- Remove section Fasilitas & Prestasi
- Keep only: Info, Description, Photos, Map

## ⚠️ Important Notes

1. **BigInt Serialization**: 
   - Database menggunakan `BIGINT` untuk `id`
   - Harus convert ke `string` saat response API
   - Frontend menerima sebagai `string`

2. **Decimal Coordinates**:
   - `latitude` dan `longitude` di DB = `Decimal`
   - Convert ke `number` untuk frontend/maps

3. **JSON Gallery**:
   - `foto_galeri` stored as JSONB
   - Structure: `[{ url, title, description }]`

4. **No Fasilitas & Prestasi**:
   - Sesuai permintaan, kolom ini sudah dihapus
   - Frontend tidak perlu tampilkan section ini

## 🧪 Testing

```bash
# Test GET all
curl http://localhost:3000/api/sekolahs

# Test GET with filter
curl http://localhost:3000/api/sekolahs?jenjang=SD

# Test GET by ID
curl http://localhost:3000/api/sekolahs/1
```

## 📚 Related Files

- `scripts/setup-sekolahs-table.sql` - SQL setup script
- `prisma/schema.prisma` - Prisma model
- `docs/sekolahs-implementation.md` - This documentation

