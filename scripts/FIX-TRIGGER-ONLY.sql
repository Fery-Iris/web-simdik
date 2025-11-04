-- ========================================
-- QUICK FIX: Drop Problematic Trigger
-- ========================================
-- Run this in Supabase SQL Editor
-- ========================================

-- The problem: Trigger is trying to update 'updated_at' column
-- But the actual column name is 'diperbarui_pada'
-- Prisma handles @updatedAt automatically, so we don't need this trigger

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS beritas_updated_at_trigger ON beritas CASCADE;
DROP FUNCTION IF EXISTS update_beritas_updated_at() CASCADE;

-- Verify it's gone
SELECT 
    'Triggers on beritas table' as info,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'beritas';

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ TRIGGER DROPPED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'The problematic trigger has been removed.';
  RAISE NOTICE 'Prisma will now handle updatedAt automatically.';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Try updating a berita again';
  RAISE NOTICE '  2. It should work now!';
  RAISE NOTICE '========================================';
END $$;

