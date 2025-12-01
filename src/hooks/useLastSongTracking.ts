import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface LastSongData {
  last_song_id: string
  entidad_id: string
  dsp_status_id: number
  name_song: string
  image_url: string | null
  isrc: string | null
  release_date: string | null
  album_label: string | null
  explicit: boolean
  track_tier: number | null
  duration_ms: number | null
  cm_timestamp: string | null

  sp_popularity: number | null
  sp_playlist_reach: number | null
  sp_streams: number | null
  tiktok_videos: number | null
  tiktok_top_likes: number | null
  tiktok_top_views: number | null
  soundcloud_plays: number | null
  pandora_streams: number | null
  pandora_stations: number | null
  youtube_views: number | null
  youtube_likes: number | null
  youtube_comments: number | null
  genius_views: number | null
  shazam_count: number | null
  deezer_playlist_reach: number | null
  melon_likes: number | null
  airplay_streams: number | null

  num_sp_playlists: number | null
  num_sp_editorial_playlists: number | null
  num_am_playlists: number | null
  num_am_editorial_playlists: number | null
  num_yt_playlists: number | null
  num_yt_editorial_playlists: number | null
  num_de_playlists: number | null
  num_de_editorial_playlists: number | null

  sp_popularity_d7: number | null
  sp_popularity_d7_pct: number | null
  sp_playlist_reach_d7: number | null
  sp_playlist_reach_d7_pct: number | null
  sp_streams_d7: number | null
  sp_streams_d7_pct: number | null
  tiktok_videos_d7: number | null
  tiktok_videos_d7_pct: number | null
  tiktok_top_likes_d7: number | null
  tiktok_top_likes_d7_pct: number | null
  tiktok_top_views_d7: number | null
  tiktok_top_views_d7_pct: number | null
  soundcloud_plays_d7: number | null
  soundcloud_plays_d7_pct: number | null
  pandora_streams_d7: number | null
  pandora_streams_d7_pct: number | null
  pandora_stations_d7: number | null
  pandora_stations_d7_pct: number | null
  youtube_views_d7: number | null
  youtube_views_d7_pct: number | null
  youtube_likes_d7: number | null
  youtube_likes_d7_pct: number | null
  youtube_comments_d7: number | null
  youtube_comments_d7_pct: number | null
  genius_views_d7: number | null
  genius_views_d7_pct: number | null
  shazam_count_d7: number | null
  shazam_count_d7_pct: number | null
  deezer_playlist_reach_d7: number | null
  deezer_playlist_reach_d7_pct: number | null
  melon_likes_d7: number | null
  melon_likes_d7_pct: number | null
  airplay_streams_d7: number | null
  airplay_streams_d7_pct: number | null

  sp_popularity_d30: number | null
  sp_popularity_d30_pct: number | null
  sp_playlist_reach_d30: number | null
  sp_playlist_reach_d30_pct: number | null
  sp_streams_d30: number | null
  sp_streams_d30_pct: number | null
  tiktok_videos_d30: number | null
  tiktok_videos_d30_pct: number | null
  tiktok_top_likes_d30: number | null
  tiktok_top_likes_d30_pct: number | null
  tiktok_top_views_d30: number | null
  tiktok_top_views_d30_pct: number | null
  soundcloud_plays_d30: number | null
  soundcloud_plays_d30_pct: number | null
  pandora_streams_d30: number | null
  pandora_streams_d30_pct: number | null
  pandora_stations_d30: number | null
  pandora_stations_d30_pct: number | null
  youtube_views_d30: number | null
  youtube_views_d30_pct: number | null
  youtube_likes_d30: number | null
  youtube_likes_d30_pct: number | null
  youtube_comments_d30: number | null
  youtube_comments_d30_pct: number | null
  genius_views_d30: number | null
  genius_views_d30_pct: number | null
  shazam_count_d30: number | null
  shazam_count_d30_pct: number | null
  deezer_playlist_reach_d30: number | null
  deezer_playlist_reach_d30_pct: number | null
  melon_likes_d30: number | null
  melon_likes_d30_pct: number | null
  airplay_streams_d30: number | null
  airplay_streams_d30_pct: number | null

  created_at: string
  updated_at: string
}

export function useLastSongTracking(entidadId: string) {
  const [data, setData] = useState<LastSongData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLastSongs() {
      try {
        setLoading(true)
        setError(null)

        const { data: songData, error: songError } = await supabase
          .from('dsp_last_song')
          .select('*')
          .eq('entidad_id', entidadId)
          .order('dsp_status_id', { ascending: true })

        if (songError) throw songError

        setData(songData || [])
      } catch (err) {
        console.error('Error loading last songs:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (entidadId) {
      loadLastSongs()
    }
  }, [entidadId])

  return { data, loading, error }
}
