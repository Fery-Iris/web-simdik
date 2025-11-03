import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET berita by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { slug: params.slug },
    })

    if (!berita) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    // Increment views
    await prisma.berita.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    })

    // Convert BigInt to string for JSON
    const serialized = {
      ...berita,
      id: berita.id.toString(),
      idPenggunas: berita.idPenggunas.toString(),
      sekolahId: berita.sekolahId ? berita.sekolahId.toString() : null,
      // Convert tags from comma-separated string to array for frontend
      tagsArray: berita.tags ? berita.tags.split(",").map((tag) => tag.trim()) : [],
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching berita by slug:", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}
