/*
  # Add last_track_id column to dsp_status table

  1. Changes
    - Add `last_track_id` column to `dsp_status` table
    - Column will be text type, nullable
    - Placed after `chartmetric_id` column
    
  2. Notes
    - Values will be populated from backend
    - No default value needed as it starts as NULL
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsp_status' AND column_name = 'last_track_id'
  ) THEN
    ALTER TABLE dsp_status ADD COLUMN last_track_id text;
  END IF;
END $$;