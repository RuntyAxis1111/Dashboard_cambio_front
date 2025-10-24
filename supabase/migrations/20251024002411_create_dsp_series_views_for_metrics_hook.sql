/*
  # Create DSP Series Views for Metrics Hook

  1. Overview
    - Creates views that transform `dsp_series` data into the format expected by `useDSPMetrics` hook
    - Maintains compatibility with existing `SpotifyMetricsCard` component
    - Calculates 24h, 7d, and 30d deltas for followers, listeners, popularity, and fl_ratio

  2. New Views
    - `v_dsp_latest`: Latest value for each entity/platform/metric with calculated deltas
    - Compatible with the existing hook that expects: entidad_id, platform, metric, ts, value, day_diff, week_diff, week_pct, month_diff, month_pct

  3. Important Notes
    - This uses `dsp_series` table (the one with separate metrics)
    - NOT using `reportes_dsp_stbv` (the snapshot table)
    - Deltas are calculated by comparing current value vs historical values
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS v_dsp_latest CASCADE;

-- Create view for latest metrics with deltas
CREATE VIEW v_dsp_latest AS
WITH latest_values AS (
  SELECT DISTINCT ON (entidad_id, platform, metric)
    entidad_id,
    platform,
    metric,
    ts,
    value
  FROM dsp_series
  WHERE value IS NOT NULL
  ORDER BY entidad_id, platform, metric, ts DESC
),
day_ago AS (
  SELECT DISTINCT ON (entidad_id, platform, metric)
    entidad_id,
    platform,
    metric,
    value as value_1d
  FROM dsp_series
  WHERE 
    value IS NOT NULL
    AND ts >= (CURRENT_DATE - INTERVAL '1 day')::date
    AND ts < (CURRENT_DATE - INTERVAL '1 day')::date + INTERVAL '1 day'
  ORDER BY entidad_id, platform, metric, ts DESC
),
week_ago AS (
  SELECT DISTINCT ON (entidad_id, platform, metric)
    entidad_id,
    platform,
    metric,
    value as value_7d
  FROM dsp_series
  WHERE 
    value IS NOT NULL
    AND ts >= (CURRENT_DATE - INTERVAL '7 days')::date
    AND ts < (CURRENT_DATE - INTERVAL '7 days')::date + INTERVAL '1 day'
  ORDER BY entidad_id, platform, metric, ts DESC
),
month_ago AS (
  SELECT DISTINCT ON (entidad_id, platform, metric)
    entidad_id,
    platform,
    metric,
    value as value_30d
  FROM dsp_series
  WHERE 
    value IS NOT NULL
    AND ts >= (CURRENT_DATE - INTERVAL '30 days')::date
    AND ts < (CURRENT_DATE - INTERVAL '30 days')::date + INTERVAL '1 day'
  ORDER BY entidad_id, platform, metric, ts DESC
)
SELECT
  lv.entidad_id,
  lv.platform,
  lv.metric,
  lv.ts,
  lv.value,
  -- 24h deltas
  CASE 
    WHEN d1.value_1d IS NOT NULL THEN (lv.value - d1.value_1d)
    ELSE NULL
  END as day_diff,
  -- 7d deltas (absolute and percentage)
  CASE 
    WHEN d7.value_7d IS NOT NULL THEN (lv.value - d7.value_7d)
    ELSE NULL
  END as week_diff,
  CASE 
    WHEN d7.value_7d IS NOT NULL AND d7.value_7d > 0 THEN 
      ((lv.value - d7.value_7d) / d7.value_7d::numeric * 100)
    ELSE NULL
  END as week_pct,
  -- 30d deltas (absolute and percentage)
  CASE 
    WHEN d30.value_30d IS NOT NULL THEN (lv.value - d30.value_30d)
    ELSE NULL
  END as month_diff,
  CASE 
    WHEN d30.value_30d IS NOT NULL AND d30.value_30d > 0 THEN 
      ((lv.value - d30.value_30d) / d30.value_30d::numeric * 100)
    ELSE NULL
  END as month_pct
FROM latest_values lv
LEFT JOIN day_ago d1 ON 
  lv.entidad_id = d1.entidad_id 
  AND lv.platform = d1.platform 
  AND lv.metric = d1.metric
LEFT JOIN week_ago d7 ON 
  lv.entidad_id = d7.entidad_id 
  AND lv.platform = d7.platform 
  AND lv.metric = d7.metric
LEFT JOIN month_ago d30 ON 
  lv.entidad_id = d30.entidad_id 
  AND lv.platform = d30.platform 
  AND lv.metric = d30.metric;

-- Grant access
GRANT SELECT ON v_dsp_latest TO authenticated;
GRANT SELECT ON v_dsp_latest TO anon;
