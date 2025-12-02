/*
  # Allow Multiple Songs Per Entity in dsp_last_song

  1. Changes
    - Drop the unique constraint on `entidad_id` in `dsp_last_song` table
    - This allows tracking multiple songs per artist/band
    - Add a composite unique constraint on (entidad_id, isrc) to prevent duplicate songs

  2. Reasoning
    - Artists can have multiple active songs being tracked simultaneously
    - The frontend supports switching between "New Version" and "Old Version"
    - Current constraint prevents storing historical song data

  3. Impact
    - Existing data remains unchanged
    - Frontend will display version toggles when multiple songs exist
    - Backend sync can insert multiple songs per entity
*/

-- Drop the existing unique constraint on entidad_id
DROP INDEX IF EXISTS dsp_last_song_entidad_unique;

-- Add a composite unique constraint to prevent duplicate songs (same ISRC for same entity)
CREATE UNIQUE INDEX IF NOT EXISTS dsp_last_song_entidad_isrc_unique 
  ON dsp_last_song (entidad_id, isrc)
  WHERE isrc IS NOT NULL;
