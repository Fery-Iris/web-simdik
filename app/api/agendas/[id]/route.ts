import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const agendaSchema = z.object({
  title: z.string().min(1, 'Judul agenda harus diisi').max(255, 'Judul agenda terlalu panjang'),
  slug: z.string().min(1, 'Slug harus diisi').max(255, 'Slug terlalu panjang').optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal harus diisi'),
  time: z.string().min(1, 'Waktu harus diisi'),
  location: z.string().min(1, 'Lokasi harus diisi').max(255, 'Lokasi terlalu panjang'),
  address: z.string().optional(),
  organizer: z.string().optional(),
  capacity: z.union([z.number().int().min(0), z.string().transform(val => parseInt(val) || 0)]).optional(),
  category: z.string().optional(),
  registrationFee: z.string().optional(),
  contactPerson: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

// GET /api/agendas/[id] - Get single agenda
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agenda = await prisma.agenda.findUnique({
      where: { id: params.id },
    })

    if (!agenda) {
      return NextResponse.json(
        { success: false, message: 'Agenda tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: agenda,
    })
  } catch (error) {
    console.error('Error fetching agenda:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data agenda' },
      { status: 500 }
    )
  }
}

// PUT /api/agendas/[id] - Update agenda
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
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

    // Check if agenda exists
    const existingAgenda = await prisma.agenda.findUnique({
      where: { id: params.id },
    })

    if (!existingAgenda) {
      return NextResponse.json(
        { success: false, message: 'Agenda tidak ditemukan' },
        { status: 404 }
      )
    }

    const agenda = await prisma.agenda.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    })

    return NextResponse.json({
      success: true,
      data: agenda,
      message: 'Agenda berhasil diperbarui',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { success: false, message: 'Data tidak valid', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating agenda:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui agenda' },
      { status: 500 }
    )
  }
}

// DELETE /api/agendas/[id] - Delete agenda
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if agenda exists
    const existingAgenda = await prisma.agenda.findUnique({
      where: { id: params.id },
    })

    if (!existingAgenda) {
      return NextResponse.json(
        { success: false, message: 'Agenda tidak ditemukan' },
        { status: 404 }
      )
    }

    await prisma.agenda.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Agenda berhasil dihapus',
    })
  } catch (error) {
    console.error('Error deleting agenda:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus agenda' },
      { status: 500 }
    )
  }
}
