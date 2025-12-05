/*
  # Create My Reports Table

  1. New Tables
    - `my_reports`
      - `id` (uuid, primary key) - Identificador único del reporte
      - `user_id` (uuid, foreign key to auth.users) - Usuario dueño del reporte
      - `title` (text) - Título del reporte
      - `html_content` (text) - Contenido HTML completo del reporte
      - `artist_name` (text, optional) - Nombre del artista/entidad
      - `week_start` (date, optional) - Fecha inicio de semana
      - `week_end` (date, optional) - Fecha fin de semana
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de última actualización
  
  2. Security
    - Enable RLS on `my_reports` table
    - Add restrictive policies so users can ONLY see/manage their own reports:
      - SELECT: Users can only read their own reports (auth.uid() = user_id)
      - INSERT: Users can only create reports for themselves (auth.uid() = user_id)
      - UPDATE: Users can only update their own reports (auth.uid() = user_id)
      - DELETE: Users can only delete their own reports (auth.uid() = user_id)
  
  3. Important Notes
    - Each user has complete isolation - cannot see other users' reports
    - HTML content stored directly in html_content column for simplicity
    - Optional metadata fields (artist_name, week_start, week_end) for filtering/display
    - Timestamps auto-update for tracking changes
*/

-- Create the my_reports table
CREATE TABLE IF NOT EXISTS my_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  html_content text NOT NULL DEFAULT '',
  artist_name text,
  week_start date,
  week_end date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE my_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own reports
CREATE POLICY "Users can view own reports"
  ON my_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can only INSERT reports for themselves
CREATE POLICY "Users can create own reports"
  ON my_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own reports
CREATE POLICY "Users can update own reports"
  ON my_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own reports
CREATE POLICY "Users can delete own reports"
  ON my_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_my_reports_user_id ON my_reports(user_id);

-- Create index for faster queries by created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_my_reports_created_at ON my_reports(created_at DESC);