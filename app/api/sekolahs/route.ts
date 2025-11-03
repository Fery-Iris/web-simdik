import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all sekolahs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jenjang = searchParams.get("jenjang")
    const kecamatan = searchParams.get("kecamatan")
    const akreditasi = searchParams.get("akreditasi")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}

    if (jenjang && jenjang !== "Semua") {
      where.jenjang = jenjang
    }

    if (kecamatan && kecamatan !== "Semua") {
      where.kecamatan = kecamatan
    }

    if (akreditasi && akreditasi !== "Semua") {
      where.akreditasi = akreditasi
    }

    if (status && status !== "Semua") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } }
      ]
    }

    const sekolahs = await prisma.sekolah.findMany({
      where,
      orderBy: { nama: "asc" },
    })

    // Convert BigInt to string
    const serialized = sekolahs.map((s) => ({
      ...s,
      id: s.id.toString(),
    }))

    const response = NextResponse.json({
      success: true,
      data: serialized
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error("Error fetching sekolahs:", error)
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data sekolah" },
      { status: 500 }
    )
  }
}

// POST create sekolah
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📝 Received sekolah body:", body)

    const sekolah = await prisma.sekolah.create({
      data: {
        nama: body.nama || "Nama Sekolah",
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

    console.log("✅ Sekolah created successfully:", sekolah.id)

    const serialized = {
      ...sekolah,
      id: sekolah.id.toString(),
    }

    return NextResponse.json({
      success: true,
      data: serialized
    }, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating sekolah:", error)
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data sekolah" },
      { status: 500 }
    )
  }
}

