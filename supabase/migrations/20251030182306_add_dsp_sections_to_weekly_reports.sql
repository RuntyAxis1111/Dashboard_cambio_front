/*
  # Merge DSP Sections into Weekly Reports

  ## Overview
  This migration integrates the DSP Live Growth sections (Platform Breakdown and Latest Song Release Tracking)
  into the main Weekly Reports, eliminating the need for a separate DSP detail page.

  ## Changes
  
  1. Reorder existing sections
     - All sections with orden >= 4 are shifted by +2 to make room for DSP sections
     - This affects: social_growth, members_growth, pr_press, weekly_content, top_posts, fan_sentiment, demographics, sources
  
  2. New Sections Added (for all active entities)
     - `dsp_platform_breakdown` (orden 4) - Shows Spotify metrics, followers, listeners, playlists
     - `dsp_last_song_tracking` (orden 5) - Shows latest song release metrics across platforms
  
  3. Section Order After Migration
     - orden 1: highlights
     - orden 2: mv_totales
     - orden 3: spotify_insights
     - orden 4: dsp_platform_breakdown (NEW)
     - orden 5: dsp_last_song_tracking (NEW)
     - orden 6: social_growth (was 4)
     - orden 7: members_growth (was 5)
     - orden 8: pr_press (was 6)
     - orden 9: weekly_content (was 7)
     - orden 10: top_posts (was 8)
     - orden 11: fan_sentiment (was 9)
     - orden 12: demographics (was 10)
     - orden 13: sources (was 11)
     - orden 100: dsp_live_growth (unchanged - legacy section)

  ## Impact
  - All active entities get the new DSP sections
  - Existing data is preserved
  - Report order is maintained with new sections inserted logically
*/

-- Step 1: Reorder existing sections (shift orden +2 for sections with orden >= 4 and orden < 100)
UPDATE reportes_secciones
SET orden = orden + 2
WHERE orden >= 4 AND orden < 100;

-- Step 2: Insert new DSP sections for all active entities
INSERT INTO reportes_secciones (entidad_id, seccion_clave, titulo, lista, orden)
SELECT 
  e.id,
  'dsp_platform_breakdown',
  'DSP Platform Breakdown',
  false,
  4
FROM reportes_entidades e
WHERE e.activo = true
ON CONFLICT (entidad_id, seccion_clave) DO NOTHING;

INSERT INTO reportes_secciones (entidad_id, seccion_clave, titulo, lista, orden)
SELECT 
  e.id,
  'dsp_last_song_tracking',
  'Latest Song Release Tracking',
  false,
  5
FROM reportes_entidades e
WHERE e.activo = true
ON CONFLICT (entidad_id, seccion_clave) DO NOTHING;
