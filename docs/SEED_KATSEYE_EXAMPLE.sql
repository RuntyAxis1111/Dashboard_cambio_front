-- Seed data for KATSEYE weekly report (10/6 - 10/13/25)
-- Based on PDF example provided

-- Get the entity ID (assuming it's SANTOS BRAVOS, adjust if needed)
DO $$
DECLARE
  v_entidad_id UUID;
BEGIN
  SELECT id INTO v_entidad_id FROM reportes_entidades WHERE slug = 'santos-bravos';

  -- Delete existing items for this entity to start fresh
  DELETE FROM reportes_items WHERE entidad_id = v_entidad_id;

  -- Insert Highlights data
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, plataforma, posicion)
  VALUES
    (v_entidad_id, 'highlights', 'highlight', '33,085,399 Spotify Monthly Listeners as of today', '', 1),
    (v_entidad_id, 'highlights', 'highlight', '10/9 - Google Gemini Short-form 2 released on KE socials', '', 2),
    (v_entidad_id, 'highlights', 'highlight', '10/7 - The Grove Pandora Pop-up Launch Event', '', 3),
    (v_entidad_id, 'highlights', 'highlight', '10/7 - Google Gemini Short-form released on KE socials', '', 4),
    (v_entidad_id, 'highlights', 'highlight', '10/8 - 5Gum video on IGS', '', 5),
    (v_entidad_id, 'highlights', 'highlight', '10/6 - "Gameboy" surpasses 100M streams on Spotify', '', 6);

  -- Insert MV Totals data
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, valor, plataforma, posicion)
  VALUES
    (v_entidad_id, 'mv_totales', 'mv_total_views', 'KATSEYE (캣츠아이) "Gnarly" Official MV', 105751523, 'youtube', 1),
    (v_entidad_id, 'mv_totales', 'mv_total_views', 'KATSEYE (캣츠아이) "Gabriela" Official MV', 49661160, 'youtube', 2),
    (v_entidad_id, 'mv_totales', 'mv_total_views', 'KATSEYE (캣츠아이) "Gameboy" Official MV', 55215833, 'youtube', 3),
    (v_entidad_id, 'mv_totales', 'mv_total_views', 'Gnarly (Ice Spice Remix) | KATSEYE', 3500080, 'youtube', 4),
    (v_entidad_id, 'mv_totales', 'mv_total_views', 'Gnarly (Lara x Lancey Foux x Slush Puppy Remix)', 569965, 'youtube', 5),
    (v_entidad_id, 'mv_totales', 'mv_total_views', '"Gabriela" (Young Miko Remix) | KATSEYE', 4148743, 'youtube', 6);

  -- Insert Spotify Streams data (as part of mv_totales section)
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, valor, plataforma, posicion)
  VALUES
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Gnarly', 298728742, 'spotify', 7),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Gnarly (Ice Spice Remix)', 23429681, 'spotify', 8),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Gnarly (with Young Miko)', 13985725, 'spotify', 9),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Gabriela', 321865582, 'spotify', 10),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Gameboy', 106290926, 'spotify', 11),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'M.I.A', 54199220, 'spotify', 12),
    (v_entidad_id, 'mv_totales', 'spotify_streams', 'Mean Girls', 34869430, 'spotify', 13);

  -- Insert Spotify Insights (empty for now, will be populated later)
  -- This section exists but no data in the PDF

  -- Insert PR/Press data
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, url, plataforma, posicion)
  VALUES
    (v_entidad_id, 'pr_press', 'pr_us', 'Hot Off Sultry ''Gabriela'' Video, KATSEYE Want to ''Stimulate Your Senses'' With New 5 Gum Flavors', 'https://example.com/article1', '', 1),
    (v_entidad_id, 'pr_press', 'pr_us', 'Breaking Down All of KATSEYE''s Favorite Eyeliners | Teen Vogue', 'https://example.com/article2', '', 2),
    (v_entidad_id, 'pr_press', 'pr_us', 'Forget Bath Water — KATSEYE Is Bottling Their Breath Instead', 'https://example.com/article3', '', 3),
    (v_entidad_id, 'pr_press', 'pr_kr', '캣츠아이, 빌보드 ''핫100'' 역주행 ing', NULL, '', 4),
    (v_entidad_id, 'pr_press', 'pr_kr', '''케데헌'' 8곡, 13주 연속 ''핫100'' 동시 차트인…캣츠아이 2곡 또 동시진입', NULL, '', 5);

  -- Insert Weekly Content Recap
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, contexto, plataforma, posicion)
  VALUES
    (v_entidad_id, 'weekly_content', 'weekly_recap', 'Similarly to the previous collab, fans across socials are not supportive of this collaboration. Comments are asking the marketing team not to participate in AI related collaborations and request that HYBE x Geffen participate in more meaningful collaborations moving forward', 'Google Gemini Collab Sentiment', '', 1),
    (v_entidad_id, 'weekly_content', 'weekly_recap', 'Fans posted KATSEYE''s appearance at the Grove on socials, and EYEKONS + the public comment on the members'' "stunning visuals" at the event. Fans particularly loved Manon''s styling and hair at this appearance.', 'KATSEYE at the Grove - Pandora Pop up', '', 2);

  -- Insert Top 5 Posts
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, valor, url, plataforma, posicion)
  VALUES
    -- Instagram
    (v_entidad_id, 'top_posts', 'top_ig', 'pababa ng pababa 🖤', 16000000, 'https://instagram.com/p/example1', 'instagram', 1),
    (v_entidad_id, 'top_posts', 'top_ig', 'my body is sayin'' 🖤 @summerwalker', 8000000, 'https://instagram.com/p/example2', 'instagram', 2),
    (v_entidad_id, 'top_posts', 'top_ig', 'special edition, only found at the BEAUTIFUL CHAOS Tour', 7000000, 'https://instagram.com/p/example3', 'instagram', 3),
    (v_entidad_id, 'top_posts', 'top_ig', 'can''t stop starin'' at those ocean eyes 💙', 6000000, 'https://instagram.com/p/example4', 'instagram', 4),
    (v_entidad_id, 'top_posts', 'top_ig', 'combining our fave pics of each other into gnarly selfies with @googlegemini', 4000000, 'https://instagram.com/p/example5', 'instagram', 5),
    -- TikTok
    (v_entidad_id, 'top_posts', 'top_tt', 'pababa ng pababa 🖤', 9000000, 'https://tiktok.com/@example/video1', 'tiktok', 1),
    (v_entidad_id, 'top_posts', 'top_tt', 'special edition, only found at the BEAUTIFUL CHAOS Tour', 9000000, 'https://tiktok.com/@example/video2', 'tiktok', 2),
    (v_entidad_id, 'top_posts', 'top_tt', 'can''t stop starin'' at those ocean eyes 💙', 5000000, 'https://tiktok.com/@example/video3', 'tiktok', 3),
    (v_entidad_id, 'top_posts', 'top_tt', 'my body is sayin'' 🖤 @Summer Walker', 5000000, 'https://tiktok.com/@example/video4', 'tiktok', 4),
    (v_entidad_id, 'top_posts', 'top_tt', 'our favorite pastime', 4000000, 'https://tiktok.com/@example/video5', 'tiktok', 5),
    -- YouTube Shorts
    (v_entidad_id, 'top_posts', 'top_yt', 'EYEKONS, we''re counting down the days!! 🖤', 8000000, 'https://youtube.com/shorts/example1', 'youtube', 1),
    (v_entidad_id, 'top_posts', 'top_yt', 'special edition, only found at the BEAUTIFUL CHAOS Tour', 7000000, 'https://youtube.com/shorts/example2', 'youtube', 2),
    (v_entidad_id, 'top_posts', 'top_yt', 'can''t stop starin'' at those ocean eyes 💙', 7000000, 'https://youtube.com/shorts/example3', 'youtube', 3),
    (v_entidad_id, 'top_posts', 'top_yt', 'pababa ng pababa 🖤', 4000000, 'https://youtube.com/shorts/example4', 'youtube', 4),
    (v_entidad_id, 'top_posts', 'top_yt', 'my body is sayin'' 🖤 @Summer Walker', 1000000, 'https://youtube.com/shorts/example5', 'youtube', 5);

  -- Insert Fan Sentiment data
  INSERT INTO reportes_items (entidad_id, seccion_clave, categoria, texto, contexto, plataforma, posicion)
  VALUES
    (v_entidad_id, 'fan_sentiment', 'fan_sentiment', 'Very positive (collaboration + performance).', 'Overall tone', '', 1),
    (v_entidad_id, 'fan_sentiment', 'fan_sentiment', 'Surface key themes for editors.', 'Why it matters', '', 2);

  RAISE NOTICE 'Successfully seeded data for entity: %', v_entidad_id;
END $$;
