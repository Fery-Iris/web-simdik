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
})

// GET single berita by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { id: BigInt(params.id) },
    })

    if (!berita) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    // Increment views
    await prisma.berita.update({
      where: { id: BigInt(params.id) },
      data: { views: { increment: 1 } },
    })

    // Convert BigInt to string for JSON
    const serialized = {
      ...berita,
      id: berita.id.toString(),
      idPenggunas: berita.idPenggunas ? berita.idPenggunas.toString() : null,
      idSekolahs: berita.idSekolahs ? berita.idSekolahs.toString() : null,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching berita:", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}

// PUT update berita
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log("📝 Updating berita with ID:", params.id)
    console.log("📝 Request body:", body)

    // Validate with Zod
    const validatedData = beritaSchema.parse(body)
    console.log("✅ Validation passed")

    // Build the update data object
    // Using explicit property assignment to avoid any issues
    const prismaUpdateData: {
      judul?: string
      slug?: string
      ringkasan?: string
      konten?: string
      kategori?: "PENGUMUMAN" | "KEGIATAN" | "PENDAFTARAN" | "KEUANGAN" | "KERJASAMA" | "BEASISWA"
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      tanggalTerbit?: Date
      unggulan?: boolean
      gambarUtama?: string | null
      tags?: string | null
    } = {}

    // Manually assign each field if it exists
    if (validatedData.judul) prismaUpdateData.judul = validatedData.judul
    if (validatedData.slug) prismaUpdateData.slug = validatedData.slug
    if (validatedData.ringkasan !== undefined) prismaUpdateData.ringkasan = validatedData.ringkasan
    if (validatedData.konten) prismaUpdateData.konten = validatedData.konten
    if (validatedData.kategori) prismaUpdateData.kategori = validatedData.kategori
    if (validatedData.status) prismaUpdateData.status = validatedData.status
    if (validatedData.tanggalTerbit) {
      prismaUpdateData.tanggalTerbit = new Date(validatedData.tanggalTerbit)
    }
    if (validatedData.unggulan !== undefined) prismaUpdateData.unggulan = validatedData.unggulan
    if (validatedData.gambarUtama !== undefined) {
      prismaUpdateData.gambarUtama = validatedData.gambarUtama || null
    }
    if (validatedData.tags !== undefined) {
      prismaUpdateData.tags = validatedData.tags || null
    }

    console.log("💾 Update data prepared:", JSON.stringify(prismaUpdateData, (key, value) => {
      return value instanceof Date ? value.toISOString() : value
    }, 2))

    // Execute the update
    const updatedBerita = await prisma.berita.update({
      where: { 
        id: BigInt(params.id) 
      },
      data: prismaUpdateData,
    })

    console.log("✅ Berita updated successfully")

    // Convert BigInt to string for JSON
    const serialized = {
      ...updatedBerita,
      id: updatedBerita.id.toString(),
      idPenggunas: updatedBerita.idPenggunas ? updatedBerita.idPenggunas.toString() : null,
      idSekolahs: updatedBerita.idSekolahs ? updatedBerita.idSekolahs.toString() : null,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation errors:", error.errors)
      return NextResponse.json({ error: "Data tidak valid", details: error.errors }, { status: 400 })
    }

    console.error("❌ Error updating berita:", error)
    return NextResponse.json({ error: "Gagal memperbarui berita" }, { status: 500 })
  }
}

// DELETE berita
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.berita.delete({
      where: { id: BigInt(params.id) },
    })

    console.log("✅ Berita deleted successfully:", params.id)

    return NextResponse.json({ message: "Berita berhasil dihapus" })
  } catch (error) {
    console.error("❌ Error deleting berita:", error)
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 })
  }
}
