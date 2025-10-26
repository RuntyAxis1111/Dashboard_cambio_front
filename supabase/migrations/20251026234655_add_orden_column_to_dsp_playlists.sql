/*
  # Add orden column to dsp_playlists table

  1. Changes
    - Add `orden` column (smallint) to identify playlist position (1-5)
    - Set orden values based on existing row order per artist (using ROW_NUMBER)
    - Add CHECK constraint to ensure orden is between 1 and 5
    - Create unique constraint to prevent duplicate orden values per artist
    - Create index for faster queries by entidad_id + orden combination

  2. Purpose
    - Enable backend to update specific playlist rows by referencing entidad_id + orden
    - Ensure each artist can have up to 5 playlists with unique orden values (1-5)
    - Provide a stable reference point for updates beyond auto-incremented id

  3. Existing Data
    - KATSEYE (04a48079-33e8-47dc-9f0d-99910eb7b681): 4 playlists will get orden 1-4
    - Santos Bravos (74adf60e-c603-406e-90b0-6bb72c9ee1b1): 1 playlist will get orden 1
*/

-- Step 1: Add the orden column (nullable first to allow updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsp_playlists' AND column_name = 'orden'
  ) THEN
    ALTER TABLE dsp_playlists 
    ADD COLUMN orden smallint;
  END IF;
END $$;

-- Step 2: Populate orden values based on existing row order per artist
WITH ranked_playlists AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY entidad_id ORDER BY id) AS row_num
  FROM dsp_playlists
)
UPDATE dsp_playlists
SET orden = ranked_playlists.row_num::smallint
FROM ranked_playlists
WHERE dsp_playlists.id = ranked_playlists.id
  AND dsp_playlists.orden IS NULL;

-- Step 3: Make orden NOT NULL and add CHECK constraint
DO $$
BEGIN
  -- Make NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsp_playlists' 
      AND column_name = 'orden'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE dsp_playlists 
    ALTER COLUMN orden SET NOT NULL;
  END IF;
  
  -- Add CHECK constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'dsp_playlists_orden_check'
  ) THEN
    ALTER TABLE dsp_playlists 
    ADD CONSTRAINT dsp_playlists_orden_check 
    CHECK (orden >= 1 AND orden <= 5);
  END IF;
END $$;

-- Step 4: Create unique constraint to prevent duplicate orden values per artist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'dsp_playlists_entidad_orden_unique'
  ) THEN
    ALTER TABLE dsp_playlists 
    ADD CONSTRAINT dsp_playlists_entidad_orden_unique 
    UNIQUE (entidad_id, orden);
  END IF;
END $$;

-- Step 5: Create composite index for fast lookups by entidad_id + orden
CREATE INDEX IF NOT EXISTS dsp_playlists_entidad_orden_idx 
  ON dsp_playlists(entidad_id, orden);
