import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const agendaSchema = z.object({
  title: z.string().min(1, 'Judul agenda harus diisi').max(255, 'Judul agenda terlalu panjang').optional(),
  // Slug bisa kosong (empty string), akan di-generate otomatis jika kosong
  slug: z.preprocess(
    (val) => {
      // Jika empty string atau whitespace, ubah menjadi undefined
      if (typeof val === 'string' && val.trim() === '') {
        return undefined
      }
      return val
    },
    z.string().max(255, 'Slug terlalu panjang').optional()
  ),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal harus diisi').optional(),
  time: z.string().min(1, 'Waktu harus diisi').optional(),
  location: z.string().min(1, 'Lokasi harus diisi').max(255, 'Lokasi terlalu panjang').optional(),
  address: z.string().optional(),
  organizer: z.string().optional(),
  capacity: z.preprocess(
    (val) => {
      // Handle null atau undefined
      if (val === null || val === undefined) {
        return undefined
      }
      // Handle empty string
      if (val === '') {
        return undefined
      }
      // Jika string, parse ke number
      if (typeof val === 'string') {
        const trimmed = val.trim()
        if (trimmed === '') {
          return undefined
        }
        const parsed = parseInt(trimmed, 10)
        // Jika hasil parse bukan number, return undefined
        if (isNaN(parsed)) {
          return undefined
        }
        // Jika negative, return 0 (atau undefined jika ingin reject)
        return parsed < 0 ? 0 : parsed
      }
      // Jika sudah number
      if (typeof val === 'number') {
        // Jika NaN, return undefined
        if (isNaN(val)) {
          return undefined
        }
        // Jika negative, return 0
        return val < 0 ? 0 : Math.floor(val)
      }
      return undefined
    },
    z.number().int().min(0).optional()
  ),
  category: z.string().optional(),
  registrationFee: z.string().optional(),
  contactPerson: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

/**
 * Membuat slug URL-friendly dari string
 * Contoh: "Rapat Koordinasi 2024" -> "rapat-koordinasi-2024"
 */
function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace karakter khusus dengan spasi
    .replace(/[^\w\s-]/g, '')
    // Replace spasi ganda dengan spasi tunggal
    .replace(/\s+/g, ' ')
    // Replace spasi dengan dash
    .replace(/\s/g, '-')
    // Hapus dash di awal dan akhir
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate slug yang unik untuk agenda
 * Jika slug sudah ada, akan menambahkan angka di belakang (slug-1, slug-2, dst)
 */
async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    // Cek apakah slug sudah ada di database
    const existingAgenda = await prisma.agenda.findUnique({
      where: { slug },
    })
    
    // Jika tidak ada atau adalah agenda yang sedang diupdate, return slug ini
    if (!existingAgenda || existingAgenda.id === excludeId) {
      return slug
    }
    
    // Jika sudah ada, tambahkan counter di belakang
    slug = `${baseSlug}-${counter}`
    counter++
    
    // Safety check: jika counter terlalu besar, tambahkan timestamp
    if (counter > 1000) {
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }
  
  return slug
}

// GET /api/agendas - Get all agendas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status: status.toUpperCase() as any } : {}

    const [agendas, total] = await Promise.all([
      prisma.agenda.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'asc' },
      }),
      prisma.agenda.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: agendas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching agendas:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data agenda' },
      { status: 500 }
    )
  }
}

// POST /api/agendas - Create new agenda
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Received body:', JSON.stringify(body, null, 2))
    console.log('📝 Body.title:', body.title)
    console.log('📝 Body.category:', body.category)
    
    // Preprocess data to handle different formats
    const processedBody = {
      ...body,
      // Convert date format if needed
      date: body.date ? (() => {
        // Handle MM/DD/YYYY format
        if (body.date.includes('/')) {
          const [month, day, year] = body.date.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        return body.date
      })() : body.date,
      // Convert time format if needed
      time: body.time ? (() => {
        // Handle 12-hour format (e.g., "12:00 PM")
        if (body.time.includes('AM') || body.time.includes('PM')) {
          const [timePart, period] = body.time.split(' ')
          const [hours, minutes] = timePart.split(':')
          let hour24 = parseInt(hours)
          if (period === 'PM' && hour24 !== 12) hour24 += 12
          if (period === 'AM' && hour24 === 12) hour24 = 0
          return `${hour24.toString().padStart(2, '0')}:${minutes}`
        }
        return body.time
      })() : body.time,
    }
    
    const validatedData = agendaSchema.parse(processedBody)
    console.log('✅ Validated data:', JSON.stringify(validatedData, null, 2))
    console.log('📝 Validated.title:', validatedData.title)

    // Generate slug if not provided
    // Setelah preprocess, empty string sudah diubah menjadi undefined
    let finalSlug: string
    if (!validatedData.slug) {
      // Generate slug dari title
      const title = validatedData.title || `Agenda ${validatedData.date ? new Date(validatedData.date).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}`
      const baseSlug = createSlugFromTitle(title)
      
      // Jika baseSlug kosong (misalnya title hanya karakter khusus), gunakan fallback
      if (!baseSlug || baseSlug.trim() === '') {
        const fallbackSlug = `agenda-${Date.now()}`
        finalSlug = await generateUniqueSlug(fallbackSlug)
      } else {
        finalSlug = await generateUniqueSlug(baseSlug)
      }
      
      console.log('🔗 Generated slug:', finalSlug)
    } else {
      // Jika slug sudah diisi, validasi bahwa slug unik
      finalSlug = await generateUniqueSlug(validatedData.slug.trim())
      console.log('🔗 Using provided slug:', finalSlug)
    }

    // Prepare data for Prisma - only use fields that exist in schema
    const agendaData = {
      title: validatedData.title || `Agenda ${validatedData.date ? new Date(validatedData.date).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}`,
      slug: finalSlug,
      description: validatedData.description || '',
      date: validatedData.date ? new Date(validatedData.date) : new Date(),
      time: validatedData.time || '09:00',
      location: validatedData.location || 'Lokasi belum ditentukan',
      address: validatedData.address || null,
      organizer: validatedData.organizer || 'Dinas Pendidikan Kota Banjarmasin',
      capacity: validatedData.capacity || 0,
      category: validatedData.category || 'Lainnya',
      registrationFee: validatedData.registrationFee || 'Gratis',
      contactPerson: validatedData.contactPerson || null,
      imageUrl: validatedData.imageUrl || null,
      status: validatedData.status || 'SCHEDULED',
    }

    try {
      const agenda = await prisma.agenda.create({
        data: agendaData,
      })

      return NextResponse.json(
        { success: true, data: agenda, message: 'Agenda berhasil dibuat' },
        { status: 201 }
      )
    } catch (createError: any) {
      // Handle unique constraint violation (slug duplikat)
      if (createError.code === 'P2002' && createError.meta?.target?.includes('slug')) {
        console.warn('⚠️ Slug collision detected, regenerating...')
        // Regenerate slug dengan timestamp untuk memastikan unik
        const title = validatedData.title || `Agenda ${validatedData.date ? new Date(validatedData.date).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}`
        const baseSlug = createSlugFromTitle(title) || `agenda-${Date.now()}`
        const uniqueSlug = `${baseSlug}-${Date.now()}`
        
        agendaData.slug = await generateUniqueSlug(uniqueSlug)
        
        // Retry create dengan slug baru
        const agenda = await prisma.agenda.create({
          data: agendaData,
        })

        return NextResponse.json(
          { success: true, data: agenda, message: 'Agenda berhasil dibuat' },
          { status: 201 }
        )
      }
      throw createError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { success: false, message: 'Data tidak valid', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating agenda:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat agenda' },
      { status: 500 }
    )
  }
}
