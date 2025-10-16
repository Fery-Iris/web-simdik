const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupAgendaDatabase() {
  try {
    console.log('🚀 Setting up agenda database...')

    // Generate Prisma client
    const { execSync } = require('child_process')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')

    // Push schema to database
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('✅ Database schema pushed')

    // Seed sample data
    await seedSampleData()
    
    console.log('🎉 Agenda database setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample agenda data...')

    const sampleAgendas = [
      {
        title: 'Rapat Koordinasi Kepala Sekolah',
        date: new Date('2024-01-15'),
        time: '09:00',
        location: 'Aula Dinas Pendidikan',
        status: 'SCHEDULED'
      },
      {
        title: 'Workshop Kurikulum Merdeka',
        date: new Date('2024-01-20'),
        time: '08:00',
        location: 'SMAN 1 Banjarmasin',
        status: 'ONGOING'
      },
      {
        title: 'Monitoring Sekolah Zona 1',
        date: new Date('2024-01-10'),
        time: '10:00',
        location: 'Sekolah Zona 1',
        status: 'COMPLETED'
      },
      {
        title: 'Evaluasi Semester Ganjil',
        date: new Date('2024-01-25'),
        time: '14:00',
        location: 'Dinas Pendidikan Banjarmasin',
        status: 'SCHEDULED'
      },
      {
        title: 'Pelatihan Guru Digital',
        date: new Date('2024-01-18'),
        time: '08:30',
        location: 'Lab Komputer SMAN 2',
        status: 'ONGOING'
      }
    ]

    // Clear existing data
    await prisma.agenda.deleteMany()
    console.log('🗑️  Cleared existing agenda data')

    // Insert sample data
    for (const agenda of sampleAgendas) {
      await prisma.agenda.create({ data: agenda })
    }

    console.log(`✅ Created ${sampleAgendas.length} sample agendas`)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

// Run the setup
setupAgendaDatabase()
