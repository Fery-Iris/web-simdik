# Authentication Setup - SIMDIK

## Overview
Sistem autentikasi untuk SIMDIK menggunakan session-based authentication dengan cookie. Admin harus login terlebih dahulu sebelum mengakses halaman admin.

## Features
✅ **Login/Logout** - Session-based authentication dengan cookie
✅ **Password Hashing** - bcrypt dengan 10 rounds
✅ **Protected Routes** - Semua route `/admin/*` dilindungi
✅ **Session Management** - Cookie httpOnly dengan expiry 7 hari
✅ **Auto Redirect** - Redirect ke `/login` jika belum login

---

## 🔐 Admin Credentials

### Default Admin Account:
- **Email**: `disdikbanjarmasin@gmail.com`
- **Password**: `disdik123`
- **Role**: `ADMIN`

---

## 📋 Setup Instructions

### **Step 1: Run SQL Script di Supabase**

Buka **Supabase SQL Editor** dan jalankan script berikut:

```sql
-- Seed Admin User for SIMDIK
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM penggunas 
    WHERE email = 'disdikbanjarmasin@gmail.com'
  ) THEN
    INSERT INTO "public"."penggunas" (
      nama,
      email,
      password_hash,
      peran,
      dibuat_pada,
      diperbarui_pada
    ) VALUES (
      'Admin Disdik Banjarmasin',
      'disdikbanjarmasin@gmail.com',
      '$2b$10$uwl/OGp7o59yuPnBJ6RLuOL0ERjMNYH4hBBlF4kYbbSPZkRmLD8Yi',
      'ADMIN',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Admin user created successfully!';
  ELSE
    RAISE NOTICE 'Admin user already exists!';
  END IF;
END $$;

-- Verify the admin user
SELECT 
  pengguna_id,
  nama,
  email,
  peran,
  dibuat_pada
FROM "public"."penggunas"
WHERE email = 'disdikbanjarmasin@gmail.com';
```

**Atau jalankan file:**
```bash
# File sudah ada di: scripts/seed-admin-user.sql
```

---

### **Step 2: Test Login**

1. Buka browser: `http://localhost:3000/login`
2. Klik **Demo Account** atau masukkan manual:
   - Email: `disdikbanjarmasin@gmail.com`
   - Password: `disdik123`
3. Klik **Sign In**
4. Akan redirect ke `/admin/dashboard`

---

## 🏗️ Architecture

### **Database Schema**
```prisma
model Pengguna {
  id           BigInt   @id @default(autoincrement()) @map("pengguna_id")
  nama         String   @db.VarChar(100)
  email        String   @unique @db.VarChar(150)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  peran        RoleType @default(ADMIN)
  createdAt    DateTime @default(now()) @map("dibuat_pada")
  updatedAt    DateTime @updatedAt @map("diperbarui_pada")

  @@map("penggunas")
}

enum RoleType {
  ADMIN
  USER
}
```

### **API Endpoints**

#### **1. POST `/api/auth/login`**
Login dengan email dan password

**Request:**
```json
{
  "email": "disdikbanjarmasin@gmail.com",
  "password": "disdik123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "nama": "Admin Disdik Banjarmasin",
    "email": "disdikbanjarmasin@gmail.com",
    "peran": "ADMIN"
  }
}
```

**Response (Error):**
```json
{
  "error": "Email atau password salah"
}
```

---

#### **2. POST `/api/auth/logout`**
Logout dan hapus session

**Response:**
```json
{
  "success": true
}
```

---

#### **3. GET `/api/auth/session`**
Check session saat ini

**Response (Authenticated):**
```json
{
  "user": {
    "id": "1",
    "nama": "Admin Disdik Banjarmasin",
    "email": "disdikbanjarmasin@gmail.com",
    "peran": "ADMIN"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "error": "Not authenticated"
}
```

---

## 🛡️ Protected Routes

Semua route yang dimulai dengan `/admin/*` dilindungi dengan middleware:

### **Server-Side Protection**
File: `app/admin/layout.tsx`

```typescript
export default async function AdminLayout({ children }) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}
```

### **Client-Side Protection**
File: `components/auth-provider.tsx`

```typescript
export function AuthProvider({ children }) {
  // Check session untuk admin routes
  // Redirect ke /login jika belum authenticated
}
```

---

## 🔑 Session Management

### **Cookie Configuration**
```typescript
{
  httpOnly: true,              // Tidak bisa diakses via JavaScript
  secure: process.env.NODE_ENV === 'production',  // HTTPS only di production
  sameSite: 'lax',             // CSRF protection
  maxAge: 60 * 60 * 24 * 7,    // 7 days
  path: '/',                   // Available untuk semua routes
}
```

### **Session Data**
```typescript
interface SessionUser {
  id: string
  nama: string
  email: string
  peran: string
}
```

---

## 📁 File Structure

```
app/
├── api/
│   └── auth/
│       ├── login/
│       │   └── route.ts        # Login endpoint
│       ├── logout/
│       │   └── route.ts        # Logout endpoint
│       └── session/
│           └── route.ts        # Check session endpoint
├── admin/
│   └── layout.tsx              # Admin layout dengan auth check
└── login/
    └── page.tsx                # Login page

lib/
└── auth.ts                     # Authentication utilities

components/
└── auth-provider.tsx           # Client-side auth check

scripts/
├── seed-admin-user.js          # Node.js script untuk seed admin
├── seed-admin-user.sql         # SQL script untuk Supabase
└── generate-password-hash.js   # Utility untuk generate hash
```

---

## 🧪 Testing

### **Test Login Flow:**
1. ✅ Akses `/admin/dashboard` tanpa login → Redirect ke `/login`
2. ✅ Login dengan credentials salah → Error message
3. ✅ Login dengan credentials benar → Redirect ke `/admin/dashboard`
4. ✅ Refresh page di `/admin/dashboard` → Tetap login
5. ✅ Logout → Redirect ke `/login`

### **Test Session:**
```bash
# Check session
curl http://localhost:3000/api/auth/session

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"disdikbanjarmasin@gmail.com","password":"disdik123"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout
```

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt dengan 10 rounds
2. **HTTP-Only Cookies**: Tidak bisa diakses via JavaScript (XSS protection)
3. **Secure Cookies**: HTTPS only di production
4. **SameSite**: CSRF protection
5. **Server-Side Validation**: Semua auth check di server
6. **Session Expiry**: Auto logout setelah 7 hari

---

## 🚀 How to Add New Admin

### **Option 1: Via SQL (Supabase)**
```sql
-- Generate password hash dulu dengan bcrypt
INSERT INTO "public"."penggunas" (
  nama,
  email,
  password_hash,
  peran,
  dibuat_pada,
  diperbarui_pada
) VALUES (
  'Nama Admin',
  'email@example.com',
  '$2b$10$YourHashHere',  -- Hash dari password
  'ADMIN',
  NOW(),
  NOW()
);
```

### **Option 2: Via Script**
```bash
# Edit scripts/seed-admin-user.js dengan data baru
node scripts/seed-admin-user.js
```

### **Generate Password Hash:**
```bash
node scripts/generate-password-hash.js
# Atau edit file untuk custom password
```

---

## 🐛 Troubleshooting

### **Error: "Email atau password salah"**
- ✅ Pastikan admin user sudah dibuat di database
- ✅ Cek email dan password benar
- ✅ Pastikan `penggunas` table ada di Supabase

### **Error: "Property 'pengguna' does not exist"**
```bash
npx prisma generate
npm run dev
```

### **Redirect loop ke /login**
- ✅ Clear browser cookies
- ✅ Restart dev server
- ✅ Check console untuk error

### **Session tidak persist setelah refresh**
- ✅ Pastikan cookie settings benar
- ✅ Check browser cookie storage
- ✅ Pastikan `httpOnly` tidak blocking di development

---

## 📝 Next Steps

1. ✅ **Add Logout Button** di admin header/navbar
2. ✅ **Display User Info** di admin dashboard (nama, email)
3. ⏳ **Role-Based Access Control** (ADMIN vs USER permissions)
4. ⏳ **Password Reset** functionality
5. ⏳ **User Management** page (CRUD users)
6. ⏳ **Activity Logs** untuk audit trail

---

## 📚 References

- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)



