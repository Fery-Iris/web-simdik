# Direktori Sekolah - Layout Update

## 📋 Overview

Update layout direktori sekolah agar konsisten dengan halaman berita dan menggunakan cover image dinas.

## 🎨 Changes Applied

### 1. **Hero Section - Cover Image**

#### Before:
```tsx
<section className="relative py-20 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
  <div className="absolute inset-0 bg-grid-white/10"></div>
  // ... simple gradient background
</section>
```

#### After:
```tsx
<section className="relative py-20 overflow-hidden">
  <div className="absolute inset-0">
    <Image
      src="/images/dinas-pendidikan-banjarmasin-real.jpeg"
      alt="Kantor Dinas Pendidikan Kota Banjarmasin"
      fill
      className="object-cover object-center"
      priority
    />
    <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
  </div>
  // ... same as homepage hero
</section>
```

**✅ Result**: Menggunakan foto cover dinas yang sama seperti dashboard

### 2. **Container Width - Centered Layout**

#### Before:
```tsx
<div className="container mx-auto px-4">
```

#### After:
```tsx
<div className="max-w-6xl mx-auto px-4">
```

**✅ Result**: Content lebih centered dan konsisten dengan halaman berita

### 3. **Back Button**

#### Added:
```tsx
<div className="mb-6">
  <Link href="/">
    <Button variant="outline" className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent">
      <ArrowLeft className="w-4 h-4" />
      <span>Kembali ke Beranda</span>
    </Button>
  </Link>
</div>
```

**✅ Result**: Navigasi lebih mudah, konsisten dengan berita

### 4. **Page Header**

#### Added:
```tsx
<div className="mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Semua Sekolah</h1>
  <p className="text-muted-foreground text-lg">
    Temukan informasi lengkap sekolah di Kota Banjarmasin
  </p>
</div>
```

**✅ Result**: Header yang jelas dan konsisten

### 5. **Search & Filter Section**

#### Before:
```tsx
<Card className="mb-8">
  <CardContent className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      // Search + 2 dropdowns in grid
    </div>
  </CardContent>
</Card>
```

#### After:
```tsx
<div className="mb-8 space-y-4">
  {/* Search Bar */}
  <div className="relative max-w-md">
    <Search className="..." />
    <Input placeholder="Cari nama sekolah..." />
  </div>

  {/* Filters */}
  <div className="flex flex-wrap gap-2">
    <Button>Semua Jenjang</Button>
    <Button>PAUD</Button>
    <Button>SD</Button>
    <Button>SMP</Button>
    <Select>Kecamatan</Select>
  </div>
</div>
```

**✅ Result**: Filter buttons seperti berita, lebih visual dan mudah digunakan

### 6. **Background & Colors**

#### Before:
```tsx
bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800
text-gray-600
```

#### After:
```tsx
bg-background
text-muted-foreground
text-foreground
```

**✅ Result**: Menggunakan theme colors yang konsisten

### 7. **Detail Page - Same Updates**

Applied same changes to detail page:
- ✅ `max-w-6xl` container
- ✅ `bg-background` instead of gradient
- ✅ Theme colors (`text-foreground`, `text-muted-foreground`)

## 🎯 Design Consistency

### Layout Comparison

| Feature | Homepage | Berita | Agenda | **Direktori Sekolah** |
|---------|----------|--------|--------|---------------------|
| Hero Cover | ✅ Dinas photo | ❌ Gradient | ❌ Gradient | ✅ Dinas photo |
| Container Width | `max-w-6xl` | `max-w-6xl` | - | ✅ `max-w-6xl` |
| Back Button | - | ✅ | ✅ | ✅ |
| Page Header | - | ✅ | ✅ | ✅ |
| Filter Style | - | ✅ Buttons | - | ✅ Buttons |
| Theme Colors | ✅ | ✅ | ✅ | ✅ |

## 📐 Layout Structure

### Listing Page (`/direktori-sekolah`)

```
┌─────────────────────────────────────────┐
│         HEADER (SiteHeader)             │
├─────────────────────────────────────────┤
│   HERO SECTION (Cover Image)           │
│   - Dinas photo background              │
│   - Blue overlay (opacity-70)           │
│   - School icon + title + subtitle     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   MAIN CONTENT (max-w-6xl centered)    │
│                                         │
│   [← Kembali ke Beranda]                │
│                                         │
│   Semua Sekolah                         │
│   Temukan informasi lengkap...          │
│                                         │
│   🔍 [Search bar]                       │
│   [Semua] [PAUD] [SD] [SMP] [Kec ▼]    │
│   Menampilkan X sekolah                 │
│                                         │
│   ┌──────┐ ┌──────┐ ┌──────┐           │
│   │School│ │School│ │School│           │
│   │ Card │ │ Card │ │ Card │           │
│   └──────┘ └──────┘ └──────┘           │
│                                         │
│   [Pagination]                          │
└─────────────────────────────────────────┘
```

### Detail Page (`/direktori-sekolah/[id]`)

```
┌─────────────────────────────────────────┐
│   MAIN CONTENT (max-w-6xl centered)    │
│                                         │
│   [← Kembali]                           │
│                                         │
│   ┌──────────────┬──────────┐          │
│   │ Main Content │ Sidebar  │          │
│   │ (2/3 width)  │ (1/3)    │          │
│   │              │          │          │
│   │ Hero Image   │ Contact  │          │
│   │ School Info  │ Info     │          │
│   │ Description  │          │          │
│   │ Gallery      │ Stats    │          │
│   └──────────────┴──────────┘          │
└─────────────────────────────────────────┘
```

## 🎨 Visual Elements

### Hero Section
- **Image**: `/images/dinas-pendidikan-banjarmasin-real.jpeg`
- **Overlay**: `bg-blue-900 opacity-70`
- **Text Color**: White
- **Icon**: School (16x16)

### Filter Buttons
- **Active**: `bg-blue-600 hover:bg-blue-700` (white text)
- **Inactive**: `bg-transparent hover:bg-blue-50 hover:border-blue-300`
- **Size**: `sm`
- **Transition**: `transition-all duration-300`

### Colors
- **Background**: `bg-background` (theme-aware)
- **Text Primary**: `text-foreground`
- **Text Secondary**: `text-muted-foreground`
- **Blue Primary**: `blue-600` / `blue-700`

## 📁 Files Updated

- ✅ `app/direktori-sekolah/page.tsx` - Listing page layout
- ✅ `app/direktori-sekolah/[id]/page.tsx` - Detail page layout
- ✅ `docs/direktori-sekolah-layout-update.md` - This documentation

## 🧪 Testing

- [x] Hero cover image loads correctly
- [x] Container is centered (max-w-6xl)
- [x] Back button navigates to homepage
- [x] Page header displays correctly
- [x] Search bar works
- [x] Filter buttons toggle correctly
- [x] Kecamatan dropdown shows dynamic data
- [x] Grid layout responsive (1/2/3 columns)
- [x] Detail page uses same layout
- [x] Theme colors work in dark mode
- [x] No linter errors

## 🎯 Result

**Before**: 
- Simple gradient hero
- Full-width container
- Dropdown filters only
- Inconsistent with other pages

**After**:
- ✅ Dinas cover photo (same as homepage)
- ✅ Centered layout (max-w-6xl)
- ✅ Button filters (like berita)
- ✅ Back button navigation
- ✅ Consistent page header
- ✅ Theme-aware colors
- ✅ Professional & cohesive design

## 📝 Notes

1. **Cover Image**: Menggunakan image yang sama dengan homepage untuk konsistensi brand
2. **Layout Width**: `max-w-6xl` memberikan reading experience yang optimal
3. **Filter UX**: Button filters lebih visual dan mudah diakses dibanding dropdown
4. **Theme Support**: Semua colors menggunakan theme variables untuk dark mode support
5. **Responsive**: Layout tetap responsive di semua breakpoints

