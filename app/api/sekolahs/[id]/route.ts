import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: BigInt(params.id) },
    })

    if (!sekolah) {
      return NextResponse.json(
        { error: "Sekolah tidak ditemukan" },
        { status: 404 }
      )
    }

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
    }

    return NextResponse.json({ success: true, data: serialized })
  } catch (error) {
    console.error("Error fetching sekolah:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data sekolah" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const sekolah = await prisma.sekolah.update({
      where: { id: BigInt(params.id) },
      data: {
        nama: body.nama,
        alamat: body.alamat,
        kecamatan: body.kecamatan,
        jenjang: body.jenjang,
        akreditasi: body.akreditasi,
        status: body.status,
        telepon: body.telepon,
        email: body.email,
        tahunBerdiri: body.tahunBerdiri,
        deskripsi: body.deskripsi,
        gambarUtama: body.gambarUtama,
        foto1: body.foto1,
        foto2: body.foto2,
      },
    })

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
    }

    return NextResponse.json({ success: true, data: serialized })
  } catch (error) {
    console.error("Error updating sekolah:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate data sekolah" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sekolah.delete({
      where: { id: BigInt(params.id) },
    })

    return NextResponse.json({ success: true, message: "Sekolah berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting sekolah:", error)
    return NextResponse.json(
      { error: "Gagal menghapus data sekolah" },
      { status: 500 }
    )
  }
}

