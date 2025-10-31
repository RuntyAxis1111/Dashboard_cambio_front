/*
  # Create Meltwater PR Data Table

  1. New Tables
    - `reportes_meltwater_data`
      - `id_meltwater` (uuid, primary key) - Unique identifier for each Meltwater data record
      - `entidad_id` (uuid, foreign key) - References reportes_entidades
      - `dsp_status_id` (integer, foreign key) - References dsp_status for weekly tracking
      - `reach` (bigint) - Total reach/impressions
      - `avarage` (numeric) - Average engagement/metric value
      - `views` (bigint) - Total views
      - `total_menciones` (integer) - Total mentions count
      - `pais_top1` (text) - Top country #1
      - `pais_top2` (text) - Top country #2
      - `pais_top3` (text) - Top country #3
      - `pais_top4` (text) - Top country #4
      - `pais_top5` (text) - Top country #5
      - `ciudad_top1` (text) - Top city #1
      - `ciudad_top2` (text) - Top city #2
      - `ciudad_top3` (text) - Top city #3
      - `ciudad_top4` (text) - Top city #4
      - `ciudad_top5` (text) - Top city #5
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `reportes_meltwater_data` table
    - Add policy for authenticated users to read all Meltwater data
    - Add policy for authenticated users to insert Meltwater data
    - Add policy for authenticated users to update Meltwater data
    - Add policy for authenticated users to delete Meltwater data

  3. Indexes
    - Index on entidad_id for fast lookups by artist
    - Index on dsp_status_id for fast lookups by week
    - Composite index on (entidad_id, dsp_status_id) for combined queries

  4. Notes
    - This table allows updating all Meltwater PR metrics for an artist/week with a single record
    - Links to dsp_status to maintain weekly tracking consistency
    - All numeric fields use appropriate types (bigint for large counts, numeric for averages)
*/

-- Create reportes_meltwater_data table
CREATE TABLE IF NOT EXISTS reportes_meltwater_data (
  id_meltwater uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  dsp_status_id integer REFERENCES dsp_status(id) ON DELETE SET NULL,
  reach bigint DEFAULT 0,
  avarage numeric(15, 2) DEFAULT 0,
  views bigint DEFAULT 0,
  total_menciones integer DEFAULT 0,
  pais_top1 text,
  pais_top2 text,
  pais_top3 text,
  pais_top4 text,
  pais_top5 text,
  ciudad_top1 text,
  ciudad_top2 text,
  ciudad_top3 text,
  ciudad_top4 text,
  ciudad_top5 text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meltwater_entidad 
  ON reportes_meltwater_data(entidad_id);

CREATE INDEX IF NOT EXISTS idx_meltwater_dsp_status 
  ON reportes_meltwater_data(dsp_status_id);

CREATE INDEX IF NOT EXISTS idx_meltwater_entidad_status 
  ON reportes_meltwater_data(entidad_id, dsp_status_id);

-- Enable Row Level Security
ALTER TABLE reportes_meltwater_data ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all Meltwater data
CREATE POLICY "Authenticated users can read Meltwater data"
  ON reportes_meltwater_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert Meltwater data
CREATE POLICY "Authenticated users can insert Meltwater data"
  ON reportes_meltwater_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update Meltwater data
CREATE POLICY "Authenticated users can update Meltwater data"
  ON reportes_meltwater_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete Meltwater data
CREATE POLICY "Authenticated users can delete Meltwater data"
  ON reportes_meltwater_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_meltwater_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_meltwater_updated_at
  BEFORE UPDATE ON reportes_meltwater_data
  FOR EACH ROW
  EXECUTE FUNCTION update_meltwater_updated_at();
