/*
  # Create Members Growth Tracking Table

  1. New Tables
    - `reportes_miembros_growth`
      - `id` (uuid, primary key)
      - `entidad_id` (uuid, foreign key to reportes_entidades)
      - `nombre` (text) - Member name
      - `slug` (text) - URL-friendly identifier
      - `instagram_followers` (integer) - Current Instagram followers
      - `instagram_growth` (integer) - Week-over-week growth
      - `instagram_growth_pct` (numeric) - Growth percentage
      - `orden` (integer) - Display order
      - `imagen_url` (text) - Profile image URL
      - `activo` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reportes_miembros_growth` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS reportes_miembros_growth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  slug text NOT NULL,
  instagram_followers integer DEFAULT 0,
  instagram_growth integer DEFAULT 0,
  instagram_growth_pct numeric(10,2) DEFAULT 0,
  orden integer DEFAULT 0,
  imagen_url text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reportes_miembros_growth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read members growth data"
  ON reportes_miembros_growth
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_reportes_miembros_growth_entidad 
  ON reportes_miembros_growth(entidad_id);

CREATE INDEX IF NOT EXISTS idx_reportes_miembros_growth_orden 
  ON reportes_miembros_growth(entidad_id, orden);
