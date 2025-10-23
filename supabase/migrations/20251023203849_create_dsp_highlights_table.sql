/*
  # Create DSP Highlights Table

  1. New Tables
    - `dsp_highlights`
      - `id` (uuid, primary key)
      - `entity_id` (uuid, foreign key to reportes_entidades)
      - `highlight_key` (text) - Identifier like 'top_dsp', 'streaming_momentum', 'audience_expansion', 'platform_presence'
      - `title` (text) - The bold title like "Top DSP this week:"
      - `content` (text) - The full text content
      - `display_order` (integer) - Order to display (1-4)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `dsp_highlights` table
    - Add policy for authenticated users to read highlights

  3. Indexes
    - Index on entity_id for faster lookups
    - Unique constraint on (entity_id, highlight_key)
*/

CREATE TABLE IF NOT EXISTS dsp_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  highlight_key text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_id, highlight_key)
);

CREATE INDEX IF NOT EXISTS idx_dsp_highlights_entity_id ON dsp_highlights(entity_id);

ALTER TABLE dsp_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read DSP highlights"
  ON dsp_highlights FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert DSP highlights"
  ON dsp_highlights FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update DSP highlights"
  ON dsp_highlights FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete DSP highlights"
  ON dsp_highlights FOR DELETE
  TO authenticated
  USING (true);