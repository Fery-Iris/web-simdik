-- Check struktur tabel penggunas yang ada di database
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'penggunas'
ORDER BY ordinal_position;

-- Check data yang sudah ada
SELECT * FROM "public"."penggunas" LIMIT 5;



