// Script to migrate mock data to PostgreSQL database
const { PrismaClient } = require('@prisma/client')

async function migrateToDatabase() {
  console.log('🔄 Migrating to PostgreSQL Database...\n')
  
  try {
    const prisma = new PrismaClient()
    
    // Sample data to insert
    const sampleReservations = [
      {
        queueNumber: 'PTK-123456',
        service: 'ptk',
        name: 'Ahmad Rizki',
        phone: '081234567890',
        nik: '1234567890123456',
        purpose: 'Pengajuan sertifikat pendidik',
        date: new Date('2025-01-23'),
        timeSlot: '09:00',
        status: 'WAITING',
        estimatedCallTime: '14:30'
      },
      {
        queueNumber: 'SD-789012',
        service: 'sd',
        name: 'Siti Nurhaliza',
        phone: '081234567891',
        nik: '2345678901234567',
        purpose: 'Pendaftaran sekolah baru',
        date: new Date('2025-01-23'),
        timeSlot: '10:00',
        status: 'CALLED',
        estimatedCallTime: '15:00'
      },
      {
        queueNumber: 'SMP-345678',
        service: 'smp',
        name: 'Budi Santoso',
        phone: '081234567892',
        nik: '3456789012345678',
        purpose: 'Konsultasi kurikulum',
        date: new Date('2025-01-24'),
        timeSlot: '08:00',
        status: 'COMPLETED',
        estimatedCallTime: '14:00'
      }
    ]
    
    console.log('1. Inserting sample reservations...')
    
    for (const reservation of sampleReservations) {
      try {
        await prisma.reservasi.create({
          data: reservation
        })
        console.log(`✅ Created: ${reservation.queueNumber} - ${reservation.name}`)
      } catch (error) {
        console.log(`❌ Failed to create ${reservation.queueNumber}:`, error.message)
      }
    }
    
    // Check final count
    const count = await prisma.reservasi.count()
    console.log(`\n📊 Total reservations in database: ${count}`)
    
    // Show all reservations
    const allReservations = await prisma.reservasi.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📋 All reservations:')
    allReservations.forEach((res, index) => {
      console.log(`${index + 1}. ${res.queueNumber} - ${res.name} (${res.service}) - ${res.status}`)
    })
    
    await prisma.$disconnect()
    console.log('\n✅ Migration completed successfully')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  }
}

migrateToDatabase()
