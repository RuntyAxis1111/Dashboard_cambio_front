/*
  # DSP Track Performance Tables

  ## Overview
  Tracks individual song/track performance across DSP platforms (Spotify, Apple Music, Amazon Music).
  Similar to Chartmetric's track comparison functionality.

  ## New Tables

  ### reportes_dsp_tracks
  Stores track metadata and links to entities
  - `id` (uuid, primary key)
  - `entity_id` (uuid) - Links to reportes_entidades
  - `track_name` (text) - Name of the track
  - `album_name` (text) - Album name (optional)
  - `release_date` (date) - Release date
  - `isrc` (text) - International Standard Recording Code
  - `cover_art_url` (text) - Track/album artwork URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### reportes_dsp_track_snapshots
  Stores time-series data for track performance per DSP
  - `id` (uuid, primary key)
  - `track_id` (uuid) - Links to reportes_dsp_tracks
  - `dsp` (text) - One of: spotify, apple_music, amazon_music
  - `snapshot_ts` (timestamptz) - When this snapshot was taken
  - `streams_total` (bigint) - Total streams for this track
  - `streams_daily` (bigint) - Daily streams (optional)
  - `rank_country` (integer) - Country chart ranking (optional)
  - `rank_global` (integer) - Global chart ranking (optional)
  - `playlist_count` (integer) - Number of playlists featuring this track
  - `source` (text) - Data source (default: chartmetric)
  - `ingested_at` (timestamptz) - When data was ingested
  - Unique constraint: (track_id, dsp, snapshot_ts)

  ## Views

  ### v_tracks_latest
  Returns the most recent snapshot per track and DSP

  ### v_tracks_performance
  Aggregated view showing track performance across all DSPs with deltas

  ## Security
  - Enable RLS on both tables
  - Authenticated users can read all track data
  - Only service role can insert data (via n8n)

  ## Notes
  - Designed to work with Chartmetric API or similar data sources
  - Front-end will display track performance charts similar to Chartmetric
  - Tracks are linked to artists/bands via entity_id
*/

-- Create tracks table
CREATE TABLE IF NOT EXISTS public.reportes_dsp_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  track_name text NOT NULL,
  album_name text,
  release_date date,
  isrc text,
  cover_art_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_tracks_entity FOREIGN KEY (entity_id) 
    REFERENCES public.reportes_entidades(id) ON DELETE CASCADE
);

-- Create track snapshots table
CREATE TABLE IF NOT EXISTS public.reportes_dsp_track_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL,
  dsp text NOT NULL CHECK (dsp IN ('spotify','apple_music','amazon_music')),
  snapshot_ts timestamptz NOT NULL,
  streams_total bigint,
  streams_daily bigint,
  rank_country integer,
  rank_global integer,
  playlist_count integer,
  source text NOT NULL DEFAULT 'chartmetric',
  ingested_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(track_id, dsp, snapshot_ts),
  CONSTRAINT fk_snapshots_track FOREIGN KEY (track_id) 
    REFERENCES public.reportes_dsp_tracks(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_entity 
  ON public.reportes_dsp_tracks(entity_id);

CREATE INDEX IF NOT EXISTS idx_track_snapshots_track_dsp_ts 
  ON public.reportes_dsp_track_snapshots(track_id, dsp, snapshot_ts DESC);

-- Enable RLS
ALTER TABLE public.reportes_dsp_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reportes_dsp_track_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read tracks" ON public.reportes_dsp_tracks;
DROP POLICY IF EXISTS "Service role can insert tracks" ON public.reportes_dsp_tracks;
DROP POLICY IF EXISTS "Service role can update tracks" ON public.reportes_dsp_tracks;
DROP POLICY IF EXISTS "Authenticated users can read track snapshots" ON public.reportes_dsp_track_snapshots;
DROP POLICY IF EXISTS "Service role can insert track snapshots" ON public.reportes_dsp_track_snapshots;

-- Policies for tracks table
CREATE POLICY "Authenticated users can read tracks"
  ON public.reportes_dsp_tracks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert tracks"
  ON public.reportes_dsp_tracks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update tracks"
  ON public.reportes_dsp_tracks
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for track snapshots table
CREATE POLICY "Authenticated users can read track snapshots"
  ON public.reportes_dsp_track_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert track snapshots"
  ON public.reportes_dsp_track_snapshots
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- View: Latest snapshot per track and DSP
CREATE OR REPLACE VIEW public.v_tracks_latest AS
SELECT DISTINCT ON (track_id, dsp)
  ts.track_id,
  ts.dsp,
  ts.snapshot_ts,
  ts.streams_total,
  ts.streams_daily,
  ts.rank_country,
  ts.rank_global,
  ts.playlist_count,
  t.track_name,
  t.album_name,
  t.release_date,
  t.cover_art_url,
  t.entity_id
FROM public.reportes_dsp_track_snapshots ts
JOIN public.reportes_dsp_tracks t ON t.id = ts.track_id
ORDER BY track_id, dsp, snapshot_ts DESC;

-- View: Track performance with aggregated stats
CREATE OR REPLACE VIEW public.v_tracks_performance AS
WITH latest_per_dsp AS (
  SELECT * FROM public.v_tracks_latest
),
aggregated AS (
  SELECT 
    track_id,
    track_name,
    album_name,
    release_date,
    cover_art_url,
    entity_id,
    SUM(streams_total) as total_streams_all_dsp,
    MAX(snapshot_ts) as last_updated,
    jsonb_object_agg(
      dsp,
      jsonb_build_object(
        'streams_total', streams_total,
        'streams_daily', streams_daily,
        'rank_country', rank_country,
        'rank_global', rank_global,
        'playlist_count', playlist_count
      )
    ) as dsp_breakdown
  FROM latest_per_dsp
  GROUP BY track_id, track_name, album_name, release_date, cover_art_url, entity_id
)
SELECT * FROM aggregated
ORDER BY total_streams_all_dsp DESC NULLS LAST;