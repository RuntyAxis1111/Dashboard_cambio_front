/*
  # Add dsp_status_id foreign key to dsp_series table

  1. Changes
    - Add `dsp_status_id` column (integer) to link with dsp_status table
    - Add foreign key constraint to dsp_status table
    - Create index for faster lookups by dsp_status_id
    - Populate dsp_status_id for existing records based on entidad_id

  2. Purpose
    - Link dsp_series records directly to their dsp_status entry
    - Simplify queries that need both series data and status information
    - Maintain referential integrity across DSP tables

  3. Existing Data
    - KATSEYE (entidad_id: 04a48079..., dsp_status_id: 1)
    - SANTOS BRAVOS (entidad_id: 74adf60e..., dsp_status_id: 2)
*/

-- Step 1: Add the dsp_status_id column (nullable first to allow updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsp_series' AND column_name = 'dsp_status_id'
  ) THEN
    ALTER TABLE dsp_series 
    ADD COLUMN dsp_status_id integer;
  END IF;
END $$;

-- Step 2: Populate dsp_status_id for existing records
UPDATE dsp_series ds
SET dsp_status_id = dst.id
FROM dsp_status dst
WHERE ds.entidad_id = dst.entidad_id
  AND ds.dsp_status_id IS NULL;

-- Step 3: Make dsp_status_id NOT NULL and add foreign key constraint
DO $$
BEGIN
  -- Make NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsp_series' 
      AND column_name = 'dsp_status_id'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE dsp_series 
    ALTER COLUMN dsp_status_id SET NOT NULL;
  END IF;
  
  -- Add foreign key constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'dsp_series_dsp_status_id_fkey'
  ) THEN
    ALTER TABLE dsp_series 
    ADD CONSTRAINT dsp_series_dsp_status_id_fkey 
    FOREIGN KEY (dsp_status_id) 
    REFERENCES dsp_status(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Step 4: Create index for fast lookups by dsp_status_id
CREATE INDEX IF NOT EXISTS dsp_series_dsp_status_id_idx 
  ON dsp_series(dsp_status_id);
