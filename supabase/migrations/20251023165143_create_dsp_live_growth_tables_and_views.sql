/*
  # DSP Live Growth - Tables and Views

  ## New Tables
  
  ### reportes_dsp_stbv
  Stores DSP (Digital Service Provider) snapshots for streaming metrics.
  - `id` (uuid, primary key)
  - `entity_id` (uuid) - Links to reportes_entidades
  - `dsp` (text) - One of: spotify, apple_music, amazon_music
  - `snapshot_ts` (timestamptz) - When this snapshot was taken
  - `followers_total` (bigint) - Total followers/subscribers
  - `monthly_listeners` (bigint) - Monthly listeners count
  - `streams_total` (bigint) - Total streams
  - `rank_country` (text) - Country ranking (optional)
  - `dsp_artist_url` (text) - Direct link to artist profile
  - `source` (text) - Data source (default: chartmetric)
  - `ingested_at` (timestamptz) - When data was ingested
  - Unique constraint: (entity_id, dsp, snapshot_ts)

  ## Views

  ### v_dsp_latest
  Returns the most recent snapshot per entity and DSP

  ### v_dsp_delta_24h
  Calculates 24-hour deltas for all metrics

  ### v_dsp_delta_7d
  Calculates 7-day deltas for all metrics

  ### v_dsp_timeseries
  Raw time series data for charting

  ## Security
  - Enable RLS on reportes_dsp_stbv
  - Authenticated users can read their own entity data
  - Only system (via n8n) can insert data

  ## Notes
  - n8n workflow will insert snapshots periodically
  - Front-end only reads from views
  - No hardcoded data - all dynamic from database
*/

-- Create table if not exists
create table if not exists public.reportes_dsp_stbv (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null,
  dsp text not null check (dsp in ('spotify','apple_music','amazon_music')),
  snapshot_ts timestamptz not null,
  followers_total bigint,
  monthly_listeners bigint,
  streams_total bigint,
  rank_country text,
  dsp_artist_url text,
  source text not null default 'chartmetric',
  ingested_at timestamptz not null default now(),
  unique(entity_id, dsp, snapshot_ts)
);

-- Create index for performance
create index if not exists idx_dsp_entity_ts 
  on public.reportes_dsp_stbv(entity_id, dsp, snapshot_ts desc);

-- Enable RLS
alter table public.reportes_dsp_stbv enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Authenticated users can read DSP data" on public.reportes_dsp_stbv;
drop policy if exists "Service role can insert DSP data" on public.reportes_dsp_stbv;

-- Policy: Authenticated users can read all DSP data
create policy "Authenticated users can read DSP data"
  on public.reportes_dsp_stbv
  for select
  to authenticated
  using (true);

-- Policy: Service role can insert DSP data (for n8n)
create policy "Service role can insert DSP data"
  on public.reportes_dsp_stbv
  for insert
  to service_role
  with check (true);

-- View: Latest snapshot per entity and DSP
create or replace view public.v_dsp_latest as
select distinct on (entity_id, dsp)
  entity_id, dsp, snapshot_ts,
  followers_total, monthly_listeners, streams_total,
  rank_country, dsp_artist_url, source, ingested_at
from public.reportes_dsp_stbv
order by entity_id, dsp, snapshot_ts desc;

-- View: 24-hour deltas
create or replace view public.v_dsp_delta_24h as
with latest as (
  select * from public.v_dsp_latest
),
prev as (
  select 
    l.entity_id, 
    l.dsp,
    (
      select row(r.*)::public.reportes_dsp_stbv
      from public.reportes_dsp_stbv r
      where r.entity_id = l.entity_id 
        and r.dsp = l.dsp
        and r.snapshot_ts <= l.snapshot_ts - interval '24 hours'
      order by r.snapshot_ts desc 
      limit 1
    ) as p
  from latest l
)
select
  l.entity_id, 
  l.dsp, 
  l.snapshot_ts as latest_ts,
  (l.followers_total - coalesce((p.p).followers_total, 0)) as followers_delta_24h,
  (l.monthly_listeners - coalesce((p.p).monthly_listeners, 0)) as listeners_delta_24h,
  (l.streams_total - coalesce((p.p).streams_total, 0)) as streams_delta_24h
from latest l 
left join prev p using (entity_id, dsp);

-- View: 7-day deltas
create or replace view public.v_dsp_delta_7d as
with latest as (
  select * from public.v_dsp_latest
),
prev as (
  select 
    l.entity_id, 
    l.dsp,
    (
      select row(r.*)::public.reportes_dsp_stbv
      from public.reportes_dsp_stbv r
      where r.entity_id = l.entity_id 
        and r.dsp = l.dsp
        and r.snapshot_ts <= l.snapshot_ts - interval '7 days'
      order by r.snapshot_ts desc 
      limit 1
    ) as p
  from latest l
)
select
  l.entity_id, 
  l.dsp, 
  l.snapshot_ts as latest_ts,
  (l.followers_total - coalesce((p.p).followers_total, 0)) as followers_delta_7d,
  (l.monthly_listeners - coalesce((p.p).monthly_listeners, 0)) as listeners_delta_7d,
  (l.streams_total - coalesce((p.p).streams_total, 0)) as streams_delta_7d
from latest l 
left join prev p using (entity_id, dsp);

-- View: Time series for charting
create or replace view public.v_dsp_timeseries as
select 
  entity_id, 
  dsp, 
  snapshot_ts, 
  followers_total, 
  monthly_listeners, 
  streams_total
from public.reportes_dsp_stbv
order by entity_id, dsp, snapshot_ts;
