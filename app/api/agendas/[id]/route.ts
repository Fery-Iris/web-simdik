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
    const validatedData = agendaSchema.parse(body)

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
