/*
  # Add constraints and indexes for reports system

  1. Constraints
    - Add unique constraint on reports(report_type, artist_id, week_end) to prevent duplicates
    - Add unique constraint on report_sections(report_id, section_key) to prevent duplicate sections

  2. Indexes
    - Add index on reports(artist_id, week_end desc) for efficient weekly report lookups
    - Add index on report_sections(report_id, order_no) for efficient section ordering

  3. Notes
    - Uses IF NOT EXISTS to make migration idempotent
    - All operations are safe for existing data
*/

-- Add unique constraint to prevent duplicate reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reports_unique_week'
  ) THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_unique_week UNIQUE (report_type, artist_id, week_end);
  END IF;
END $$;

-- Add unique constraint to prevent duplicate sections per report
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_sections_unique_key'
  ) THEN
    ALTER TABLE public.report_sections
      ADD CONSTRAINT report_sections_unique_key UNIQUE (report_id, section_key);
  END IF;
END $$;

-- Add index for efficient artist weekly lookups
CREATE INDEX IF NOT EXISTS idx_reports_artist_week
  ON public.reports (artist_id, week_end DESC);

-- Add index for efficient section ordering
CREATE INDEX IF NOT EXISTS idx_report_sections_report_order
  ON public.report_sections (report_id, order_no);

-- Add index for artistas_registry nombre lookup (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_artistas_registry_nombre_lower
  ON public.artistas_registry (LOWER(nombre));