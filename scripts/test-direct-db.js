// Script to test direct database insertion
const { PrismaClient } = require('@prisma/client')

async function testDirectDB() {
  console.log('🧪 Testing Direct Database Insertion...\n')
  
  try {
    const prisma = new PrismaClient()
    
    console.log('1. Testing direct database insertion...')
    
    const newReservation = await prisma.reservasi.create({
      data: {
        queueNumber: 'TEST-999999',
        service: 'ptk',
        name: 'Test User Direct',
        phone: '081234567999',
        nik: '9999999999999999',
        purpose: 'Test direct database insertion',
        date: new Date('2025-01-23'),
        timeSlot: '14:00',
        status: 'WAITING',
        estimatedCallTime: '16:00'
      }
    })
    
    console.log('✅ Direct insertion successful:', newReservation.queueNumber)
    
    // Check total count
    const count = await prisma.reservasi.count()
    console.log(`📊 Total reservations: ${count}`)
    
    // Get latest reservations
    const latest = await prisma.reservasi.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    
    console.log('\n📋 Latest reservations:')
    latest.forEach((res, index) => {
      console.log(`${index + 1}. ${res.queueNumber} - ${res.name} (${res.status})`)
    })
    
    await prisma.$disconnect()
    console.log('\n✅ Direct database test completed')
    
  } catch (error) {
    console.error('❌ Direct database test failed:', error.message)
    console.error('Full error:', error)
  }
}

testDirectDB()
