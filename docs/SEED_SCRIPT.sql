-- Idempotent seed script for Santos Bravos test data
-- Run this in Supabase SQL Editor to populate test data for the new schema

-- 1. Upsert artist in artistas_registry
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

-- Get artist ID (should be 1 if this is first artist)
DO $$
DECLARE
  v_artist_id INTEGER;
  v_report_id INTEGER;
BEGIN
  -- Get artist ID
  SELECT id INTO v_artist_id FROM public.artistas_registry WHERE nombre = 'Santos Bravos';

  -- 2. Upsert report for Santos Bravos
  INSERT INTO public.reports (
    report_type,
    template_key,
    artist_id,
    week_start,
    week_end,
    title,
    summary_md,
    raw_json
  )
  VALUES (
    'artist',
    'default',
    v_artist_id,
    '2025-10-04',
    '2025-10-10',
    'SANTOS BRAVOS Weekly — 2025-10-04 a 2025-10-10',
    'Test report generated from new schema',
    '{}'::jsonb
  )
  ON CONFLICT (report_type, artist_id, week_end) DO UPDATE SET
    title = EXCLUDED.title,
    summary_md = EXCLUDED.summary_md,
    updated_at = NOW()
  RETURNING id INTO v_report_id;

  -- 3. Upsert sections for Santos Bravos report

  -- Highlights section
  INSERT INTO public.report_sections (
    report_id,
    section_key,
    order_no,
    title,
    content_md,
    data_json
  )
  VALUES (
    v_report_id,
    'highlights',
    1,
    'Highlights / Overall Summary',
    '',
    '{"bullets": ["TikTok comments +103.5%", "Shares +255.6%", "Strong engagement across all platforms"]}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no,
    title = EXCLUDED.title,
    data_json = EXCLUDED.data_json,
    updated_at = NOW();

  -- TikTok Trends section
  INSERT INTO public.report_sections (
    report_id,
    section_key,
    order_no,
    title,
    content_md,
    data_json
  )
  VALUES (
    v_report_id,
    'tiktok_trends',
    2,
    'TikTok Trends',
    '',
    '{"trends": [{"track": "Santos Bravos Performance", "top_posts": ["38,000 comments in last 28 days", "52,000 shares across platform"], "note": "Strong viral momentum"}]}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no,
    title = EXCLUDED.title,
    data_json = EXCLUDED.data_json,
    updated_at = NOW();

  -- Demographics section
  INSERT INTO public.report_sections (
    report_id,
    section_key,
    order_no,
    title,
    content_md,
    data_json
  )
  VALUES (
    v_report_id,
    'demographics',
    3,
    'Demographics',
    '',
    '{"gender": {"female": 52, "male": 46, "non_binary": 1, "not_specified": 1}, "age_pct": {"13-17": 18, "18-22": 32, "23-27": 25, "28-34": 15, "35-44": 7, "45-59": 2, "60+": 1}}'::jsonb
  )
  ON CONFLICT (report_id, section_key) DO UPDATE SET
    order_no = EXCLUDED.order_no,
    title = EXCLUDED.title,
    data_json = EXCLUDED.data_json,
    updated_at = NOW();

  RAISE NOTICE 'Seed completed successfully for Santos Bravos';
END $$;

-- Verify the data
SELECT
  r.id as report_id,
  r.title,
  a.nombre as artist,
  r.week_start,
  r.week_end,
  COUNT(rs.id) as sections_count
FROM reports r
JOIN artistas_registry a ON a.id = r.artist_id
LEFT JOIN report_sections rs ON rs.report_id = r.id
WHERE r.report_type = 'artist'
GROUP BY r.id, r.title, a.nombre, r.week_start, r.week_end
ORDER BY r.week_end DESC;
