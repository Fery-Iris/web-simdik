# Fix: Laporan Masuk Terbaru - Dashboard

## Masalah
"Laporan Masuk Terbaru" di dashboard admin menampilkan "Belum ada laporan masuk" meskipun sudah ada data reservasi baru di database.

## Penyebab
`reportsData` di-hardcode sebagai array kosong (`const reportsData: any[] = []`) sehingga tidak mengambil data dari API.

## Solusi yang Diterapkan

### 1. Menambahkan State untuk Recent Reservations
```tsx
const [recentReservations, setRecentReservations] = useState<any[]>([])
```

### 2. Fetch dan Sort Recent Reservations
Di dalam `useEffect`, setelah fetch reservations:
```tsx
// Set recent reservations (latest 5, sorted by createdAt)
const sortedReservations = [...reservations]
  .sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || a.date).getTime()
    const dateB = new Date(b.createdAt || b.date).getTime()
    return dateB - dateA // Most recent first
  })
  .slice(0, 5)
setRecentReservations(sortedReservations)
```

### 3. Transform Reservations ke Format Reports
Mengubah `reportsData` dari array kosong menjadi:
```tsx
const reportsData = recentReservations.map((reservation: any) => {
  // Map status to Indonesian
  let statusText = 'Baru'
  let statusColor = 'bg-blue-600 text-white'
  
  if (reservation.status === 'completed') {
    statusText = 'Selesai'
    statusColor = 'bg-green-600 text-white'
  } else if (reservation.status === 'waiting') {
    statusText = 'Menunggu'
    statusColor = 'bg-yellow-600 text-white'
  } else if (reservation.status === 'cancelled') {
    statusText = 'Dibatalkan'
    statusColor = 'bg-red-600 text-white'
  }
  
  return {
    id: reservation.id,
    reporter: reservation.name || reservation.institutionName || 'N/A',
    category: reservation.layanan?.name || reservation.service || 'Reservasi',
    status: statusText,
    statusColor: statusColor,
    title: `Reservasi ${reservation.layanan?.name || reservation.service || ''}`,
    description: reservation.notes || 'Tidak ada catatan',
    date: new Date(reservation.createdAt || reservation.date).toLocaleDateString('id-ID'),
    time: reservation.time || new Date(reservation.createdAt).toLocaleTimeString('id-ID'),
    contact: reservation.email || reservation.phone || 'N/A',
    reservationDate: new Date(reservation.date).toLocaleDateString('id-ID')
  }
})
```

### 4. Update Modal Detail Laporan
Mengubah field di modal detail untuk menampilkan informasi reservasi yang benar:
- Pelapor → Nama/Instansi
- Sekolah → Kategori Layanan
- Tanggal Laporan → Tanggal Dibuat
- Prioritas → (dihapus, tidak relevan)
- Bukti/Lampiran → (dihapus, tidak ada di reservasi)
- Tambah: Tanggal Reservasi, Waktu

## Hasil

### Before:
- Tabel "Laporan Masuk Terbaru" selalu kosong
- Menampilkan "Belum ada laporan masuk"

### After:
- Menampilkan 5 reservasi terbaru
- Data sorted berdasarkan tanggal pembuatan (paling baru di atas)
- Status diterjemahkan ke bahasa Indonesia:
  - `completed` → Selesai (hijau)
  - `waiting` → Menunggu (kuning)
  - `cancelled` → Dibatalkan (merah)
  - default → Baru (biru)
- Detail modal menampilkan informasi lengkap reservasi

## Testing

1. Buka dashboard admin: http://localhost:3001/admin/dashboard
2. Scroll ke bagian "Laporan Masuk Terbaru"
3. Verify:
   - ✅ Tabel menampilkan data reservasi terbaru
   - ✅ Data sorted berdasarkan tanggal (paling baru di atas)
   - ✅ Status badge dengan warna yang sesuai
   - ✅ Tombol "Lihat Detail" berfungsi
   - ✅ Modal detail menampilkan informasi lengkap

4. Tambah reservasi baru dari halaman publik
5. Refresh dashboard
6. Verify:
   - ✅ Reservasi baru muncul di posisi teratas
   - ✅ Total count di card "Total Reservasi" bertambah
   - ✅ Chart "Laporan Reservasi" terupdate

## Console Logs
Untuk debugging, ditambahkan log:
```
📋 Recent reservations: X
```
Dimana X adalah jumlah reservasi yang ditampilkan (maksimal 5).

## Files Modified
- `app/admin/dashboard/page.tsx`
  - Added state: `recentReservations`
  - Added sorting and slicing logic in `useEffect`
  - Transformed `reportsData` from empty array to mapped data
  - Updated modal detail fields

## Notes
- Data diambil dari `/api/reservations`
- Sorting berdasarkan `createdAt` atau `date` field
- Maksimal 5 reservasi terbaru yang ditampilkan
- Real-time update saat page refresh (belum auto-refresh)
- Status mapping sesuai dengan database values

## Future Improvements
1. Add auto-refresh setiap X detik
2. Add filter by status
3. Add pagination jika ada banyak data
4. Add search functionality
5. Add update status action di modal
