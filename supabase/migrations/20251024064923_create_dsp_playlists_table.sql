/*
  # Create DSP Playlists Table

  1. New Tables
    - `dsp_playlists`
      - `id` (serial, primary key) - Auto-incrementing ID starting at 1
      - `dsp_status_id` (integer, foreign key) - Reference to dsp_status table
      - `entidad_id` (uuid, foreign key) - Reference to reportes_entidades table
      - `playlist_nombre` (text) - Playlist name
      - `pista` (text) - Track name
      - `fecha_agregado` (date) - Date added to playlist
      - `posicion` (text) - Current position (e.g., "9/50")
      - `posicion_maxima` (integer) - Maximum/peak position achieved
      - `seguidores` (text) - Total followers with formatting (e.g., "34.6M")
      - `imagen_url` (text) - Playlist cover image URL
      - `link_url` (text) - Link to playlist
      - `created_at` (timestamptz) - When this record was created
      - `updated_at` (timestamptz) - When this record was last updated

  2. Security
    - Enable RLS on `dsp_playlists` table
    - Add policy for authenticated users to read all data
    - Add policy for authenticated users to insert data
    - Add policy for authenticated users to update data

  3. Purpose
    - Track playlist performance for artists on Spotify
    - Display in the "Espacio disponible para contenido adicional" section
    - Backend will update these records constantly
*/

CREATE TABLE IF NOT EXISTS dsp_playlists (
  id SERIAL PRIMARY KEY,
  dsp_status_id integer NOT NULL REFERENCES dsp_status(id) ON DELETE CASCADE,
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  playlist_nombre text NOT NULL,
  pista text NOT NULL,
  fecha_agregado date NOT NULL,
  posicion text NOT NULL,
  posicion_maxima integer NOT NULL,
  seguidores text NOT NULL,
  imagen_url text,
  link_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast lookups by entidad_id
CREATE INDEX IF NOT EXISTS dsp_playlists_entidad_id_idx 
  ON dsp_playlists(entidad_id);

-- Create index for fast lookups by dsp_status_id
CREATE INDEX IF NOT EXISTS dsp_playlists_dsp_status_id_idx 
  ON dsp_playlists(dsp_status_id);

-- Enable RLS
ALTER TABLE dsp_playlists ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all playlists
CREATE POLICY "Authenticated users can read playlists"
  ON dsp_playlists
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert playlists
CREATE POLICY "Authenticated users can insert playlists"
  ON dsp_playlists
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update playlists
CREATE POLICY "Authenticated users can update playlists"
  ON dsp_playlists
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete playlists
CREATE POLICY "Authenticated users can delete playlists"
  ON dsp_playlists
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dsp_playlists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updates
DROP TRIGGER IF EXISTS update_dsp_playlists_updated_at_trigger ON dsp_playlists;
CREATE TRIGGER update_dsp_playlists_updated_at_trigger
  BEFORE UPDATE ON dsp_playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_dsp_playlists_updated_at();
