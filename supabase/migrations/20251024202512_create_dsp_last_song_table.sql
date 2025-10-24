/*
  # Create DSP Last Song Table
  
  This table stores comprehensive track-level metrics for an artist's most recent or featured song,
  including streaming data, social media engagement, playlist reach, and delta calculations over 7 and 30 days.

  ## 1. New Tables
    - `dsp_last_song`
      - `last_song_id` (uuid, primary key) - Unique identifier for each song record
      - `entidad_id` (uuid, foreign key) - Reference to reportes_entidades
      - `dsp_status_id` (integer, foreign key) - Reference to dsp_status table
      
      ### Basic Song Information
      - `name_song` (text) - Song title
      - `image_url` (text) - Album/track artwork URL
      - `isrc` (text) - International Standard Recording Code
      - `release_date` (date) - Official release date
      - `album_label` (text) - Record label name
      - `explicit` (boolean) - Explicit content flag
      - `track_tier` (smallint) - Track tier/priority classification
      - `duration_ms` (integer) - Track duration in milliseconds
      - `cm_timestamp` (timestamptz) - Chartmetric statistics timestamp
      
      ### Current Snapshot Values
      - `sp_popularity` (integer) - Spotify popularity score (0-100)
      - `sp_playlist_reach` (bigint) - Spotify total playlist reach
      - `sp_streams` (bigint) - Spotify stream count
      - `tiktok_videos` (bigint) - Number of TikTok videos using this track
      - `tiktok_top_likes` (bigint) - Likes on top TikTok video
      - `tiktok_top_views` (bigint) - Views on top TikTok video
      - `soundcloud_plays` (bigint) - SoundCloud playback count
      - `pandora_streams` (bigint) - Pandora lifetime streams
      - `pandora_stations` (integer) - Pandora lifetime stations added
      - `youtube_views` (bigint) - YouTube view count
      - `youtube_likes` (bigint) - YouTube like count
      - `youtube_comments` (bigint) - YouTube comment count
      - `genius_views` (bigint) - Genius.com page views
      - `shazam_count` (bigint) - Shazam recognition count
      - `deezer_playlist_reach` (bigint) - Deezer total playlist reach
      - `melon_likes` (integer) - Melon (Korean platform) likes
      - `airplay_streams` (bigint) - Radio airplay stream count
      
      ### Playlist Counts by Platform
      - `num_sp_playlists` (integer) - Number of Spotify playlists
      - `num_sp_editorial_playlists` (integer) - Number of Spotify editorial playlists
      - `num_am_playlists` (integer) - Number of Apple Music playlists
      - `num_am_editorial_playlists` (integer) - Number of Apple Music editorial playlists
      - `num_yt_playlists` (integer) - Number of YouTube playlists
      - `num_yt_editorial_playlists` (integer) - Number of YouTube editorial playlists
      - `num_de_playlists` (integer) - Number of Deezer playlists
      - `num_de_editorial_playlists` (integer) - Number of Deezer editorial playlists
      
      ### 7-Day Deltas (Absolute and Percentage)
      - All snapshot metrics have corresponding `_d7` and `_d7_pct` fields
      - Percentage changes stored as numeric(7,3) for precision
      
      ### 30-Day Deltas (Absolute and Percentage)
      - All snapshot metrics have corresponding `_d30` and `_d30_pct` fields
      - Percentage changes stored as numeric(7,3) for precision
      
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Indexes
    - Primary key index on `last_song_id`
    - Foreign key index on `entidad_id` for joins
    - Foreign key index on `dsp_status_id` for joins
    - Index on `isrc` for lookups by recording code
    - Index on `release_date` for date-based queries
    - Index on `cm_timestamp` for time-series analysis

  ## 3. Security (RLS)
    - Enable RLS on `dsp_last_song` table
    - Authenticated users can SELECT all records
    - Authenticated users can INSERT new records
    - Authenticated users can UPDATE existing records
    - Authenticated users can DELETE records

  ## 4. Triggers
    - Auto-update `updated_at` timestamp on record modification

  ## 5. Notes
    - This table is designed to store the "latest" or "featured" song for each artist
    - Backend should upsert based on (entidad_id, isrc) to avoid duplicates
    - Delta calculations are pre-computed for frontend performance
    - All bigint fields support large streaming/view counts (up to 9 quintillion)
*/

-- Create the dsp_last_song table
CREATE TABLE IF NOT EXISTS dsp_last_song (
  last_song_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id            uuid NOT NULL REFERENCES reportes_entidades(id) ON DELETE CASCADE,
  dsp_status_id         integer NOT NULL REFERENCES dsp_status(id) ON DELETE CASCADE,
  
  -- Basic song information
  name_song             text NOT NULL,
  image_url             text,
  isrc                  text,
  release_date          date,
  album_label           text,
  explicit              boolean DEFAULT false,
  track_tier            smallint,
  duration_ms           integer,
  cm_timestamp          timestamptz,

  -- SNAPSHOT (current values)
  sp_popularity         integer,
  sp_playlist_reach     bigint,
  sp_streams            bigint,
  tiktok_videos         bigint,
  tiktok_top_likes      bigint,
  tiktok_top_views      bigint,
  soundcloud_plays      bigint,
  pandora_streams       bigint,
  pandora_stations      integer,
  youtube_views         bigint,
  youtube_likes         bigint,
  youtube_comments      bigint,
  genius_views          bigint,
  shazam_count          bigint,
  deezer_playlist_reach bigint,
  melon_likes           integer,
  airplay_streams       bigint,

  -- Playlist counts by platform
  num_sp_playlists          integer,
  num_sp_editorial_playlists integer,
  num_am_playlists          integer,
  num_am_editorial_playlists integer,
  num_yt_playlists          integer,
  num_yt_editorial_playlists integer,
  num_de_playlists          integer,
  num_de_editorial_playlists integer,

  -- DELTAS 7 days (absolute and percentage)
  sp_popularity_d7           integer,
  sp_popularity_d7_pct       numeric(7,3),
  sp_playlist_reach_d7       bigint,
  sp_playlist_reach_d7_pct   numeric(7,3),
  sp_streams_d7              bigint,
  sp_streams_d7_pct          numeric(7,3),
  
  tiktok_videos_d7           bigint,
  tiktok_videos_d7_pct       numeric(7,3),
  tiktok_top_likes_d7        bigint,
  tiktok_top_likes_d7_pct    numeric(7,3),
  tiktok_top_views_d7        bigint,
  tiktok_top_views_d7_pct    numeric(7,3),
  
  soundcloud_plays_d7        bigint,
  soundcloud_plays_d7_pct    numeric(7,3),
  
  pandora_streams_d7         bigint,
  pandora_streams_d7_pct     numeric(7,3),
  pandora_stations_d7        integer,
  pandora_stations_d7_pct    numeric(7,3),
  
  youtube_views_d7           bigint,
  youtube_views_d7_pct       numeric(7,3),
  youtube_likes_d7           bigint,
  youtube_likes_d7_pct       numeric(7,3),
  youtube_comments_d7        bigint,
  youtube_comments_d7_pct    numeric(7,3),
  
  genius_views_d7            bigint,
  genius_views_d7_pct        numeric(7,3),
  shazam_count_d7            bigint,
  shazam_count_d7_pct        numeric(7,3),
  deezer_playlist_reach_d7   bigint,
  deezer_playlist_reach_d7_pct numeric(7,3),
  melon_likes_d7             integer,
  melon_likes_d7_pct         numeric(7,3),
  airplay_streams_d7         bigint,
  airplay_streams_d7_pct     numeric(7,3),

  -- DELTAS 30 days (absolute and percentage)
  sp_popularity_d30          integer,
  sp_popularity_d30_pct      numeric(7,3),
  sp_playlist_reach_d30      bigint,
  sp_playlist_reach_d30_pct  numeric(7,3),
  sp_streams_d30             bigint,
  sp_streams_d30_pct         numeric(7,3),
  
  tiktok_videos_d30          bigint,
  tiktok_videos_d30_pct      numeric(7,3),
  tiktok_top_likes_d30       bigint,
  tiktok_top_likes_d30_pct   numeric(7,3),
  tiktok_top_views_d30       bigint,
  tiktok_top_views_d30_pct   numeric(7,3),
  
  soundcloud_plays_d30       bigint,
  soundcloud_plays_d30_pct   numeric(7,3),
  
  pandora_streams_d30        bigint,
  pandora_streams_d30_pct    numeric(7,3),
  pandora_stations_d30       integer,
  pandora_stations_d30_pct   numeric(7,3),
  
  youtube_views_d30          bigint,
  youtube_views_d30_pct      numeric(7,3),
  youtube_likes_d30          bigint,
  youtube_likes_d30_pct      numeric(7,3),
  youtube_comments_d30       bigint,
  youtube_comments_d30_pct   numeric(7,3),
  
  genius_views_d30           bigint,
  genius_views_d30_pct       numeric(7,3),
  shazam_count_d30           bigint,
  shazam_count_d30_pct       numeric(7,3),
  deezer_playlist_reach_d30  bigint,
  deezer_playlist_reach_d30_pct numeric(7,3),
  melon_likes_d30            integer,
  melon_likes_d30_pct        numeric(7,3),
  airplay_streams_d30        bigint,
  airplay_streams_d30_pct    numeric(7,3),

  created_at                 timestamptz DEFAULT now(),
  updated_at                 timestamptz DEFAULT now()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS dsp_last_song_entidad_id_idx ON dsp_last_song(entidad_id);
CREATE INDEX IF NOT EXISTS dsp_last_song_dsp_status_id_idx ON dsp_last_song(dsp_status_id);
CREATE INDEX IF NOT EXISTS dsp_last_song_isrc_idx ON dsp_last_song(isrc);
CREATE INDEX IF NOT EXISTS dsp_last_song_release_date_idx ON dsp_last_song(release_date);
CREATE INDEX IF NOT EXISTS dsp_last_song_cm_timestamp_idx ON dsp_last_song(cm_timestamp);

-- Create unique constraint to prevent duplicate songs per artist
-- Assuming each artist should only have one "last song" tracked at a time
CREATE UNIQUE INDEX IF NOT EXISTS dsp_last_song_entidad_unique ON dsp_last_song(entidad_id);

-- Enable RLS
ALTER TABLE dsp_last_song ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Authenticated users can read last song data"
  ON dsp_last_song
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert last song data"
  ON dsp_last_song
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update last song data"
  ON dsp_last_song
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete last song data"
  ON dsp_last_song
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dsp_last_song_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updates
DROP TRIGGER IF EXISTS update_dsp_last_song_updated_at_trigger ON dsp_last_song;
CREATE TRIGGER update_dsp_last_song_updated_at_trigger
  BEFORE UPDATE ON dsp_last_song
  FOR EACH ROW
  EXECUTE FUNCTION update_dsp_last_song_updated_at();
