/*
  # Add company column to reportes_entidades table

  1. Changes
    - Add `company` column (text) to identify which Hybe company manages the artist
    - Set default value for existing records
    - Add index for faster queries by company

  2. Purpose
    - Track which Hybe subsidiary manages each artist
    - Enable filtering and grouping by company
    - Support for "Hybe Latin America" and "Hybe America" companies

  3. Existing Data
    - KATSEYE → Hybe America
    - SANTOS BRAVOS → Hybe Latin America
*/

-- Step 1: Add the company column (nullable first to allow updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reportes_entidades' AND column_name = 'company'
  ) THEN
    ALTER TABLE reportes_entidades 
    ADD COLUMN company text;
  END IF;
END $$;

-- Step 2: Set company values for existing records
UPDATE reportes_entidades
SET company = CASE 
  WHEN nombre = 'KATSEYE' THEN 'Hybe America'
  ELSE 'Hybe Latin America'
END
WHERE company IS NULL;

-- Step 3: Make company NOT NULL with default value
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reportes_entidades' 
      AND column_name = 'company'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE reportes_entidades 
    ALTER COLUMN company SET DEFAULT 'Hybe Latin America';
    
    ALTER TABLE reportes_entidades 
    ALTER COLUMN company SET NOT NULL;
  END IF;
END $$;

-- Step 4: Create index for fast lookups by company
CREATE INDEX IF NOT EXISTS reportes_entidades_company_idx 
  ON reportes_entidades(company);
