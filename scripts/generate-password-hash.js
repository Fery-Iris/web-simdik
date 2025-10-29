const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'disdik123'
  const hash = await bcrypt.hash(password, 10)
  console.log('Password:', password)
  console.log('Hash:', hash)
  console.log('\nSQL Insert Statement:')
  console.log(`
INSERT INTO "public"."penggunas" (
  nama,
  email,
  password_hash,
  peran,
  dibuat_pada,
  diperbarui_pada
) VALUES (
  'Admin Disdik Banjarmasin',
  'disdikbanjarmasin@gmail.com',
  '${hash}',
  'ADMIN',
  NOW(),
  NOW()
);
  `)
}

generateHash()



