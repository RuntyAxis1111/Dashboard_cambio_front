/*
  # Create DSP Status Table

  1. New Tables
    - `dsp_status`
      - `id` (serial, primary key) - Auto-incrementing ID starting at 1
      - `entidad_id` (uuid, foreign key) - Reference to reportes_entidades
      - `chartmetric_id` (text) - Chartmetric artist ID
      - `nombre` (text) - Artist name
      - `ultima_actualizacion` (timestamptz) - Last update timestamp with timezone
      - `created_at` (timestamptz) - When this record was created
      - `updated_at` (timestamptz) - When this record was last updated

  2. Security
    - Enable RLS on `dsp_status` table
    - Add policy for authenticated users to read all data
    - Add policy for authenticated users to update all data

  3. Purpose
    - Track the last time DSP data was updated for each artist
    - Store timestamp with minute precision for "Last Updated" badges
    - Maintain chartmetric ID mapping for external integrations
*/

-- Drop the old view first
DROP VIEW IF EXISTS dsp_latest_metrics;

-- Create the new table
CREATE TABLE IF NOT EXISTS dsp_status (
  id SERIAL PRIMARY KEY,
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  chartmetric_id text,
  nombre text NOT NULL,
  ultima_actualizacion timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate entries per artist
CREATE UNIQUE INDEX IF NOT EXISTS dsp_status_entidad_id_unique 
  ON dsp_status(entidad_id);

-- Create index for fast lookups by chartmetric_id
CREATE INDEX IF NOT EXISTS dsp_status_chartmetric_id_idx 
  ON dsp_status(chartmetric_id);

-- Enable RLS
ALTER TABLE dsp_status ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all DSP status
CREATE POLICY "Authenticated users can read DSP status"
  ON dsp_status
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert DSP status
CREATE POLICY "Authenticated users can insert DSP status"
  ON dsp_status
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update DSP status
CREATE POLICY "Authenticated users can update DSP status"
  ON dsp_status
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dsp_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updates
DROP TRIGGER IF EXISTS update_dsp_status_updated_at_trigger ON dsp_status;
CREATE TRIGGER update_dsp_status_updated_at_trigger
  BEFORE UPDATE ON dsp_status
  FOR EACH ROW
  EXECUTE FUNCTION update_dsp_status_updated_at();
