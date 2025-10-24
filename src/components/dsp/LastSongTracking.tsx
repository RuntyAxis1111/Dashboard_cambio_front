import { AlertTriangle, Music } from 'lucide-react'
import { useLastSongTracking } from '../../hooks/useLastSongTracking'
import { formatNumber, formatDeltaWithAbs, getDeltaColor } from '../../lib/format-utils'

interface LastSongTrackingProps {
  entidadId: string
}

interface MetricCardProps {
  platform: string
  logo: string
  metrics: Array<{
    label: string
    value: number | null
    d7: number | null
    d7_pct: number | null
    d30: number | null
    d30_pct: number | null
  }>
  additionalInfo?: Array<{ label: string; value: number | null }>
}

function DeltaChip({ value, pct }: { value: number | null; pct: number | null }) {
  if (value === null && pct === null) {
    return <span className="text-[10px] text-gray-400">—</span>
  }

  const colorClass = getDeltaColor(pct !== null ? pct : value)
  const formatted = formatDeltaWithAbs(value, pct)

  return (
    <span className={`text-[10px] font-medium ${colorClass}`}>
      {formatted}
    </span>
  )
}

function MetricCard({ platform, logo, metrics, additionalInfo }: MetricCardProps) {
  const hasData = metrics.some(m => m.value !== null && m.value !== undefined)

  if (!hasData) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <img src={logo} alt={platform} className="w-5 h-5 object-contain" />
        <h4 className="font-bold text-gray-900 text-sm">{platform}</h4>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, idx) => {
          if (metric.value === null || metric.value === undefined) return null

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatNumber(metric.value)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">7d:</span>
                  <DeltaChip value={metric.d7} pct={metric.d7_pct} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">30d:</span>
                  <DeltaChip value={metric.d30} pct={metric.d30_pct} />
                </div>
              </div>
            </div>
          )
        })}

        {additionalInfo && additionalInfo.length > 0 && (
          <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
            {additionalInfo.map((info, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{info.label}</span>
                <span className="text-gray-900 font-medium">
                  {info.value !== null && info.value !== undefined ? formatNumber(info.value) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function LastSongTracking({ entidadId }: LastSongTrackingProps) {
  const { data, loading, error } = useLastSongTracking(entidadId)

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="h-80 bg-gray-100 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error al cargar datos de la canción</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900">Last Song Tracking</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">No hay datos de canciones disponibles</p>
          <p className="text-xs mt-2">Los datos serán cargados desde el backend</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp)
    return date.toLocaleString('es', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const platformMetrics = [
    {
      platform: 'Spotify',
      logo: '/assets/spotify.png',
      metrics: [
        {
          label: 'Popularity',
          value: data.sp_popularity,
          d7: data.sp_popularity_d7,
          d7_pct: data.sp_popularity_d7_pct,
          d30: data.sp_popularity_d30,
          d30_pct: data.sp_popularity_d30_pct
        },
        {
          label: 'Playlist Reach',
          value: data.sp_playlist_reach,
          d7: data.sp_playlist_reach_d7,
          d7_pct: data.sp_playlist_reach_d7_pct,
          d30: data.sp_playlist_reach_d30,
          d30_pct: data.sp_playlist_reach_d30_pct
        },
        {
          label: 'Streams',
          value: data.sp_streams,
          d7: data.sp_streams_d7,
          d7_pct: data.sp_streams_d7_pct,
          d30: data.sp_streams_d30,
          d30_pct: data.sp_streams_d30_pct
        }
      ],
      additionalInfo: [
        { label: 'Playlists', value: data.num_sp_playlists },
        { label: 'Editorial', value: data.num_sp_editorial_playlists }
      ]
    },
    {
      platform: 'YouTube',
      logo: '/assets/youtube (1).png',
      metrics: [
        {
          label: 'Views',
          value: data.youtube_views,
          d7: data.youtube_views_d7,
          d7_pct: data.youtube_views_d7_pct,
          d30: data.youtube_views_d30,
          d30_pct: data.youtube_views_d30_pct
        },
        {
          label: 'Likes',
          value: data.youtube_likes,
          d7: data.youtube_likes_d7,
          d7_pct: data.youtube_likes_d7_pct,
          d30: data.youtube_likes_d30,
          d30_pct: data.youtube_likes_d30_pct
        },
        {
          label: 'Comments',
          value: data.youtube_comments,
          d7: data.youtube_comments_d7,
          d7_pct: data.youtube_comments_d7_pct,
          d30: data.youtube_comments_d30,
          d30_pct: data.youtube_comments_d30_pct
        }
      ],
      additionalInfo: [
        { label: 'Playlists', value: data.num_yt_playlists },
        { label: 'Editorial', value: data.num_yt_editorial_playlists }
      ]
    },
    {
      platform: 'TikTok',
      logo: '/assets/tik-tok (1).png',
      metrics: [
        {
          label: 'Videos',
          value: data.tiktok_videos,
          d7: data.tiktok_videos_d7,
          d7_pct: data.tiktok_videos_d7_pct,
          d30: data.tiktok_videos_d30,
          d30_pct: data.tiktok_videos_d30_pct
        },
        {
          label: 'Top Likes',
          value: data.tiktok_top_likes,
          d7: data.tiktok_top_likes_d7,
          d7_pct: data.tiktok_top_likes_d7_pct,
          d30: data.tiktok_top_likes_d30,
          d30_pct: data.tiktok_top_likes_d30_pct
        },
        {
          label: 'Top Views',
          value: data.tiktok_top_views,
          d7: data.tiktok_top_views_d7,
          d7_pct: data.tiktok_top_views_d7_pct,
          d30: data.tiktok_top_views_d30,
          d30_pct: data.tiktok_top_views_d30_pct
        }
      ]
    },
    {
      platform: 'Shazam',
      logo: '/shazam.png',
      metrics: [
        {
          label: 'Count',
          value: data.shazam_count,
          d7: data.shazam_count_d7,
          d7_pct: data.shazam_count_d7_pct,
          d30: data.shazam_count_d30,
          d30_pct: data.shazam_count_d30_pct
        }
      ]
    },
    {
      platform: 'Deezer',
      logo: '/deezer.png',
      metrics: [
        {
          label: 'Playlist Reach',
          value: data.deezer_playlist_reach,
          d7: data.deezer_playlist_reach_d7,
          d7_pct: data.deezer_playlist_reach_d7_pct,
          d30: data.deezer_playlist_reach_d30,
          d30_pct: data.deezer_playlist_reach_d30_pct
        }
      ],
      additionalInfo: [
        { label: 'Playlists', value: data.num_de_playlists },
        { label: 'Editorial', value: data.num_de_editorial_playlists }
      ]
    },
    {
      platform: 'Pandora',
      logo: '/pandora.png',
      metrics: [
        {
          label: 'Streams',
          value: data.pandora_streams,
          d7: data.pandora_streams_d7,
          d7_pct: data.pandora_streams_d7_pct,
          d30: data.pandora_streams_d30,
          d30_pct: data.pandora_streams_d30_pct
        },
        {
          label: 'Stations',
          value: data.pandora_stations,
          d7: data.pandora_stations_d7,
          d7_pct: data.pandora_stations_d7_pct,
          d30: data.pandora_stations_d30,
          d30_pct: data.pandora_stations_d30_pct
        }
      ]
    },
    {
      platform: 'SoundCloud',
      logo: '/soundcloud-logo.png',
      metrics: [
        {
          label: 'Plays',
          value: data.soundcloud_plays,
          d7: data.soundcloud_plays_d7,
          d7_pct: data.soundcloud_plays_d7_pct,
          d30: data.soundcloud_plays_d30,
          d30_pct: data.soundcloud_plays_d30_pct
        }
      ]
    },
    {
      platform: 'Genius',
      logo: '/assets/image copy copy copy copy copy copy copy copy.png',
      metrics: [
        {
          label: 'Page Views',
          value: data.genius_views,
          d7: data.genius_views_d7,
          d7_pct: data.genius_views_d7_pct,
          d30: data.genius_views_d30,
          d30_pct: data.genius_views_d30_pct
        }
      ]
    },
    {
      platform: 'Melon',
      logo: '/assets/image copy copy copy copy copy copy copy.png',
      metrics: [
        {
          label: 'Likes',
          value: data.melon_likes,
          d7: data.melon_likes_d7,
          d7_pct: data.melon_likes_d7_pct,
          d30: data.melon_likes_d30,
          d30_pct: data.melon_likes_d30_pct
        }
      ]
    },
    {
      platform: 'AirPlay',
      logo: '/assets/image copy copy copy copy copy copy.png',
      metrics: [
        {
          label: 'Streams',
          value: data.airplay_streams,
          d7: data.airplay_streams_d7,
          d7_pct: data.airplay_streams_d7_pct,
          d30: data.airplay_streams_d30,
          d30_pct: data.airplay_streams_d30_pct
        }
      ]
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Music className="w-6 h-6 text-gray-700" />
        <h3 className="text-xl font-bold text-gray-900">Last Song Tracking</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-gray-200">
            {data.image_url ? (
              <img
                src={data.image_url}
                alt={data.name_song}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-1">{data.name_song}</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.explicit && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                    Explicit
                  </span>
                )}
                {data.track_tier !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Tier {data.track_tier}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {data.isrc && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ISRC:</span>
                  <span className="text-gray-900 font-medium">{data.isrc}</span>
                </div>
              )}
              {data.release_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Release:</span>
                  <span className="text-gray-900 font-medium">{formatDate(data.release_date)}</span>
                </div>
              )}
              {data.album_label && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Label:</span>
                  <span className="text-gray-900 font-medium">{data.album_label}</span>
                </div>
              )}
              {data.duration_ms !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900 font-medium">
                    {Math.floor(data.duration_ms / 60000)}:{String(Math.floor((data.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {data.cm_timestamp && (
              <div className="pt-3 border-t border-gray-300">
                <div className="text-xs text-gray-600 mb-1">Last Update</div>
                <div className="text-xs text-gray-900 font-medium">{formatTimestamp(data.cm_timestamp)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformMetrics.map((platform) => (
            <MetricCard
              key={platform.platform}
              platform={platform.platform}
              logo={platform.logo}
              metrics={platform.metrics}
              additionalInfo={platform.additionalInfo}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
