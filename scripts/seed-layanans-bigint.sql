-- Seed layanans data with auto-increment ID (bigint)

-- Insert default layanan options
INSERT INTO "public"."layanans" (name, description, icon, color, "isActive", created_at, updated_at)
VALUES
    ('PTK (Pendidik dan Tenaga Kependidikan)', 'Layanan untuk guru, kepala sekolah, dan tenaga kependidikan', 'Users', 'bg-blue-500', true, NOW(), NOW()),
    ('SD Umum', 'Layanan untuk Sekolah Dasar', 'School', 'bg-green-500', true, NOW(), NOW()),
    ('SMP Umum', 'Layanan untuk Sekolah Menengah Pertama', 'GraduationCap', 'bg-purple-500', true, NOW(), NOW()),
    ('PAUD', 'Layanan untuk Pendidikan Anak Usia Dini', 'Baby', 'bg-orange-500', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify inserted data
SELECT 
    id_layanans,
    name,
    description,
    icon,
    color,
    "isActive"
FROM "public"."layanans" 
ORDER BY id_layanans;

