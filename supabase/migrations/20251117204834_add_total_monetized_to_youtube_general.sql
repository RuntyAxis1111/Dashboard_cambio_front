/*
  # Add total_monetized column to reportes_youtube_general

  1. Changes
    - Add `total_monetized` column to `reportes_youtube_general` table
      - `total_monetized` (bigint, default 0)
      - Represents total monetized views or revenue metric for YouTube
  
  2. Notes
    - Column defaults to 0 for existing records
    - Frontend will only display this metric when it has non-zero values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reportes_youtube_general' AND column_name = 'total_monetized'
  ) THEN
    ALTER TABLE reportes_youtube_general ADD COLUMN total_monetized bigint DEFAULT 0;
  END IF;
END $$;
