import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/email'
import { z } from 'zod'

const requestResetSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = requestResetSchema.parse(body)

    // Cek apakah email terdaftar sebagai admin (email di database)
    const pengguna = await prisma.pengguna.findUnique({
      where: { email },
    })

    if (!pengguna) {
      // Jangan reveal bahwa email tidak terdaftar (security best practice)
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, kode OTP telah dikirim ke email perantara',
      })
    }

    // Generate OTP 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const berlakuSampai = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    // Hapus OTP lama yang belum digunakan untuk email ini
    await prisma.otpReset.updateMany({
      where: {
        email,
        digunakan: false,
      },
      data: {
        digunakan: true,
      },
    })

    // Simpan OTP ke database dengan email dari database (tidak diubah)
    await prisma.otpReset.create({
      data: {
        email, // Email dari database (disdikbanjarmasin@gmail.com)
        otp,
        berlakuSampai,
        digunakan: false,
      },
    })

    // Kirim OTP ke EMAIL PERANTARA (disdikreset@gmail.com)
    // Email perantara dikonfigurasi di environment variable
    try {
      await sendOTPEmail(otp, email) // email adalah email admin dari database
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Hapus OTP yang sudah dibuat jika email gagal
      await prisma.otpReset.deleteMany({
        where: { email, otp },
      })
      return NextResponse.json(
        { error: 'Gagal mengirim email OTP. Silakan coba lagi nanti.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Kode OTP telah dikirim ke email perantara. Silakan cek email perantara untuk mendapatkan kode OTP.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Request reset error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    )
  }
}

