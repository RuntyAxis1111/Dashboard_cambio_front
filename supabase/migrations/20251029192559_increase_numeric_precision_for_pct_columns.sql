/*
  # Increase numeric precision for percentage columns in dsp_last_song

  1. Changes
    - Alter all *_pct columns from numeric(7,3) to numeric(10,3)
    - This increases the maximum value from 9,999.999 to 9,999,999.999
    - Prevents "numeric field overflow" errors for large growth percentages
    
  2. Security
    - No changes to RLS policies
    
  3. Notes
    - This change is backward compatible
    - Existing data will remain unchanged
    - Allows for extreme growth percentages without overflow
*/

-- D7 percentage columns
ALTER TABLE dsp_last_song 
  ALTER COLUMN sp_popularity_d7_pct TYPE numeric(10,3),
  ALTER COLUMN sp_playlist_reach_d7_pct TYPE numeric(10,3),
  ALTER COLUMN sp_streams_d7_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_videos_d7_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_top_likes_d7_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_top_views_d7_pct TYPE numeric(10,3),
  ALTER COLUMN soundcloud_plays_d7_pct TYPE numeric(10,3),
  ALTER COLUMN pandora_streams_d7_pct TYPE numeric(10,3),
  ALTER COLUMN pandora_stations_d7_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_views_d7_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_likes_d7_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_comments_d7_pct TYPE numeric(10,3),
  ALTER COLUMN genius_views_d7_pct TYPE numeric(10,3),
  ALTER COLUMN shazam_count_d7_pct TYPE numeric(10,3),
  ALTER COLUMN deezer_playlist_reach_d7_pct TYPE numeric(10,3),
  ALTER COLUMN melon_likes_d7_pct TYPE numeric(10,3),
  ALTER COLUMN airplay_streams_d7_pct TYPE numeric(10,3);

-- D30 percentage columns
ALTER TABLE dsp_last_song 
  ALTER COLUMN sp_popularity_d30_pct TYPE numeric(10,3),
  ALTER COLUMN sp_playlist_reach_d30_pct TYPE numeric(10,3),
  ALTER COLUMN sp_streams_d30_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_videos_d30_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_top_likes_d30_pct TYPE numeric(10,3),
  ALTER COLUMN tiktok_top_views_d30_pct TYPE numeric(10,3),
  ALTER COLUMN soundcloud_plays_d30_pct TYPE numeric(10,3),
  ALTER COLUMN pandora_streams_d30_pct TYPE numeric(10,3),
  ALTER COLUMN pandora_stations_d30_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_views_d30_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_likes_d30_pct TYPE numeric(10,3),
  ALTER COLUMN youtube_comments_d30_pct TYPE numeric(10,3),
  ALTER COLUMN genius_views_d30_pct TYPE numeric(10,3),
  ALTER COLUMN shazam_count_d30_pct TYPE numeric(10,3),
  ALTER COLUMN deezer_playlist_reach_d30_pct TYPE numeric(10,3),
  ALTER COLUMN melon_likes_d30_pct TYPE numeric(10,3),
  ALTER COLUMN airplay_streams_d30_pct TYPE numeric(10,3);
