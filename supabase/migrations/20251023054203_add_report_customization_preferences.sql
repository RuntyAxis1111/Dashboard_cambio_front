/*
  # Report Customization Preferences System

  1. New Tables
    - `reportes_preferencias_visualizacion`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `entidad_id` (uuid, references reportes_entidades)
      - `secciones_ocultas` (jsonb, array of section keys to hide)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on (user_id, entidad_id)

  2. Security
    - Enable RLS on `reportes_preferencias_visualizacion` table
    - Users can only read/write their own preferences
    - Policy for authenticated users to manage their preferences

  3. Purpose
    - Allow users to customize which sections appear in their reports
    - Preferences are per user and per entity (artist/show)
    - Stored as JSONB array of section keys for flexibility
    - No data is deleted, only hidden from view
*/

-- Create preferences table
CREATE TABLE IF NOT EXISTS reportes_preferencias_visualizacion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  secciones_ocultas jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entidad_id)
);

-- Enable RLS
ALTER TABLE reportes_preferencias_visualizacion ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON reportes_preferencias_visualizacion
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON reportes_preferencias_visualizacion
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON reportes_preferencias_visualizacion
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON reportes_preferencias_visualizacion
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_preferencias_user_entidad 
  ON reportes_preferencias_visualizacion(user_id, entidad_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reportes_preferencias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reportes_preferencias_timestamp
  BEFORE UPDATE ON reportes_preferencias_visualizacion
  FOR EACH ROW
  EXECUTE FUNCTION update_reportes_preferencias_updated_at();
