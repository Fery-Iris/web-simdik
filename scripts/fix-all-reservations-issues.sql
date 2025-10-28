-- Complete fix for reservations table

-- Step 1: Add id column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'id'
    ) THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "id" TEXT;
        
        -- Generate UUID for existing rows
        UPDATE "public"."reservations" 
        SET "id" = gen_random_uuid()::text 
        WHERE "id" IS NULL;
        
        -- Make it NOT NULL
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "id" SET NOT NULL;
        
        -- Drop existing primary key if any
        ALTER TABLE "public"."reservations"
        DROP CONSTRAINT IF EXISTS "reservations_pkey";
        
        -- Add new primary key
        ALTER TABLE "public"."reservations"
        ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");
        
        RAISE NOTICE 'Added id column as primary key';
    END IF;
END $$;

-- Step 2: Adjust column sizes to match Prisma schema
DO $$
BEGIN
    -- queueNumber
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'queueNumber') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "queueNumber" TYPE VARCHAR(50);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "queueNumber" VARCHAR(50) UNIQUE;
    END IF;
    
    -- service
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'service') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "service" TYPE VARCHAR(255);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "service" VARCHAR(255);
    END IF;
    
    -- name
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'name') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "name" TYPE VARCHAR(255);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "name" VARCHAR(255);
    END IF;
    
    -- phone
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'phone') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "phone" TYPE VARCHAR(20);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "phone" VARCHAR(20);
    END IF;
    
    -- nik
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'nik') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "nik" VARCHAR(20);
    END IF;
    
    -- purpose - TEXT type for longer content
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'purpose') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "purpose" TYPE TEXT;
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "purpose" TEXT;
    END IF;
    
    -- date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'date') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "date" DATE;
    END IF;
    
    -- timeSlot
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'timeSlot') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "timeSlot" TYPE VARCHAR(255);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "timeSlot" VARCHAR(255);
    END IF;
    
    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'status') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "status" VARCHAR(50) DEFAULT 'WAITING';
    END IF;
    
    -- estimatedCallTime
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'estimatedCallTime') THEN
        ALTER TABLE "public"."reservations" 
        ALTER COLUMN "estimatedCallTime" TYPE VARCHAR(255);
    ELSE
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "estimatedCallTime" VARCHAR(255);
    END IF;
    
    -- created_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'created_at') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- updated_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- id_layanans (already added before, but ensure it exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'id_layanans') THEN
        ALTER TABLE "public"."reservations" 
        ADD COLUMN "id_layanans" BIGINT;
        
        -- Add foreign key if not exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'reservations_id_layanans_fkey'
        ) THEN
            ALTER TABLE "public"."reservations"
            ADD CONSTRAINT "reservations_id_layanans_fkey" 
            FOREIGN KEY ("id_layanans") 
            REFERENCES "public"."layanans"("id_layanans") 
            ON DELETE SET NULL 
            ON UPDATE CASCADE;
        END IF;
    END IF;
    
    RAISE NOTICE 'Column adjustments completed';
END $$;

-- Step 3: Verify structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reservations'
ORDER BY ordinal_position;

-- Step 4: Verify foreign keys
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'reservations';

