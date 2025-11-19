import { NextRequest, NextResponse } from 'next/server'
import { getSession, createSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const updateProfileSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: 'Password baru dan konfirmasi password harus sama',
  path: ['confirmPassword'],
})

// GET - Get admin profile
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user details from database
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: BigInt(user.id) },
      select: {
        id: true,
        nama: true,
        email: true,
        peran: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!pengguna) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: pengguna.id.toString(),
        nama: pengguna.nama,
        email: pengguna.email,
        peran: pengguna.peran,
        createdAt: pengguna.createdAt,
        updatedAt: pengguna.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data profil' },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = updateProfileSchema.parse(body)

    // Get current user data
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: BigInt(user.id) },
    })

    if (!pengguna) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    if (validatedData.email !== pengguna.email) {
      const existingUser = await prisma.pengguna.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      nama: validatedData.nama,
      email: validatedData.email,
      updatedAt: new Date(),
    }

    // If changing password
    if (validatedData.currentPassword && validatedData.newPassword) {
      // Verify current password
      const isValid = await bcrypt.compare(validatedData.currentPassword, pengguna.passwordHash)
      
      if (!isValid) {
        return NextResponse.json(
          { error: 'Password saat ini tidak sesuai' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)
      updateData.passwordHash = hashedPassword
    }

    // Update user
    const updatedUser = await prisma.pengguna.update({
      where: { id: BigInt(user.id) },
      data: updateData,
      select: {
        id: true,
        nama: true,
        email: true,
        peran: true,
        updatedAt: true,
      },
    })

    // Update session with new data
    await createSession({
      id: updatedUser.id.toString(),
      nama: updatedUser.nama,
      email: updatedUser.email,
      peran: updatedUser.peran,
    })

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: updatedUser.id.toString(),
        nama: updatedUser.nama,
        email: updatedUser.email,
        peran: updatedUser.peran,
        updatedAt: updatedUser.updatedAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui profil' },
      { status: 500 }
    )
  }
}
