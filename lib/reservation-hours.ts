/**
 * Utility functions untuk mengecek status buka/tutup reservasi berdasarkan waktu real-time
 */

export interface ReservationStatus {
  isOpen: boolean
  message: string
  nextOpenTime?: string
}

/**
 * Mengecek apakah reservasi sedang buka atau tutup berdasarkan waktu saat ini
 * Aturan:
 * - Senin-Kamis: Buka 08:00 - 16:00, Tutup 16:00 - 08:00 (hari berikutnya)
 * - Jumat: Buka 08:00 - 10:00, Tutup setelah 10:00
 * - Sabtu-Minggu: Selalu tutup
 */
export function checkReservationStatus(): ReservationStatus {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute // Total menit sejak 00:00

  // Sabtu (6) dan Minggu (0) - selalu tutup
  if (currentDay === 0 || currentDay === 6) {
    const nextMonday = new Date(now)
    const daysUntilMonday = currentDay === 0 ? 1 : 2
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    nextMonday.setHours(8, 0, 0, 0)
    
    return {
      isOpen: false,
      message: "Reservasi tutup pada hari Sabtu dan Minggu",
      nextOpenTime: nextMonday.toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  // Jumat (5) - buka 08:00 - 10:00
  if (currentDay === 5) {
    const openTime = 8 * 60 // 08:00 dalam menit
    const closeTime = 10 * 60 // 10:00 dalam menit

    if (currentTime >= openTime && currentTime < closeTime) {
      return {
        isOpen: true,
        message: "Reservasi buka (Jumat: 08:00 - 10:00)",
      }
    } else {
      // Setelah jam 10:00, tutup sampai Senin 08:00
      const nextMonday = new Date(now)
      nextMonday.setDate(now.getDate() + 3) // Jumat + 3 hari = Senin
      nextMonday.setHours(8, 0, 0, 0)
      
      return {
        isOpen: false,
        message: "Reservasi tutup. Jumat hanya buka 08:00 - 10:00",
        nextOpenTime: nextMonday.toLocaleString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    }
  }

  // Senin-Kamis (1-4) - buka 08:00 - 16:00
  const openTime = 8 * 60 // 08:00 dalam menit
  const closeTime = 16 * 60 // 16:00 dalam menit

  if (currentTime >= openTime && currentTime < closeTime) {
    return {
      isOpen: true,
      message: "Reservasi buka (Senin-Kamis: 08:00 - 16:00)",
    }
  } else {
    // Sebelum jam 08:00 atau setelah jam 16:00
    let nextOpenTime: Date
    
    if (currentTime < openTime) {
      // Masih hari yang sama, buka jam 08:00
      nextOpenTime = new Date(now)
      nextOpenTime.setHours(8, 0, 0, 0)
    } else {
      // Setelah jam 16:00, buka besok jam 08:00
      nextOpenTime = new Date(now)
      nextOpenTime.setDate(now.getDate() + 1)
      nextOpenTime.setHours(8, 0, 0, 0)
    }
    
    return {
      isOpen: false,
      message: "Reservasi tutup. Buka kembali jam 08:00",
      nextOpenTime: nextOpenTime.toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }
}

/**
 * Mengecek apakah waktu tertentu valid untuk reservasi
 */
export function isValidReservationTime(date: Date, timeSlot: string): boolean {
  const dayOfWeek = date.getDay()
  
  // Sabtu dan Minggu tidak valid
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false
  }
  
  // Jumat hanya 08:00 - 10:00
  if (dayOfWeek === 5) {
    const slotHour = parseInt(timeSlot.split(':')[0])
    return slotHour >= 8 && slotHour < 10
  }
  
  // Senin-Kamis: 08:00 - 12:00 dan 14:00 - 16:00
  const slotHour = parseInt(timeSlot.split(':')[0])
  return (slotHour >= 8 && slotHour < 12) || (slotHour >= 14 && slotHour < 16)
}

/**
 * Mengecek apakah slot waktu sudah lewat (untuk hari yang sama)
 * Slot dianggap lewat jika waktu saat ini >= waktu akhir slot
 * Contoh: Slot 09:00 - 10:00 masih bisa dipilih sampai jam 10:00
 * @param selectedDate Tanggal yang dipilih
 * @param timeSlot Slot waktu dalam format "HH:MM" (waktu awal slot)
 * @returns true jika slot waktu sudah lewat (untuk hari yang sama)
 */
export function isTimeSlotPassed(selectedDate: Date, timeSlot: string): boolean {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  
  // Jika bukan hari yang sama, slot belum lewat
  if (today.getTime() !== selected.getTime()) {
    return false
  }
  
  // Jika hari yang sama, cek apakah waktu akhir slot sudah lewat
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  // Waktu akhir slot adalah 1 jam setelah waktu awal (contoh: 09:00 -> 10:00)
  const slotEndHour = slotHour + 1
  const slotEndTime = slotEndHour * 60 + slotMinute // Total menit sejak 00:00 untuk waktu akhir
  const currentTime = now.getHours() * 60 + now.getMinutes() // Total menit sejak 00:00
  
  // Slot dianggap lewat jika waktu saat ini >= waktu akhir slot
  // Contoh: Slot 09:00 - 10:00, jika sekarang jam 10:00 atau lebih, maka sudah lewat
  return currentTime >= slotEndTime
}

