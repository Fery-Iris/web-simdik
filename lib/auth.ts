import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface SessionUser {
  id: string
  nama: string
  email: string
  peran: string
}

const SESSION_COOKIE_NAME = 'simdik_session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify(user)
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie?.value) {
      return null
    }
    
    const user = JSON.parse(sessionCookie.value) as SessionUser
    return user
  } catch (error) {
    console.error('Error parsing session:', error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { email },
    })
    
    if (!pengguna) {
      return null
    }
    
    const isValid = await verifyPassword(password, pengguna.passwordHash)
    
    if (!isValid) {
      return null
    }
    
    return {
      id: pengguna.id.toString(),
      nama: pengguna.nama,
      email: pengguna.email,
      peran: pengguna.peran,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}



