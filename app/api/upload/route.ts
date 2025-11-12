import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase (opsional - fallback ke local storage jika tidak ada)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'SIMDIK-Uploads'

// DEBUG: Log environment variables (untuk troubleshooting)
console.log('🔍 DEBUG Environment Variables:')
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ NOT SET')
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ NOT SET')
console.log('  NEXT_PUBLIC_SUPABASE_BUCKET:', supabaseBucket)

// Check apakah Supabase tersedia
const useSupabase = !!(supabaseUrl && supabaseKey)

let supabase: ReturnType<typeof createClient> | null = null
if (useSupabase) {
  try {
    supabase = createClient(supabaseUrl!, supabaseKey!)
    console.log('✅ Supabase Storage enabled')
    console.log('   URL:', supabaseUrl)
    console.log('   Bucket:', supabaseBucket)
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error)
    console.log('⚠️  Falling back to local storage')
  }
} else {
  console.log('⚠️  Supabase not configured, using local storage')
  console.log('   Missing:', !supabaseUrl ? 'URL' : '', !supabaseKey ? 'ANON_KEY' : '')
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file yang diupload' },
        { status: 400 }
      )
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP' },
        { status: 400 }
      )
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file terlalu besar. Maksimal 5MB' },
        { status: 400 }
      )
    }

    // Deteksi folder berdasarkan referer atau default ke 'agendas'
    const referer = request.headers.get('referer') || ''
    let folder = 'agendas'
    let prefix = 'agenda'
    
    if (referer.includes('/admin/schools')) {
      folder = 'sekolahs'
      prefix = 'sekolah'
    } else if (referer.includes('/admin/news')) {
      folder = 'beritas'
      prefix = 'berita'
    }

    // Generate nama file unik
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${prefix}-${timestamp}-${randomString}.${fileExtension}`

    let fileUrl: string

    // Upload ke Supabase Storage atau Local Storage
    if (useSupabase && supabase) {
      // ===== SUPABASE STORAGE (Production) =====
      try {
        const storagePath = `${folder}/${fileName}`
        
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload ke Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(supabaseBucket)
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Supabase upload error:', uploadError)
          throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(supabaseBucket)
          .getPublicUrl(storagePath)

        fileUrl = publicUrl
        console.log(`✅ Uploaded to Supabase: ${fileUrl}`)

      } catch (supabaseError) {
        console.error('Supabase error, falling back to local storage:', supabaseError)
        // Fallback ke local storage jika Supabase gagal
        fileUrl = await uploadToLocal(folder, fileName, file)
      }

    } else {
      // ===== LOCAL STORAGE (Development) =====
      fileUrl = await uploadToLocal(folder, fileName, file)
    }

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        storage: useSupabase ? 'supabase' : 'local'
      }
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}

/**
 * Upload file ke local storage (fallback untuk development)
 */
async function uploadToLocal(folder: string, fileName: string, file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Buat direktori uploads jika belum ada
  const uploadsDir = join(process.cwd(), 'public', 'uploads', folder)
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  const filePath = join(uploadsDir, fileName)
  await writeFile(filePath, buffer)

  const fileUrl = `/uploads/${folder}/${fileName}`
  console.log(`✅ Uploaded to local: ${fileUrl}`)
  
  return fileUrl
}
