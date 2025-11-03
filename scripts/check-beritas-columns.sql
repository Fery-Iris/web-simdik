-- Check if there's a column called 'new' in beritas table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'beritas'
ORDER BY ordinal_position;

-- Check for any column with 'new' in the name
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'beritas'
AND column_name ILIKE '%new%';

-- List all constraints on beritas table
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.beritas'::regclass;

