import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const agendaSchema = z.object({
  title: z.string().min(1, 'Judul agenda harus diisi').max(255, 'Judul agenda terlalu panjang').optional(),
  slug: z.string().min(1, 'Slug harus diisi').max(255, 'Slug terlalu panjang').optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal harus diisi').optional(),
  time: z.string().min(1, 'Waktu harus diisi').optional(),
  location: z.string().min(1, 'Lokasi harus diisi').max(255, 'Lokasi terlalu panjang').optional(),
  address: z.string().optional(),
  organizer: z.string().optional(),
  capacity: z.union([z.number().int().min(0), z.string().transform(val => parseInt(val) || 0)]).optional(),
  category: z.string().optional(),
  registrationFee: z.string().optional(),
  contactPerson: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

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
    let slug = validatedData.slug
    if (!slug) {
      // Get the count of existing agendas to generate a sequential slug
      const agendaCount = await prisma.agenda.count()
      slug = (agendaCount + 1).toString()
    }

    // Use slug as is for now (can be improved later)
    const finalSlug = slug

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

    const agenda = await prisma.agenda.create({
      data: agendaData,
    })

    return NextResponse.json(
      { success: true, data: agenda, message: 'Agenda berhasil dibuat' },
      { status: 201 }
    )
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
