/*
  # Create Demographics Data Table

  1. New Tables
    - `reportes_demographics`
      - `id` (uuid, primary key)
      - `entidad_id` (uuid, foreign key to reportes_entidades)
      - `entidad_nombre` (text, artist/entity name)
      - `semana_inicio` (date, week start)
      - `semana_fin` (date, week end)
      - `age_range` (text, e.g., "18-24", "25-34")
      - `gender` (text, "female" or "male")
      - `followers_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reportes_demographics` table
    - Add policy for authenticated users to read demographics data

  3. Indexes
    - Index on entidad_id for faster lookups
    - Index on semana_inicio for filtering by report week
    - Composite index for common queries

  4. Notes
    - Only stores female and male gender data (undefined/U excluded)
    - Links to reportes_entidades via entidad_id
    - Links to specific week via semana_inicio/semana_fin dates
*/

CREATE TABLE IF NOT EXISTS reportes_demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  entidad_nombre text NOT NULL,
  semana_inicio date NOT NULL,
  semana_fin date NOT NULL,
  age_range text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('female', 'male')),
  followers_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reportes_demographics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read demographics data"
  ON reportes_demographics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_reportes_demographics_entidad_id 
  ON reportes_demographics(entidad_id);

CREATE INDEX IF NOT EXISTS idx_reportes_demographics_semana 
  ON reportes_demographics(semana_inicio, semana_fin);

CREATE INDEX IF NOT EXISTS idx_reportes_demographics_lookup 
  ON reportes_demographics(entidad_id, semana_inicio, semana_fin);
