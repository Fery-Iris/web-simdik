-- Rename id column to id_reservations in reservations table

-- Step 1: Check if column 'id' exists and 'id_reservations' doesn't exist
DO $$ 
BEGIN
    -- Check if we need to rename
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' 
        AND column_name = 'id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' 
        AND column_name = 'id_reservations'
    ) THEN
        -- Rename the column
        ALTER TABLE "public"."reservations" 
        RENAME COLUMN "id" TO "id_reservations";
        
        RAISE NOTICE 'Successfully renamed column id to id_reservations';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' 
        AND column_name = 'id_reservations'
    ) THEN
        RAISE NOTICE 'Column id_reservations already exists, no action needed';
    ELSE
        RAISE NOTICE 'Column id does not exist, cannot rename';
    END IF;
END $$;

-- Step 2: Verify the change
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reservations' 
AND column_name IN ('id', 'id_reservations')
ORDER BY column_name;

-- Step 3: Verify primary key constraint
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'reservations'
AND tc.constraint_type = 'PRIMARY KEY';

