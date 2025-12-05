/*
  # Add created_by_user_id to reports

  1. Changes
    - Add `created_by_user_id` column to `spotify_report_weekly` table
    - Links to auth.users table
    - Nullable to support existing reports

  2. Security
    - Enable RLS on spotify_report_weekly
    - Add policy for users to view their own reports
    - Add policy for authenticated users to create reports
    - Add policy for users to view all reports (for now)
*/

-- Add created_by_user_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spotify_report_weekly' AND column_name = 'created_by_user_id'
  ) THEN
    ALTER TABLE spotify_report_weekly 
    ADD COLUMN created_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS spotify_report_weekly_created_by_user_idx 
  ON spotify_report_weekly(created_by_user_id);

-- Enable RLS
ALTER TABLE spotify_report_weekly ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all reports (for now)
DROP POLICY IF EXISTS "Users can view all reports" ON spotify_report_weekly;
CREATE POLICY "Users can view all reports"
  ON spotify_report_weekly
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert reports with their user_id
DROP POLICY IF EXISTS "Users can create reports" ON spotify_report_weekly;
CREATE POLICY "Users can create reports"
  ON spotify_report_weekly
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by_user_id);

-- Policy: Users can update their own reports
DROP POLICY IF EXISTS "Users can update own reports" ON spotify_report_weekly;
CREATE POLICY "Users can update own reports"
  ON spotify_report_weekly
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by_user_id)
  WITH CHECK (auth.uid() = created_by_user_id);

-- Policy: Users can delete their own reports
DROP POLICY IF EXISTS "Users can delete own reports" ON spotify_report_weekly;
CREATE POLICY "Users can delete own reports"
  ON spotify_report_weekly
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by_user_id);