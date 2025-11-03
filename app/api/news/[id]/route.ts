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
    console.log("📝 Updating berita:", params.id, body)

    // Validate with Zod
    const validatedData = beritaSchema.parse(body)

    // Prepare update data (only include fields that are provided)
    const updateData: any = {}

    if (validatedData.judul !== undefined) updateData.judul = validatedData.judul
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
    if (validatedData.ringkasan !== undefined) updateData.ringkasan = validatedData.ringkasan
    if (validatedData.konten !== undefined) updateData.konten = validatedData.konten
    if (validatedData.kategori !== undefined) updateData.kategori = validatedData.kategori
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.tanggalTerbit !== undefined) updateData.tanggalTerbit = new Date(validatedData.tanggalTerbit)
    if (validatedData.unggulan !== undefined) updateData.unggulan = validatedData.unggulan
    if (validatedData.gambarUtama !== undefined) updateData.gambarUtama = validatedData.gambarUtama
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags

    console.log("💾 Update data:", updateData)

    const berita = await prisma.berita.update({
      where: { id: BigInt(params.id) },
      data: updateData,
    })

    console.log("✅ Berita updated successfully")

    // Convert BigInt to string for JSON
    const serialized = {
      ...berita,
      id: berita.id.toString(),
      idPenggunas: berita.idPenggunas ? berita.idPenggunas.toString() : null,
      idSekolahs: berita.idSekolahs ? berita.idSekolahs.toString() : null,
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
