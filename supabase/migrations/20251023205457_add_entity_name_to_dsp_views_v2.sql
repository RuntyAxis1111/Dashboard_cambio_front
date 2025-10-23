/*
  # Add entity_name to DSP views for better identification

  1. Changes to Views
    - Drop and recreate all DSP views with entity_name column
    - `v_dsp_latest` - Add entity_name column by joining with reportes_entidades
    - `v_dsp_delta_24h` - Add entity_name column by joining with reportes_entidades  
    - `v_dsp_delta_7d` - Add entity_name column by joining with reportes_entidades
    - `v_dsp_timeseries` - Add entity_name column by joining with reportes_entidades

  2. Purpose
    - Makes it easier to identify which entity the DSP data belongs to
    - No need to look up entity_id separately in reportes_entidades table
    - Better user experience when viewing DSP data in database
*/

-- Drop dependent views first
DROP VIEW IF EXISTS public.v_dsp_delta_24h CASCADE;
DROP VIEW IF EXISTS public.v_dsp_delta_7d CASCADE;
DROP VIEW IF EXISTS public.v_dsp_timeseries CASCADE;
DROP VIEW IF EXISTS public.v_dsp_latest CASCADE;

-- Recreate v_dsp_latest with entity_name
CREATE VIEW public.v_dsp_latest AS
SELECT DISTINCT ON (d.entity_id, d.dsp)
  d.entity_id, 
  e.nombre as entity_name,
  d.dsp, 
  d.snapshot_ts,
  d.followers_total, 
  d.monthly_listeners, 
  d.streams_total,
  d.rank_country, 
  d.dsp_artist_url, 
  d.source, 
  d.ingested_at
FROM public.reportes_dsp_stbv d
LEFT JOIN public.reportes_entidades e ON d.entity_id = e.id
ORDER BY d.entity_id, d.dsp, d.snapshot_ts DESC;

-- Recreate v_dsp_delta_24h with entity_name
CREATE VIEW public.v_dsp_delta_24h AS
WITH latest AS (
  SELECT * FROM public.v_dsp_latest
),
prev AS (
  SELECT 
    l.entity_id, 
    l.dsp,
    (
      SELECT row(r.*)::public.reportes_dsp_stbv
      FROM public.reportes_dsp_stbv r
      WHERE r.entity_id = l.entity_id 
        AND r.dsp = l.dsp
        AND r.snapshot_ts <= l.snapshot_ts - INTERVAL '24 hours'
      ORDER BY r.snapshot_ts DESC 
      LIMIT 1
    ) AS p
  FROM latest l
)
SELECT
  l.entity_id,
  l.entity_name,
  l.dsp, 
  l.snapshot_ts AS latest_ts,
  (l.followers_total - COALESCE((p.p).followers_total, 0)) AS followers_delta_24h,
  (l.monthly_listeners - COALESCE((p.p).monthly_listeners, 0)) AS listeners_delta_24h,
  (l.streams_total - COALESCE((p.p).streams_total, 0)) AS streams_delta_24h
FROM latest l 
LEFT JOIN prev p USING (entity_id, dsp);

-- Recreate v_dsp_delta_7d with entity_name
CREATE VIEW public.v_dsp_delta_7d AS
WITH latest AS (
  SELECT * FROM public.v_dsp_latest
),
prev AS (
  SELECT 
    l.entity_id, 
    l.dsp,
    (
      SELECT row(r.*)::public.reportes_dsp_stbv
      FROM public.reportes_dsp_stbv r
      WHERE r.entity_id = l.entity_id 
        AND r.dsp = l.dsp
        AND r.snapshot_ts <= l.snapshot_ts - INTERVAL '7 days'
      ORDER BY r.snapshot_ts DESC 
      LIMIT 1
    ) AS p
  FROM latest l
)
SELECT
  l.entity_id,
  l.entity_name,
  l.dsp, 
  l.snapshot_ts AS latest_ts,
  (l.followers_total - COALESCE((p.p).followers_total, 0)) AS followers_delta_7d,
  (l.monthly_listeners - COALESCE((p.p).monthly_listeners, 0)) AS listeners_delta_7d,
  (l.streams_total - COALESCE((p.p).streams_total, 0)) AS streams_delta_7d
FROM latest l 
LEFT JOIN prev p USING (entity_id, dsp);

-- Recreate v_dsp_timeseries with entity_name
CREATE VIEW public.v_dsp_timeseries AS
SELECT 
  d.entity_id,
  e.nombre as entity_name,
  d.dsp,
  d.snapshot_ts,
  d.followers_total,
  d.monthly_listeners,
  d.streams_total,
  d.rank_country,
  d.source,
  d.ingested_at
FROM public.reportes_dsp_stbv d
LEFT JOIN public.reportes_entidades e ON d.entity_id = e.id
ORDER BY d.entity_id, d.dsp, d.snapshot_ts DESC;