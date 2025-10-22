// Script to check if data is being saved to PostgreSQL database
const { PrismaClient } = require('@prisma/client')

async function checkDatabase() {
  console.log('🔍 Checking PostgreSQL Database...\n')
  
  try {
    const prisma = new PrismaClient()
    
    // Check if we can connect to database
    console.log('1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check reservations table
    console.log('\n2. Checking reservations table...')
    const reservations = await prisma.reservasi.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })
    
    console.log(`Found ${reservations.length} reservations in database:`)
    reservations.forEach((res, index) => {
      console.log(`${index + 1}. ${res.queueNumber} - ${res.name} (${res.service}) - ${res.status}`)
    })
    
    // Check table structure
    console.log('\n3. Checking table structure...')
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      ORDER BY ordinal_position
    `
    
    console.log('Table structure:')
    tableInfo.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    await prisma.$disconnect()
    console.log('\n✅ Database check completed successfully')
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message)
    console.log('\nThis means the API is using mock data instead of PostgreSQL')
  }
}

checkDatabase()
