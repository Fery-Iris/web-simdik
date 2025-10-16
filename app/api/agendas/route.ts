import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const agendaSchema = z.object({
  title: z.string().min(1, 'Judul agenda harus diisi').max(255, 'Judul agenda terlalu panjang'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Format waktu tidak valid (HH:MM)'),
  location: z.string().min(1, 'Lokasi harus diisi').max(255, 'Lokasi terlalu panjang'),
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
    const validatedData = agendaSchema.parse(body)

    const agenda = await prisma.agenda.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    })

    return NextResponse.json(
      { success: true, data: agenda, message: 'Agenda berhasil dibuat' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
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
