-- Idempotent seed script for Show and Artist template examples
-- Creates two weekly reports:
--   1. Santos Bravos - Show template (show_v1)
--   2. Adrián Cota - Artist template (artist_v1)
--
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses upsert)

-- ============================================================================
-- 1. UPSERT ARTISTS
-- ============================================================================

-- Santos Bravos (Show entity)
INSERT INTO public.artistas_registry (nombre, id_bigquery, id_chartmetric, id_meltwater)
VALUES (
  'Santos Bravos',
  'SANTOSBRAVOS_FACEBOOK',
  NULL,
  '27463925'
)
ON CONFLICT (nombre) DO UPDATE SET
  id_bigquery = EXCLUDED.id_bigquery,
  id_meltwater = EXCLUDED.id_meltwater,
  updated_at = NOW();

-- Adrián Cota (Artist entity)
INSERT INTO public.artistas_registry (nombre, id_bigquery, id_chartmetric, id_meltwater)
VALUES (
  'Adrián Cota',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (nombre) DO UPDATE SET
  updated_at = NOW();

-- ============================================================================
-- 2. CREATE REPORTS (with PL/pgSQL block for variable reuse)
-- ============================================================================

DO $$
DECLARE
  v_santos_bravos_id INTEGER;
  v_adrian_cota_id INTEGER;
  v_santos_report_id INTEGER;
  v_adrian_report_id INTEGER;
BEGIN
  -- Get artist IDs
  SELECT id INTO v_santos_bravos_id FROM public.artistas_registry WHERE nombre = 'Santos Bravos';
  SELECT id INTO v_adrian_cota_id FROM public.artistas_registry WHERE nombre = 'Adrián Cota';

  -- ============================================================================
  -- SANTOS BRAVOS - SHOW TEMPLATE (show_v1)
  -- ============================================================================

  -- Create/update report
  INSERT INTO public.reports (
    report_type,
    template_key,
    artist_id,
    creator_id,
    week_start,
    week_end,
    title,
    summary_md,
    raw_json
  )
  VALUES (
    'artist',
    'show_v1',
    v_santos_bravos_id,
    NULL,
    '2025-10-04',
    '2025-10-10',
    'SANTOS BRAVOS Weekly — 2025-10-04 to 2025-10-10',
    'Santos Bravos showed strong momentum this week with notable engagement across TikTok and Instagram. The show continues to build its fanbase with increasing social interactions.',
    '{"entity_type": "show"}'::jsonb
  )
  ON CONFLICT (report_type, artist_id, week_end) DO UPDATE SET
    template_key = EXCLUDED.template_key,
    title = EXCLUDED.title,
    summary_md = EXCLUDED.summary_md,
    raw_json = EXCLUDED.raw_json,
    updated_at = NOW()
  RETURNING id INTO v_santos_report_id;

  -- Section 1: Highlights
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'highlights', 1, 'Highlights / Overall Summary',
    '• Strong TikTok momentum with increased engagement
• Instagram KPIs showing positive trends
• Consistent streaming performance',
    '{"bullets": ["Strong TikTok momentum with increased engagement", "Instagram KPIs showing positive trends", "Consistent streaming performance"]}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 2: Fan Sentiment
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'fan_sentiment', 2, 'Fan Sentiment',
    'Fans continue to engage positively with Santos Bravos content across platforms. Social media sentiment remains favorable with growing community interaction.',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 3: TikTok Trends
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'tiktok_trends', 3, 'TikTok Trends',
    'Data collection in progress',
    '{"top_video": null, "comments": null, "shares": null, "notes": "N/A"}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 4: Instagram KPIs
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'instagram_kpis', 4, 'Instagram KPIs',
    'Instagram metrics tracking enabled',
    '{"ctr_link_in_bio": null, "engagement_over_reach": null, "views_per_reach": null}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 5: Streaming Trends
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'streaming_trends', 5, 'Streaming Trends',
    'Streaming data aggregation in progress',
    '{"spotify_streams_7d": null, "delta_vs_pw": null}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 6: Demographics
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'demographics', 6, 'Demographics',
    'Audience demographics being analyzed',
    '{"gender": {}, "age": {}, "top_countries": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 7: Playlist Adds
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'playlist_adds', 7, 'DSP Playlist Adds',
    'No new playlist additions this week',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 8: Top Countries
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_santos_report_id, 'top_countries', 8, 'Top Countries',
    'Geographic data pending',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, title = EXCLUDED.title, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- ============================================================================
  -- ADRIÁN COTA - ARTIST TEMPLATE (artist_v1)
  -- ============================================================================

  -- Create/update report
  INSERT INTO public.reports (
    report_type,
    template_key,
    artist_id,
    creator_id,
    week_start,
    week_end,
    title,
    summary_md,
    raw_json
  )
  VALUES (
    'artist',
    'artist_v1',
    v_adrian_cota_id,
    NULL,
    '2025-10-02',
    '2025-10-08',
    'ADRIÁN COTA Weekly — 2025-10-02 to 2025-10-08',
    'Adrián Cota continues developing his artist presence this week. Tracking across streaming platforms, social media, and fan engagement metrics is active.',
    '{"entity_type": "artist"}'::jsonb
  )
  ON CONFLICT (report_type, artist_id, week_end) DO UPDATE SET
    template_key = EXCLUDED.template_key,
    title = EXCLUDED.title,
    summary_md = EXCLUDED.summary_md,
    raw_json = EXCLUDED.raw_json,
    updated_at = NOW()
  RETURNING id INTO v_adrian_report_id;

  -- Section 1: Fan Sentiment
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'fan_sentiment', 1, 'Fan Sentiment',
    'No data',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 2: Highlights
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'highlights', 2, 'Weekly Highlights / Overall Summary',
    '• Building artist presence across platforms
• Engaging with growing fanbase
• Consistent content strategy',
    '{"bullets": ["Building artist presence across platforms", "Engaging with growing fanbase", "Consistent content strategy"]}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 3: Streaming Data Update
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'streaming_data_update', 3, 'Streaming Data Update',
    'Streaming data collection in progress',
    '{"streams_7d": null, "listeners_7d": null}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 4: Billboard Charts
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'billboard_charts', 4, 'Billboard',
    'No Billboard chart positions this week',
    '{"positions": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 5: Spotify Charts
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'spotify_charts', 5, 'Spotify',
    'Not currently charting',
    '{"markets": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 6: Apple Music
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'apple_music', 6, 'Apple Music',
    'No chart data available',
    '{"markets": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 7: Shazam
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'shazam', 7, 'Shazam',
    'No Shazam chart activity',
    '{"charts": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 8: Streaming Trends
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'streaming_trends', 8, 'Streaming Trends',
    'Streaming trends analysis pending',
    '{"tracks": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 9: TikTok Trends
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'tiktok_trends', 9, 'TikTok Trends',
    'TikTok activity monitoring enabled',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 10: US Weekly Album Sales
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'us_weekly_album_sales', 10, 'US Weekly Album Sales Updates',
    'No album sales data this week',
    '{"units": null}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 11: MV Views
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'mv_views', 11, 'Total MV Views',
    'Music video metrics pending',
    '{"total": null}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 12: Spotify Stats
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'spotify_stats', 12, 'Spotify Streams',
    'Spotify detailed stats tracking',
    '{"tracks": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 13: Playlist Adds
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'playlist_adds', 13, 'DSP Playlist Adds',
    'No new playlist placements',
    '{"items": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 14: Instagram KPIs
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'instagram_kpis', 14, 'Instagram KPIs',
    'Social growth tracking in progress',
    '{"growth": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 15: Demographics
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'demographics', 15, 'Demographics / Top Countries / Top Cities',
    'Demographic data analysis underway',
    '{"countries": [], "cities": []}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, data_json = EXCLUDED.data_json, updated_at = NOW();

  -- Section 16: Sources
  INSERT INTO public.report_sections (report_id, section_key, order_no, title, content_md, data_json)
  VALUES (
    v_adrian_report_id, 'sources', 16, 'Sources',
    'Data sources: Meltwater, Chartmetric, Spotify for Artists (S4A), Apple Music for Artists, TikTok Analytics, Instagram Insights',
    '{"list": ["Meltwater", "Chartmetric", "Spotify for Artists (S4A)", "Apple Music for Artists", "TikTok Analytics", "Instagram Insights"]}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no, content_md = EXCLUDED.content_md, data_json = EXCLUDED.data_json, updated_at = NOW();

  RAISE NOTICE 'Seed completed successfully!';
  RAISE NOTICE 'Santos Bravos (Show): % sections', (SELECT COUNT(*) FROM report_sections WHERE report_id = v_santos_report_id);
  RAISE NOTICE 'Adrián Cota (Artist): % sections', (SELECT COUNT(*) FROM report_sections WHERE report_id = v_adrian_report_id);
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

SELECT
  r.id as report_id,
  r.template_key,
  r.title,
  a.nombre as artist,
  r.week_start,
  r.week_end,
  r.raw_json->>'entity_type' as entity_type,
  COUNT(rs.id) as sections_count
FROM reports r
JOIN artistas_registry a ON a.id = r.artist_id
LEFT JOIN report_sections rs ON rs.report_id = r.id
WHERE r.report_type = 'artist'
GROUP BY r.id, r.template_key, r.title, a.nombre, r.week_start, r.week_end, r.raw_json
ORDER BY r.week_end DESC;
