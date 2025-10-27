/*
  # Add Past Week columns to reportes_estado

  1. Changes
    - Add `semana_pasada_inicio` column to store past week start date
    - Add `semana_pasada_fin` column to store past week end date
    - Rename existing columns to be more explicit:
      - `semana_inicio` → represents current week start
      - `semana_fin` → represents current week end
  
  2. Notes
    - Past Week: The previous reporting period for comparison
    - Current Week: The current/latest reporting period
    - Both date ranges are required for week-over-week analysis
*/

DO $$ 
BEGIN
  -- Add past week start date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reportes_estado' AND column_name = 'semana_pasada_inicio'
  ) THEN
    ALTER TABLE reportes_estado 
    ADD COLUMN semana_pasada_inicio date;
  END IF;

  -- Add past week end date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reportes_estado' AND column_name = 'semana_pasada_fin'
  ) THEN
    ALTER TABLE reportes_estado 
    ADD COLUMN semana_pasada_fin date;
  END IF;
END $$;