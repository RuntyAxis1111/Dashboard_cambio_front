/*
  # Create Weekly Reports Summary View

  ## Overview
  Creates a unified view for weekly reports that combines entity information with their status,
  similar to how v_dsp_latest works for DSP metrics.

  ## New View
  - `v_weekly_reports_summary`: Combines reportes_entidades with reportes_estado to provide
    a complete picture of each entity's weekly report status

  ## Columns
  - entidad_id: Entity UUID
  - nombre: Entity name
  - slug: URL-friendly slug
  - tipo: Entity type (artist, band, etc.)
  - imagen_url: Entity image URL
  - activo: Whether entity is active
  - semana_inicio: Week start date
  - semana_fin: Week end date
  - status: Report status (ready, in_progress, etc.)

  ## Purpose
  - Provides a clean, maintainable way to query weekly reports
  - Eliminates the need for complex joins in application code
  - Matches the pattern used for DSP views (v_dsp_latest)
  - Replaces the old reportes_v_ultimos view pattern
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS v_weekly_reports_summary CASCADE;

-- Create the new view
CREATE OR REPLACE VIEW v_weekly_reports_summary AS
SELECT 
  e.id as entidad_id,
  e.nombre,
  e.slug,
  e.tipo,
  e.imagen_url,
  e.activo,
  es.semana_inicio,
  es.semana_fin,
  es.status
FROM reportes_entidades e
LEFT JOIN reportes_estado es ON e.id = es.entidad_id
WHERE e.activo = true
ORDER BY e.nombre;

-- Grant access to the view
GRANT SELECT ON v_weekly_reports_summary TO authenticated;
GRANT SELECT ON v_weekly_reports_summary TO anon;
