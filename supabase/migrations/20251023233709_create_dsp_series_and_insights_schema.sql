/*
  # DSP Series and Insights Schema
  
  ## Overview
  Creates the complete schema for DSP (Digital Streaming Platform) metrics tracking.
  Data is inserted by n8n jobs from Chartmetric; frontend only reads from Supabase.
  
  ## New Tables
  
  ### dsp_series
  Stores normalized daily time series data per entity, platform, and metric.
  - `entidad_id` (uuid) - Links to the entity/artist
  - `platform` (text) - One of: spotify, apple, amazon
  - `metric` (text) - One of: followers, listeners, popularity, fl_ratio
  - `ts` (date) - The date of the measurement
  - `value` (numeric) - The metric value for that day
  - `day_diff` (numeric) - Day-over-day difference
  - `week_diff` (numeric) - Week-over-week difference
  - `week_pct` (numeric) - Weekly percentage change
  - `month_diff` (numeric) - Month-over-month difference
  - `month_pct` (numeric) - Monthly percentage change
  - `source` (jsonb) - Raw data point from source (optional)
  - Primary Key: (entidad_id, platform, metric, ts)
  
  ### dsp_insights
  Stores calculated insights and derived metrics per platform.
  - `entidad_id` (uuid) - Links to the entity/artist
  - `platform` (text) - One of: spotify, apple, amazon
  - `as_of_date` (date) - Calculation date (defaults to current date)
  - `streak_days` (int) - Consecutive days with positive follower growth
  - `best_day_date` (date) - Date of maximum day_diff for followers
  - `best_day_value` (numeric) - Maximum day_diff value
  - `velocity_3d` (numeric) - Average day_diff over 3 days
  - `velocity_7d` (numeric) - Average day_diff over 7 days
  - `eta_target_label` (text) - Target milestone label (e.g., '5.5M followers')
  - `eta_days` (numeric) - Estimated days to reach target
  - `anomaly` (boolean) - Whether current growth is anomalous
  - `capture_rate_per_1k` (numeric) - New followers per 1k listeners
  - `extra` (jsonb) - Future extensibility
  - Primary Key: (entidad_id, platform, as_of_date)
  
  ## Views
  
  ### v_dsp_latest
  Returns the most recent value for each metric per entity and platform.
  Optimizes frontend reads by pre-filtering to latest data point.
  
  ## Security
  No RLS policies applied (following existing configuration).
  
  ## Notes
  - Schema designed for multi-platform support (Spotify, Apple Music, Amazon Music)
  - All data inserted by n8n workflows
  - Frontend is read-only consumer
  - Supports 14-30 day sparklines and multiple delta calculations
*/

-- Create dsp_series table
CREATE TABLE IF NOT EXISTS dsp_series (
  entidad_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('spotify','apple','amazon')),
  metric TEXT NOT NULL CHECK (metric IN (
    'followers','listeners','popularity','fl_ratio'
  )),
  ts DATE NOT NULL,
  value NUMERIC,
  day_diff NUMERIC,
  week_diff NUMERIC,
  week_pct NUMERIC,
  month_diff NUMERIC,
  month_pct NUMERIC,
  source JSONB,
  PRIMARY KEY (entidad_id, platform, metric, ts)
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_dsp_series_lookup
  ON dsp_series (entidad_id, platform, metric, ts DESC);

-- Create dsp_insights table
CREATE TABLE IF NOT EXISTS dsp_insights (
  entidad_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('spotify','apple','amazon')),
  as_of_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_days INT,
  best_day_date DATE,
  best_day_value NUMERIC,
  velocity_3d NUMERIC,
  velocity_7d NUMERIC,
  eta_target_label TEXT,
  eta_days NUMERIC,
  anomaly BOOLEAN,
  capture_rate_per_1k NUMERIC,
  extra JSONB,
  PRIMARY KEY (entidad_id, platform, as_of_date)
);

-- Create view for latest values
CREATE OR REPLACE VIEW v_dsp_latest AS
WITH ranked AS (
  SELECT
    entidad_id, platform, metric, ts, value,
    day_diff, week_diff, week_pct, month_diff, month_pct,
    ROW_NUMBER() OVER (PARTITION BY entidad_id, platform, metric ORDER BY ts DESC) AS rn
  FROM dsp_series
)
SELECT 
  entidad_id, platform, metric, ts, value,
  day_diff, week_diff, week_pct, month_diff, month_pct
FROM ranked
WHERE rn = 1;
