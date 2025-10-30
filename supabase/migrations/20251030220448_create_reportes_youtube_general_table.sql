/*
  # Create reportes_youtube_general table

  1. New Tables
    - `reportes_youtube_general`
      - `id_youtube` (uuid, primary key, auto-generated)
      - `entidad_id` (uuid, foreign key to reportes_entidades.id)
      - `nombre` (text, synced from reportes_entidades.nombre)
      - `subscribers` (bigint, total subscribers count)
      - `total_views` (bigint, total video views)
      - `total_watch_time` (bigint, total watch time in minutes/hours)
      - `total_likes` (bigint, total likes across all videos)
      - `total_comments` (bigint, total comments across all videos)

  2. Security
    - Enable RLS on `reportes_youtube_general` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS reportes_youtube_general (
  id_youtube uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  subscribers bigint DEFAULT 0,
  total_views bigint DEFAULT 0,
  total_watch_time bigint DEFAULT 0,
  total_likes bigint DEFAULT 0,
  total_comments bigint DEFAULT 0
);

ALTER TABLE reportes_youtube_general ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read youtube general data"
  ON reportes_youtube_general
  FOR SELECT
  TO authenticated
  USING (true);
