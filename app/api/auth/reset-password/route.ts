import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
  otp: z.string().length(6, 'OTP harus 6 digit'),
  newPassword: z.string().min(8, 'Password minimal 8 karakter'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, newPassword } = resetPasswordSchema.parse(body)

    // Cari OTP yang valid
    const otpRecord = await prisma.otpReset.findFirst({
      where: {
        email,
        otp,
        digunakan: false,
        berlakuSampai: {
          gt: new Date(), // Belum expired
        },
      },
      orderBy: {
        dibuatPada: 'desc', // Ambil yang terbaru
      },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'OTP tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      )
    }

    // Cek apakah pengguna ada
    const pengguna = await prisma.pengguna.findUnique({
      where: { email },
    })

    if (!pengguna) {
      return NextResponse.json(
        { error: 'Email tidak terdaftar' },
        { status: 404 }
      )
    }

    // Hash password baru
    const hashedPassword = await hashPassword(newPassword)

    // Update password (email di database tetap tidak berubah)
    await prisma.pengguna.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
      },
    })

    // Mark OTP as used
    await prisma.otpReset.update({
      where: { id: otpRecord.id },
      data: { digunakan: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat reset password' },
      { status: 500 }
    )
  }
}

