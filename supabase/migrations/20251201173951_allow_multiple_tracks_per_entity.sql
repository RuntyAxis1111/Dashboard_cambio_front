/*
  # Allow Multiple Tracks Per Entity in dsp_status
  
  1. Changes
    - Drop the unique constraint on `entidad_id` in `dsp_status` table
    - This allows tracking multiple songs per artist/band
    - Add a composite unique constraint on (entidad_id, last_track_id) to prevent duplicate tracks
  
  2. Reasoning
    - Some artists like Santos Bravos need to track multiple songs simultaneously
    - Current constraint prevents this functionality
    - The new composite constraint ensures we don't track the same song twice for the same entity
  
  3. Impact
    - Existing data remains unchanged
    - Frontend will need to handle multiple tracks per entity
    - Backend sync will continue working as expected
*/

-- Drop the existing unique constraint on entidad_id
DROP INDEX IF EXISTS dsp_status_entidad_id_unique;

-- Add a composite unique constraint to prevent duplicate (entidad_id, last_track_id) combinations
CREATE UNIQUE INDEX IF NOT EXISTS dsp_status_entidad_track_unique 
  ON dsp_status (entidad_id, last_track_id)
  WHERE last_track_id IS NOT NULL;
