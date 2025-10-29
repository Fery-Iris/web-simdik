# Logout Functionality - SIMDIK

## ✅ Implementasi Logout

Fitur logout telah diimplementasikan di semua halaman admin panel SIMDIK.

---

## 📋 Fitur Utama

### 1. **Session Management**
   - Cookie-based session (`simdik_session`)
   - Session duration: 7 hari
   - Secure & HttpOnly flags untuk keamanan

### 2. **Logout Flow**
   ```
   User clicks "Logout" 
   → Call API /api/auth/logout 
   → Destroy session cookie
   → Redirect to /login page
   → User must login again to access admin
   ```

### 3. **User Experience**
   - Loading state saat logout ("Logging out...")
   - Button disabled saat proses logout
   - Auto-redirect ke halaman login
   - Alert jika gagal logout

---

## 🔧 Technical Implementation

### API Endpoint: `/app/api/auth/logout/route.ts`

```typescript
POST /api/auth/logout
- Memanggil destroySession() untuk hapus cookie
- Return JSON success response
- Handle error dengan status 500
```

### Client-Side Handler (di setiap halaman admin):

```typescript
const handleLogout = async () => {
  try {
    setIsLoggingOut(true)
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (response.ok) {
      router.push('/login')
    } else {
      alert('Gagal logout. Silakan coba lagi.')
    }
  } catch (error) {
    console.error('Logout error:', error)
    alert('Terjadi kesalahan saat logout.')
  } finally {
    setIsLoggingOut(false)
  }
}
```

---

## 📁 Files Modified

1. **API Route**
   - `app/api/auth/logout/route.ts` ✅ (sudah ada)

2. **Admin Pages (ditambahkan logout handler)**
   - `app/admin/dashboard/page.tsx` ✅
   - `app/admin/agenda/page.tsx` ✅
   - `app/admin/reservations/page.tsx` ✅
   - `app/admin/tentang-simdik/page.tsx` ✅

3. **Auth Library**
   - `lib/auth.ts` (destroySession function)

4. **Layout Protection**
   - `app/admin/layout.tsx` (server-side auth check)

---

## 🧪 Testing Logout

### Test Case 1: Normal Logout
1. Login sebagai admin
2. Navigate ke salah satu halaman admin
3. Click tombol "Logout" di sidebar
4. **Expected**: Redirect ke `/login`
5. **Expected**: Tidak bisa akses `/admin/*` tanpa login lagi

### Test Case 2: Session Expired
1. Login sebagai admin
2. Tunggu 7 hari (atau hapus cookie manual)
3. Refresh halaman admin
4. **Expected**: Auto-redirect ke `/login`

### Test Case 3: Direct URL Access
1. Logout atau hapus cookie
2. Ketik URL `http://localhost:3000/admin/dashboard` di browser
3. **Expected**: Langsung redirect ke `/login`

---

## 🔒 Security Features

✅ **HttpOnly Cookie**: Cookie tidak bisa diakses via JavaScript (XSS protection)  
✅ **Secure Flag**: Cookie only sent via HTTPS in production  
✅ **SameSite**: CSRF protection  
✅ **Server-Side Check**: Auth check di server layout (tidak bisa bypass)  
✅ **Dynamic Rendering**: Tidak di-cache, selalu check session real-time

---

## 🎯 User Flow Diagram

```
┌─────────────┐
│   Login     │
│   Success   │
└──────┬──────┘
       │
       ├─ Session Cookie Created (7 days)
       │
       ▼
┌─────────────────┐
│  Admin Pages    │
│  - Dashboard    │
│  - Agenda       │
│  - Reservations │
│  - etc.         │
└────────┬────────┘
         │
         ├─ Click "Logout"
         │
         ▼
┌──────────────────┐
│  /api/auth/      │
│  logout          │
│  (Destroy Cookie)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Redirect to     │
│  /login          │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  Must Login      │
│  Again           │
└──────────────────┘
```

---

## 📝 Notes

- Logout button ada di **bottom sidebar** setiap halaman admin
- Logout button juga ada di **mobile sidebar**
- Loading state menampilkan "Logging out..." saat proses
- Error handling dengan alert message jika gagal
- Session cookie terhapus permanen setelah logout

---

## 🚀 Next Steps (Optional)

- [ ] Add "Are you sure?" confirmation dialog before logout
- [ ] Add logout success toast notification
- [ ] Track logout events for analytics
- [ ] Add "Remember Me" option untuk extend session
- [ ] Add session timeout warning (5 menit sebelum expire)



