/**
 * Test database enum types directly
 * Run: node scripts/test-db-enums.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

async function testEnums() {
  try {
    console.log('🔍 Testing database enum types...\n')

    // Check enum types in database
    console.log('📋 Checking enum types in database:')
    const enumTypes = await prisma.$queryRaw`
      SELECT 
        t.typname as enum_name,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname
      ORDER BY t.typname;
    `
    console.table(enumTypes)

    // Check beritas table column types
    console.log('\n📋 Checking beritas table column types:')
    const beritasColumns = await prisma.$queryRaw`
      SELECT 
        column_name,
        udt_name as type_name,
        data_type
      FROM information_schema.columns
      WHERE table_name = 'beritas'
        AND column_name IN ('kategori', 'status')
      ORDER BY ordinal_position;
    `
    console.table(beritasColumns)

    // Try to fetch a berita
    console.log('\n📋 Fetching first berita:')
    const berita = await prisma.berita.findFirst()
    
    if (berita) {
      console.log('✅ Successfully fetched berita:')
      console.log('   ID:', berita.id.toString())
      console.log('   Judul:', berita.judul)
      console.log('   Kategori:', berita.kategori)
      console.log('   Status:', berita.status)
      
      // Try to UPDATE with raw SQL first
      console.log('\n🔄 Testing raw SQL update:')
      await prisma.$executeRaw`
        UPDATE beritas 
        SET judul = ${berita.judul}
        WHERE id_beritas = ${berita.id}
      `
      console.log('✅ Raw SQL update successful!')
      
      // Now try Prisma update
      console.log('\n🔄 Testing Prisma update:')
      const updated = await prisma.berita.update({
        where: { id: berita.id },
        data: { 
          judul: berita.judul + ' (test)',
        }
      })
      console.log('✅ Prisma update successful!')
      console.log('   New title:', updated.judul)
      
      // Restore original
      await prisma.berita.update({
        where: { id: berita.id },
        data: { judul: berita.judul.replace(' (test)', '') }
      })
      console.log('✅ Restored original title')
      
    } else {
      console.log('❌ No berita found in database')
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.code) {
      console.error('   Error code:', error.code)
    }
    if (error.meta) {
      console.error('   Meta:', error.meta)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testEnums()

