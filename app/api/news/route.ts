import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Zod schema for validation
const beritaSchema = z.object({
  judul: z.string().optional(),
  slug: z.string().optional(),
  ringkasan: z.string().optional(),
  konten: z.string().optional(),
  kategori: z.enum(["PENGUMUMAN", "KEGIATAN", "PENDAFTARAN", "KEUANGAN", "KERJASAMA", "BEASISWA"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  tanggalTerbit: z.string().optional(),
  unggulan: z.boolean().optional(),
  gambarUtama: z.string().optional(),
  tags: z.string().optional(),
  idPenggunas: z.number().optional(),
})

// GET all berita
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const kategori = searchParams.get("kategori")
    const status = searchParams.get("status")

    const where: any = {}

    if (kategori && kategori !== "Semua") {
      where.kategori = kategori
    }

    if (status && status !== "all") {
      where.status = status
    } else if (!status) {
      // By default, only show published news on frontend
      where.status = "PUBLISHED"
    }

    const berita = await prisma.berita.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? Number.parseInt(limit) : undefined,
    })

    console.log(`📰 Fetched ${berita.length} berita with status: ${status || 'PUBLISHED'}`)

    // Convert BigInt to string for JSON serialization
    const serializedBerita = berita.map((item) => ({
      ...item,
      id: item.id.toString(),
      idPenggunas: item.idPenggunas ? item.idPenggunas.toString() : null,
      sekolahId: item.sekolahId ? item.sekolahId.toString() : null,
    }))

    // Set cache headers to prevent stale data
    const response = NextResponse.json(serializedBerita)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error("Error fetching berita:", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}

// POST create berita
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📝 Received berita body:", body)

    // Validate with Zod
    const validatedData = beritaSchema.parse(body)

    // Generate slug from judul or use sequential number
    let slug = validatedData.slug
    if (!slug) {
      const beritaCount = await prisma.berita.count()
      slug = String(beritaCount + 1)
    }

    // Get first admin user from penggunas table as default (if exists)
    let defaultPenggunaId: BigInt | null = null
    try {
      const firstPengguna = await prisma.pengguna.findFirst({
        orderBy: { id: 'asc' }
      })
      if (firstPengguna) {
        defaultPenggunaId = firstPengguna.id
        console.log("✅ Found default pengguna ID:", defaultPenggunaId.toString())
      } else {
        console.warn("⚠️ No pengguna found in database, creating berita without author")
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch default pengguna:", err)
    }

    // Prepare berita data with defaults
    const beritaData = {
      judul: validatedData.judul || `Berita ${new Date().toLocaleDateString("id-ID")}`,
      slug,
      ringkasan: validatedData.ringkasan || "",
      konten: validatedData.konten || "",
      kategori: validatedData.kategori || "PENGUMUMAN",
      status: validatedData.status || "PUBLISHED",
      tanggalTerbit: validatedData.tanggalTerbit ? new Date(validatedData.tanggalTerbit) : new Date(),
      unggulan: validatedData.unggulan || false,
      gambarUtama: validatedData.gambarUtama || null,
      views: 0,
      tags: validatedData.tags || null,
      idPenggunas: validatedData.idPenggunas ? BigInt(validatedData.idPenggunas) : defaultPenggunaId,
      sekolahId: null,
    }

    console.log("💾 Creating berita with data:", beritaData)

    const berita = await prisma.berita.create({
      data: beritaData,
    })

    console.log("✅ Berita created successfully:", berita.id)

    // Convert BigInt to string for JSON
    const serialized = {
      ...berita,
      id: berita.id.toString(),
      idPenggunas: berita.idPenggunas ? berita.idPenggunas.toString() : null,
      sekolahId: berita.sekolahId ? berita.sekolahId.toString() : null,
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation errors:", error.errors)
      return NextResponse.json({ error: "Data tidak valid", details: error.errors }, { status: 400 })
    }

    console.error("❌ Error creating berita:", error)
    return NextResponse.json({ error: "Gagal menyimpan berita" }, { status: 500 })
  }
}

