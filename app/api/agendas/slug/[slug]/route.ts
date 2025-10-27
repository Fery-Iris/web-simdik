import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/agendas/slug/[slug] - Get agenda by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agenda = await prisma.agenda.findUnique({
      where: { slug: params.slug },
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
    console.error('Error fetching agenda by slug:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data agenda' },
      { status: 500 }
    )
  }
}
