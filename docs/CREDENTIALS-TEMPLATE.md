# 🔐 Credentials Template - Untuk Lead Developer

> Template untuk share credentials ke tim baru secara aman

---

## 📝 Cara Menggunakan Template Ini

**Sebagai Lead Developer:**

1. Copy template di bawah
2. Ganti `[PLACEHOLDER]` dengan credentials asli
3. Share ke developer baru via **secure channel**:
   - ✅ Slack/Teams Direct Message (private)
   - ✅ Encrypted email
   - ✅ Password-protected document
   - ✅ Secure file sharing (Google Drive private link, etc)
4. ❌ **JANGAN** share via:
   - Public chat
   - Screenshot di grup
   - Commit ke Git
   - Unencrypted email

---

## 📄 Template `.env.local`

```env
# ============================================
# SIMDIK - Environment Variables
# Project: Web SIMDIK (Dinas Pendidikan Kota Banjarmasin)
# ============================================

# ============================================
# DATABASE (Supabase PostgreSQL)
# ============================================
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Cara mendapatkan:
# 1. Supabase Dashboard → Project Settings → Database
# 2. Connection String → URI
# 3. Copy dan replace [PASSWORD] dengan database password

# ============================================
# SUPABASE STORAGE (untuk Upload Foto)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[REPLACE_WITH_REAL_KEY]"
NEXT_PUBLIC_SUPABASE_BUCKET="SIMDIK-Uploads"

# Cara mendapatkan:
# 1. Supabase Dashboard → Project Settings → API
# 2. Project URL → Copy ke NEXT_PUBLIC_SUPABASE_URL
# 3. Project API keys → anon public → Copy ke NEXT_PUBLIC_SUPABASE_ANON_KEY

# ============================================
# NOTES
# ============================================
# - File ini WAJIB ada di root project
# - File ini sudah di-gitignore, aman
# - JANGAN commit file ini ke Git
# - JANGAN share file ini di public
```

---

## 🔑 Credentials Checklist

Sebelum share ke developer baru, pastikan:

- [ ] `[PROJECT_ID]` sudah diganti dengan ID asli
- [ ] `[PASSWORD]` sudah diganti dengan password asli
- [ ] `NEXT_PUBLIC_SUPABASE_URL` sudah lengkap
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah lengkap (full JWT token)
- [ ] Test credentials sendiri dulu (copy-paste ke `.env.local` lokal dan test)
- [ ] Hapus comments jika mau (supaya lebih pendek)

---

## 📋 Informasi Tambahan untuk Developer Baru

### Admin Credentials

```
URL: http://localhost:3000/login
Email: [ADMIN_EMAIL]
Password: [ADMIN_PASSWORD]
```

### Supabase Dashboard Access

```
URL: https://supabase.com/dashboard/project/[PROJECT_ID]
Email: [DEV_EMAIL]
Status: [Pending invitation / Already invited]
```

**Note untuk Lead Dev:** Invite developer baru ke Supabase project:
1. Supabase Dashboard → Project Settings → Team
2. Invite member → Masukkan email developer
3. Pilih role: `Developer` (read + write) atau `Read-only`

---

## 🔒 Security Best Practices

### DO:
- ✅ Share via encrypted/private channel
- ✅ Rotate credentials secara berkala
- ✅ Use password manager untuk backup
- ✅ Revoke access saat developer keluar dari tim
- ✅ Monitor Supabase logs untuk suspicious activity

### DON'T:
- ❌ Share via public chat/forum
- ❌ Commit credentials ke Git
- ❌ Hard-code credentials di code
- ❌ Screenshot dan share di grup
- ❌ Send via unencrypted email

---

## 📞 Contact

**Jika credentials tidak bekerja:**
- Contact: [LEAD_DEVELOPER_NAME]
- Email: [LEAD_DEVELOPER_EMAIL]
- Slack/Teams: [@LEAD_DEVELOPER_USERNAME]

---

**Last Updated:** [DATE]  
**Maintained by:** [LEAD_DEVELOPER_NAME]

