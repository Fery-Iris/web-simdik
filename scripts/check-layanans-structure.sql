-- Check the actual structure of layanans table
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'layanans'
ORDER BY ordinal_position;

