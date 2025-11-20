still maintenance


# Product Requirements Document (PRD)
## Web SIMDIK - Sistem Informasi Manajemen Pendidikan

---

## 1. Executive Summary

### 1.1 Product Overview
Web SIMDIK adalah sistem informasi manajemen pendidikan berbasis web yang dirancang untuk mengelola layanan pendidikan, reservasi, dan informasi sekolah secara terpadu. Sistem ini menyediakan platform untuk masyarakat mengajukan layanan pendidikan dan bagi admin untuk mengelola data secara efisien.

### 1.2 Product Vision
Menjadi platform digital terpadu yang memudahkan masyarakat dalam mengakses layanan pendidikan dan membantu pengelola pendidikan dalam mengelola data dan layanan secara efisien dan transparan.

### 1.3 Target Users
- **Masyarakat/User**: Orang tua, guru, dan tenaga kependidikan yang memerlukan layanan pendidikan
- **Admin**: Pengelola sistem yang menangani reservasi dan data pendidikan

---

## 2. Business Objectives

### 2.1 Goals
1. Menyederhanakan proses pengajuan layanan pendidikan
2. Meningkatkan efisiensi pengelolaan data pendidikan
3. Menyediakan transparansi informasi layanan pendidikan
4. Mengurangi antrian fisik dengan sistem reservasi online

### 2.2 Success Metrics
- Total reservasi yang berhasil diproses per bulan
- Waktu rata-rata penyelesaian layanan
- Tingkat kepuasan pengguna (user satisfaction rate)
- Jumlah pengguna aktif bulanan

---

## 3. User Personas

### 3.1 Persona 1: Masyarakat Umum
**Nama**: Ibu Sari (35 tahun)
**Pekerjaan**: Orang tua siswa
**Kebutuhan**: 
- Mengajukan layanan pendidikan untuk anak
- Melihat status pengajuan
- Mendapat informasi sekolah dan berita pendidikan

**Pain Points**:
- Harus datang langsung ke kantor
- Tidak tahu status pengajuan
- Informasi tidak transparan

### 3.2 Persona 2: Admin Disdik
**Nama**: Pak Budi (40 tahun)
**Pekerjaan**: Staff administrasi Dinas Pendidikan
**Kebutuhan**:
- Mengelola reservasi layanan
- Melihat statistik dan laporan
- Mengelola data sekolah dan informasi

**Pain Points**:
- Data tidak terorganisir
- Sulit membuat laporan
- Proses manual memakan waktu

---

## 4. Product Features

### 4.1 User Features (Public)

#### 4.1.1 Landing Page
- Hero section dengan CTA "Ajukan Layanan"
- Informasi layanan yang tersedia (PTK, SD, SMP, PAUD)
- Berita dan agenda pendidikan terbaru
- Footer dengan kontak dan informasi

#### 4.1.2 Reservasi Layanan
**Priority**: P0 (Critical)

**User Story**: Sebagai masyarakat, saya ingin mengajukan layanan pendidikan secara online agar tidak perlu datang langsung.

**Features**:
- Form pengajuan dengan kategori layanan:
  - PTK (Pendidik dan Tenaga Kependidikan)
  - SD Umum
  - SMP Umum
  - PAUD
- Upload dokumen pendukung
- Generate nomor tiket otomatis (format: PTK-123456)
- Konfirmasi pengajuan via email
- Tracking status pengajuan

**Acceptance Criteria**:
- User dapat memilih kategori layanan
- Form validasi lengkap dan jelas
- Nomor tiket unik ter-generate otomatis
- User mendapat konfirmasi email
- Data tersimpan di database

#### 4.1.3 Tracking Status
**Priority**: P1 (High)

**Features**:
- Cek status dengan nomor tiket
- Status yang tersedia:
  - Menunggu (Pending)
  - Diproses (In Progress)
  - Selesai (Completed)
  - Dibatalkan (Cancelled)
- Timeline progress layanan
- Notifikasi update status

#### 4.1.4 Informasi Sekolah
**Priority**: P2 (Medium)

**Features**:
- Daftar sekolah berdasarkan jenjang
- Detail informasi sekolah (alamat, kontak, akreditasi)
- Search dan filter sekolah
- Maps lokasi sekolah

#### 4.1.5 Berita & Agenda
**Priority**: P2 (Medium)

**Features**:
- Daftar berita pendidikan
- Detail berita dengan gambar
- Kalender agenda pendidikan
- Filter berdasarkan tanggal/kategori

---

### 4.2 Admin Features

#### 4.2.1 Dashboard
**Priority**: P0 (Critical)

**Features**:
- **Ringkasan Data**:
  - Total Reservasi
  - Total Sekolah
  - Total Berita
  - Total Agenda
  
- **Progress Layanan**:
  - Bar chart kategori layanan (PTK, SD, SMP, PAUD)
  - Persentase dan jumlah reservasi per kategori
  
- **Status Reservasi**:
  - Doughnut chart status (Selesai, Menunggu, Dibatalkan)
  - Warna: Hijau (Selesai), Kuning (Menunggu), Merah muda (Dibatalkan)
  
- **Tren Bulanan**:
  - Line chart reservasi per bulan
  - Filter berdasarkan tahun
  
- **Total Data Sistem**:
  - Bar chart perbandingan total data
  - Data: Reservasi, Sekolah, Berita, Agenda
  
- **Laporan Masuk Terbaru**:
  - Tabel 5 reservasi terbaru
  - Kolom: No. Tiket, Pelapor, Kategori, Status, Aksi
  - Button "Lihat Detail"

**Acceptance Criteria**:
- Dashboard load dalam < 3 detik
- Data real-time dari database
- Chart responsive dan interaktif
- Filter berfungsi dengan baik

#### 4.2.2 Manajemen Reservasi
**Priority**: P0 (Critical)

**User Story**: Sebagai admin, saya ingin mengelola semua reservasi yang masuk agar dapat diproses dengan efisien.

**Features**:
- **Daftar Reservasi**:
  - Tabel dengan kolom: No. Tiket, Nama, Layanan, Tanggal & Waktu, Tujuan, Status, Aksi
  - Status badge dengan warna berbeda
  - Filter berdasarkan status dan layanan
  - Search berdasarkan nama/nomor tiket
  - Pagination
  
- **Detail Reservasi**:
  - Informasi lengkap pemohon
  - Dokumen yang diupload
  - Timeline status
  - Button aksi: Lihat, Edit, Hapus
  
- **Update Status**:
  - Ubah status reservasi
  - Tambah catatan/keterangan
  - Notifikasi ke user via email
  
- **Statistik**:
  - Card: Total Reservasi, Selesai, Menunggu, Dibatalkan
  - Filter berdasarkan periode

**Acceptance Criteria**:
- Admin dapat melihat semua reservasi
- Filter dan search berfungsi real-time
- Update status tersinkronisasi
- Email notifikasi terkirim otomatis

#### 4.2.3 Manajemen Sekolah
**Priority**: P1 (High)

**Features**:
- CRUD sekolah (Create, Read, Update, Delete)
- Form input:
  - Nama sekolah
  - Jenjang (SD/SMP/SMA/PAUD)
  - NPSN
  - Alamat lengkap
  - Kontak (telp, email)
  - Status akreditasi
  - Koordinat maps
- Upload foto sekolah
- Tabel daftar sekolah dengan search & filter
- Export data ke Excel/PDF

#### 4.2.4 Manajemen Berita
**Priority**: P1 (High)

**Features**:
- CRUD berita
- Rich text editor untuk konten
- Upload gambar featured
- Kategori berita
- Status publish (Draft/Published)
- Preview sebelum publish
- SEO metadata (title, description)

#### 4.2.5 Manajemen Agenda
**Priority**: P1 (High)

**Features**:
- CRUD agenda/event pendidikan
- Form input:
  - Judul event
  - Tanggal & waktu
  - Lokasi
  - Deskripsi
  - Kategori
- Kalender view
- Reminder event
- Export ke Google Calendar

#### 4.2.6 Profil Admin
**Priority**: P2 (Medium)

**Features**:
- View profil admin
- Edit informasi:
  - Nama lengkap
  - Email
- Ubah password:
  - Input password lama
  - Input password baru
  - Konfirmasi password
- Validasi:
  - Email unique
  - Password minimal 6 karakter
- Auto-update session setelah perubahan
- Alert sukses/error

**Acceptance Criteria**:
- Form validasi berfungsi
- Password ter-hash dengan bcrypt
- Session ter-update otomatis
- Error handling yang jelas

#### 4.2.7 Laporan & Analitik
**Priority**: P2 (Medium)

**Features**:
- Laporan reservasi per periode
- Statistik layanan paling banyak diminta
- Grafik tren bulanan/tahunan
- Export laporan ke PDF/Excel
- Filter kustom berdasarkan:
  - Tanggal
  - Kategori layanan
  - Status
  - Lokasi sekolah

---

## 5. Technical Specifications

### 5.1 Technology Stack

**Frontend**:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks, Context API
- **HTTP Client**: Fetch API

**Backend**:
- **Runtime**: Next.js API Routes (Server Actions)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Cookie-based session (JWT)
- **Validation**: Zod
- **Email**: Nodemailer / Resend
- **File Upload**: Next.js API + Cloud Storage
- **Password Hashing**: bcryptjs

**Database Schema**:
```prisma
model Pengguna {
  id           BigInt   @id @default(autoincrement())
  nama         String
  email        String   @unique
  passwordHash String
  peran        String   @default("admin")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Reservasi {
  id            BigInt   @id @default(autoincrement())
  queueNumber   String   @unique // PTK-751419
  name          String
  phone         String
  email         String?
  idLayanan     BigInt?
  service       String?
  purpose       String
  status        String   @default("waiting") // waiting, completed, cancelled
  date          DateTime
  time          String
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  layanan       Layanan? @relation(fields: [idLayanan], references: [id])
}

model Sekolah {
  id              BigInt   @id @default(autoincrement())
  nama            String
  npsn            String?  @unique
  jenjang         String   // SD, SMP, SMA, PAUD
  alamat          String?
  kecamatan       String?
  telepon         String?
  email           String?
  tahunBerdiri    String?
  akreditasi      String?
  status          String?
  deskripsi       String?  @db.Text
  gambarUtama     String?
  foto1           String?
  foto2           String?
  latitude        Float?
  longitude       Float?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Berita {
  id            BigInt   @id @default(autoincrement())
  judul         String
  slug          String   @unique
  konten        String   @db.Text
  ringkasan     String?
  gambarUtama   String?
  kategori      String?
  status        String   @default("draft") // draft, published
  tanggalPublish DateTime?
  idPengguna    BigInt?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  pengguna      Pengguna? @relation(fields: [idPengguna], references: [id])
}

model Agenda {
  id          BigInt   @id @default(autoincrement())
  judul       String
  deskripsi   String   @db.Text
  lokasi      String?
  tanggalMulai DateTime
  tanggalSelesai DateTime?
  kategori    String?
  gambar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Layanan {
  id          BigInt   @id @default(autoincrement())
  name        String
  description String?  @db.Text
  icon        String?
  color       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  reservasis  Reservasi[]
}
```

### 5.2 System Architecture

```
┌─────────────────────────────────────────┐
│           User Browser                   │
│  (Next.js Client-Side Components)        │
└─────────────┬───────────────────────────┘
              │ HTTP/HTTPS
              ↓
┌─────────────────────────────────────────┐
│         Next.js App Router               │
│  ┌───────────────────────────────────┐  │
│  │  Server Components (SSR)          │  │
│  │  - Fetch data on server           │  │
│  │  - SEO optimized                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  API Routes                       │  │
│  │  - /api/auth/*                    │  │
│  │  - /api/admin/profile             │  │
│  │  - /api/reservations/*            │  │
│  │  - /api/sekolahs/*                │  │
│  │  - /api/news/*                    │  │
│  │  - /api/agendas/*                 │  │
│  └───────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│         Prisma ORM Layer                 │
│  - Query builder                         │
│  - Type-safe database operations         │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│      PostgreSQL Database                 │
│  - Pengguna, Reservasi, Sekolah          │
│  - Berita, Agenda, Layanan tables        │
└─────────────────────────────────────────┘
```

### 5.3 Security Requirements

**Authentication**:
- Cookie-based session management
- Password hashing dengan bcryptjs (salt rounds: 10)
- Session timeout: 7 hari
- Secure cookies (httpOnly, sameSite: lax)

**Authorization**:
- Role-based access control (Admin only)
- Protected API routes dengan getSession middleware
- CSRF protection

**Data Security**:
- Input validation dengan Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- File upload validation (type, size)
- Rate limiting pada API endpoints (future)

**HTTPS**:
- SSL/TLS certificate required in production
- Redirect HTTP to HTTPS
- Secure headers (HSTS, CSP)

---

## 6. User Interface Design

### 6.1 Design Principles
- **Clean & Modern**: Minimalist design dengan fokus pada konten
- **Responsive**: Mobile-first approach, mendukung semua device
- **Accessible**: WCAG 2.1 Level AA compliance
- **Consistent**: Unified design system dengan shadcn/ui
- **Fast**: Optimized loading time < 3 detik

### 6.2 Color Palette
- **Primary**: Blue (#3B82F6) - Trust, professional
- **Success**: Green (#22C55E) - Completed status
- **Warning**: Yellow (#EAB308) - Pending status
- **Danger**: Light Red (#EF4444) - Cancelled status
- **Neutral**: Gray scale (#F9FAFB to #111827)

### 6.3 Typography
- **Headings**: Inter, Semibold/Bold
- **Body**: Inter, Regular
- **Code**: Monospace

### 6.4 Key Screens

#### Public Site:
1. Landing Page
2. Reservasi Form
3. Tracking Status
4. Daftar Sekolah
5. Detail Sekolah
6. Berita & Artikel
7. Agenda Pendidikan

#### Admin Panel:
1. Login Page ✅
2. Dashboard (dengan charts & stats) ✅
3. Daftar Reservasi (tabel + filter) ✅
4. Detail Reservasi ✅
5. Manajemen Sekolah (CRUD) ✅
6. Manajemen Berita (CRUD + editor) ✅
7. Manajemen Agenda (CRUD + calendar) ✅
8. Profil Admin ✅
9. Laporan & Export (upcoming)

---

## 7. User Flows

### 7.1 Reservasi Layanan Flow
```
User Landing Page 
  → Klik "Ajukan Layanan"
  → Pilih Kategori (PTK/SD/SMP/PAUD)
  → Isi Form (Nama, Kontak, Tujuan, Jadwal)
  → Upload Dokumen (optional)
  → Submit
  → Generate No. Tiket
  → Konfirmasi Email
  → Tracking Status
```

### 7.2 Admin Process Reservasi Flow
```
Admin Login
  → Dashboard
  → Lihat "Laporan Masuk Terbaru" atau ke Menu "Laporan Reservasi"
  → Klik "Lihat Detail"
  → Review Informasi & Dokumen
  → Update Status (Menunggu → Selesai/Dibatalkan)
  → Tambah Catatan (optional)
  → Simpan
  → Email Notifikasi ke User
```

### 7.3 Admin Edit Profil Flow
```
Admin Login
  → Klik User Menu (pojok kanan atas)
  → Pilih "Profile Saya"
  → Edit Nama/Email
  → atau Ubah Password (input password lama)
  → Klik "Simpan Perubahan"
  → Validasi
  → Update Database & Session
  → Alert Sukses
  → Auto-reload
```

---

## 8. Non-Functional Requirements

### 8.1 Performance
- **Page Load Time**: < 3 detik (First Contentful Paint)
- **API Response Time**: < 500ms untuk query sederhana
- **Database Query**: Optimized dengan indexing
- **Image Optimization**: Next.js Image component, lazy loading
- **Code Splitting**: Dynamic imports untuk chart library

### 8.2 Scalability
- **Concurrent Users**: Support 100+ concurrent users
- **Database**: Prepared for horizontal scaling
- **CDN**: Static assets served via CDN
- **Caching**: Redis untuk session & frequent queries (future)

### 8.3 Reliability
- **Uptime**: 99.5% availability target
- **Backup**: Daily automated database backup (recommended)
- **Error Handling**: Graceful error messages
- **Logging**: Error tracking dengan console.log (Sentry integration planned)

### 8.4 Usability
- **Responsive**: Support desktop, tablet, mobile
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Accessibility**: Keyboard navigation, screen reader friendly
- **Loading States**: Skeleton screens, spinners
- **Error Messages**: Clear, actionable feedback

### 8.5 Maintainability
- **Code Quality**: TypeScript strict mode, ESLint, Prettier
- **Documentation**: Inline comments, README, PRD
- **Testing**: Unit tests (Jest), E2E tests (Playwright) - planned
- **Version Control**: Git with semantic commits
- **CI/CD**: Automated deployment pipeline (recommended)

---

## 9. API Endpoints

### 9.1 Authentication
```
POST   /api/auth/login          - Admin login
POST   /api/auth/logout         - Logout
```

### 9.2 Admin Profile
```
GET    /api/admin/profile       - Get admin profile
PUT    /api/admin/profile       - Update admin profile (name, email, password)
```

### 9.3 Reservations
```
GET    /api/reservations        - Get all reservations (with filters)
POST   /api/reservations        - Create new reservation
GET    /api/reservations/:id    - Get reservation detail
PUT    /api/reservations/:id    - Update reservation status
DELETE /api/reservations/:id    - Delete reservation
```

### 9.4 Schools (Sekolahs)
```
GET    /api/sekolahs            - Get all schools (with pagination)
POST   /api/sekolahs            - Create new school
GET    /api/sekolahs/:id        - Get school detail
PUT    /api/sekolahs/:id        - Update school
DELETE /api/sekolahs/:id        - Delete school
```

### 9.5 News (Berita)
```
GET    /api/news                - Get all news
POST   /api/news                - Create new news
GET    /api/news/:id            - Get news by ID
PUT    /api/news/:id            - Update news
DELETE /api/news/:id            - Delete news
```

### 9.6 Agenda
```
GET    /api/agendas             - Get all agenda
POST   /api/agendas             - Create new agenda
GET    /api/agendas/:id         - Get agenda detail
PUT    /api/agendas/:id         - Update agenda
DELETE /api/agendas/:id         - Delete agenda
```

### 9.7 Services (Layanan)
```
GET    /api/layanans            - Get all services
POST   /api/layanans            - Create new service
PUT    /api/layanans/:id        - Update service
DELETE /api/layanans/:id        - Delete service
```

---

## 10. Development Roadmap

### Phase 1: MVP - Admin Panel ✅ COMPLETED
- [x] Setup project (Next.js, Prisma, Tailwind)
- [x] Database schema & migration
- [x] Admin authentication
- [x] Admin dashboard dengan charts
- [x] Manajemen reservasi (CRUD)
- [x] Manajemen sekolah (CRUD)
- [x] Manajemen berita (CRUD)
- [x] Manajemen agenda (CRUD)
- [x] Profil admin (view & edit)
- [x] Basic UI/UX dengan shadcn/ui
- [x] Theme toggle (light/dark mode)
- [x] Responsive design

### Phase 2: Public Features (Current)
- [ ] Public landing page
- [ ] Reservasi form untuk user
- [ ] Tracking status dengan nomor tiket
- [ ] Email notification system
- [ ] Upload file & image optimization
- [ ] Public view sekolah
- [ ] Public view berita & agenda

### Phase 3: Content Management Enhancement
- [ ] Rich text editor untuk berita
- [ ] Calendar view untuk agenda
- [ ] Advanced search & filter
- [ ] Export data to Excel/PDF
- [ ] Bulk operations
- [ ] Image gallery management

### Phase 4: Advanced Features
- [ ] Advanced analytics & reporting
- [ ] WhatsApp notification integration
- [ ] Google Calendar sync
- [ ] Maps integration untuk lokasi sekolah
- [ ] PWA (Progressive Web App)
- [ ] Multi-language support

### Phase 5: Testing & Optimization
- [ ] Unit testing
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Production deployment optimization

---

## 11. Current Implementation Status

### ✅ Completed Features

#### Authentication & Authorization
- Admin login dengan email & password
- Cookie-based session management
- Password hashing dengan bcryptjs
- Logout functionality
- Protected routes

#### Admin Dashboard
- Real-time statistics (Total Reservasi, Sekolah, Berita, Agenda)
- Progress Layanan (4 kategori: PTK, SD, SMP, PAUD)
- Status Reservasi chart (Doughnut: Selesai, Menunggu, Dibatalkan)
- Tren Reservasi Bulanan (Line chart)
- Total Data Sistem (Bar chart)
- Laporan Masuk Terbaru (5 latest)
- Theme toggle (light/dark mode)
- Responsive sidebar navigation

#### Manajemen Reservasi
- View all reservations dengan filter (status, layanan)
- Detail view dengan informasi lengkap
- Update status (waiting, completed, cancelled)
- Delete reservation
- Statistics cards
- Queue number format (PTK-751419, SD-115926, etc)
- Real-time data fetching

#### Manajemen Sekolah
- CRUD operations (Create, Read, Update, Delete)
- Form dengan validasi lengkap
- Upload gambar sekolah (3 foto: utama, foto1, foto2)
- Filter berdasarkan jenjang
- Search functionality
- Responsive table
- Image preview & optimization

#### Manajemen Berita
- CRUD operations
- Rich content dengan textarea
- Upload gambar featured
- Status publish (draft/published)
- Kategori berita
- Slug auto-generation
- Date formatting Indonesia

#### Manajemen Agenda
- CRUD operations
- Tanggal mulai & selesai
- Upload gambar event
- Kategori agenda
- Lokasi event
- Responsive form & table

#### Profil Admin
- View profil lengkap
- Edit nama & email
- Ubah password dengan validasi
- Password visibility toggle
- Auto-update session
- Success/error alerts
- Informasi akun (created, updated date)

### 🚧 In Progress / Planned
- Public-facing pages
- Email notification system
- Export functionality (PDF/Excel)
- Advanced reporting
- File upload untuk reservasi
- Maps integration
- Unit & E2E testing

---

## 12. Testing Strategy

### 12.1 Manual Testing Checklist

#### Authentication
- [x] Login dengan kredensial valid
- [x] Login dengan kredensial invalid
- [x] Logout functionality
- [x] Session persistence
- [x] Protected route access

#### Dashboard
- [x] Data loading & display
- [x] Charts rendering
- [x] Filter functionality
- [x] Responsive design
- [x] Theme toggle

#### CRUD Operations
- [x] Create new record
- [x] Read/view records
- [x] Update existing record
- [x] Delete record
- [x] Form validation
- [x] Error handling

#### Profile Management
- [x] View profile
- [x] Update nama & email
- [x] Change password
- [x] Password validation
- [x] Session update

### 12.2 Automated Testing (Planned)
- [ ] Unit tests dengan Jest
- [ ] Component tests dengan React Testing Library
- [ ] E2E tests dengan Playwright
- [ ] API endpoint tests

---

## 13. Deployment & Infrastructure

### 13.1 Current Setup
- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma
- **Development**: Local development server
- **Version Control**: Git

### 13.2 Recommended Production Setup
- **Hosting**: Vercel / AWS / DigitalOcean
- **Database**: Supabase / Neon / Railway
- **File Storage**: Vercel Blob / AWS S3 / Cloudinary
- **Email**: Resend / SendGrid / AWS SES
- **Monitoring**: Sentry / LogRocket
- **CDN**: Vercel Edge / CloudFlare

### 13.3 Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (future)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-password"

# File Upload (future)
NEXT_PUBLIC_UPLOAD_URL="https://..."
UPLOAD_SECRET_KEY="your-upload-key"
```

---

## 14. Known Issues & Limitations

### Current Limitations
1. **Email Notifications**: Belum terimplementasi
2. **File Upload**: Upload terbatas untuk gambar sekolah, berita, agenda
3. **Export**: Belum ada fitur export to PDF/Excel
4. **Testing**: Belum ada automated tests
5. **Performance**: Chart library tidak di-lazy load secara optimal
6. **Validation**: Beberapa form masih perlu validasi lebih strict

### Technical Debt
1. Code duplication di beberapa admin pages (sidebar, header)
2. Perlu refactor ke shared components
3. Type safety bisa ditingkatkan
4. Error handling bisa lebih comprehensive
5. Loading states perlu konsistensi

---

## 15. Success Criteria

### 15.1 MVP Success Criteria ✅
- [x] Admin dapat login & logout
- [x] Dashboard menampilkan statistik real-time
- [x] CRUD reservasi berfungsi penuh
- [x] CRUD sekolah berfungsi penuh
- [x] CRUD berita berfungsi penuh
- [x] CRUD agenda berfungsi penuh
- [x] Admin dapat edit profil
- [x] Responsive di mobile & desktop
- [x] Theme toggle berfungsi

### 15.2 Phase 2 Success Criteria (Target)
- [ ] Public dapat mengakses landing page
- [ ] Public dapat submit reservasi
- [ ] Public dapat track status reservasi
- [ ] Email notification terkirim otomatis
- [ ] 90%+ uptime
- [ ] < 3s page load time

---

## 16. Change Log

### Version 1.0 - November 19, 2025
**Initial Release - MVP Completed**

**Features Implemented**:
- Admin authentication system
- Comprehensive dashboard dengan 5 chart/grafik
- Manajemen Reservasi (CRUD + filter)
- Manajemen Sekolah (CRUD + upload gambar)
- Manajemen Berita (CRUD)
- Manajemen Agenda (CRUD)
- Profil Admin (view & edit)
- Theme toggle (light/dark)
- Responsive design

**Recent Updates**:
- Dashboard: Ubah "ID Laporan" → "No. Tiket"
- Dashboard: Tampilkan queueNumber (PTK-751419) bukan ID mentah
- Dashboard: Progress Layanan dibatasi 4 kategori (PTK, SD, SMP, PAUD)
- Dashboard: Warna status dibatalkan → merah muda (rgb(239, 68, 68))
- Dashboard: Hapus duplikat judul "Total Data Sistem" di chart
- Dashboard: Sesuaikan ukuran card (space-y-6 → space-y-4, h-280px → h-240px)
- Admin Menu: Hapus menu "Pengaturan" dan "Bantuan"
- Admin Menu: Integrasi "Profile Saya" ke semua halaman admin

---

## Appendix

### A. Glossary
- **SIMDIK**: Sistem Informasi Manajemen Pendidikan
- **PTK**: Pendidik dan Tenaga Kependidikan
- **PAUD**: Pendidikan Anak Usia Dini
- **NPSN**: Nomor Pokok Sekolah Nasional
- **Disdik**: Dinas Pendidikan
- **MVP**: Minimum Viable Product
- **CRUD**: Create, Read, Update, Delete

### B. File Structure
```
web-simdik/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── admin/profile/
│   │   ├── reservations/
│   │   ├── sekolahs/
│   │   ├── news/
│   │   └── agendas/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── reservations/
│   │   ├── schools/
│   │   ├── news/
│   │   ├── agenda/
│   │   └── profile/
│   └── login/
├── components/
│   ├── ui/ (shadcn components)
│   ├── admin-header.tsx
│   ├── admin-sidebar.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
└── docs/ (this file)
```

### C. References
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Chart.js: https://www.chartjs.org/docs

### D. Contact & Support
- **Repository**: https://github.com/Fery-Iris/web-simdik
- **Developer**: Fery Iris
- **Project Type**: Magang/Internship Project

---

**Document Version**: 1.0  
**Last Updated**: November 19, 2025  
**Status**: Active Development - MVP Phase Completed  
**Next Phase**: Public Features Implementation

