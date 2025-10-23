import { Music, TrendingUp, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface TrackData {
  track_id: string
  track_name: string
  album_name: string | null
  release_date: string | null
  cover_art_url: string | null
  total_streams_all_dsp: number
  last_updated: string
  dsp_breakdown: {
    spotify?: {
      streams_total: number
      streams_daily: number | null
      rank_country: number | null
      rank_global: number | null
      playlist_count: number | null
    }
    apple_music?: {
      streams_total: number
      streams_daily: number | null
      rank_country: number | null
      rank_global: number | null
      playlist_count: number | null
    }
    amazon_music?: {
      streams_total: number
      streams_daily: number | null
      rank_country: number | null
      rank_global: number | null
      playlist_count: number | null
    }
  }
}

interface TrackPerformanceSectionProps {
  entityId: string
}

export function TrackPerformanceSection({ entityId }: TrackPerformanceSectionProps) {
  const [tracks, setTracks] = useState<TrackData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('v_tracks_performance')
          .select('*')
          .eq('entity_id', entityId)
          .order('total_streams_all_dsp', { ascending: false })

        if (fetchError) throw fetchError

        setTracks(data || [])
      } catch (err) {
        console.error('Error fetching tracks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load tracks')
      } finally {
        setLoading(false)
      }
    }

    if (entityId) {
      fetchTracks()
    }
  }, [entityId])

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '-'
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getDSPColor = (dsp: string): string => {
    switch (dsp) {
      case 'spotify': return 'bg-green-100 text-green-700'
      case 'apple_music': return 'bg-red-100 text-red-700'
      case 'amazon_music': return 'bg-cyan-100 text-cyan-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDSPLogo = (dsp: string): string => {
    switch (dsp) {
      case 'spotify': return '/assets/spotify.png'
      case 'apple_music': return '/assets/applemusicicon.png'
      case 'amazon_music': return '/assets/amazonmusiciconnew.png'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
        <div className="animate-pulse">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading tracks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
        <Music className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tracks</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
        <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks available</h3>
        <p className="text-gray-600">Track data will appear here once n8n starts collecting metrics</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => {
        const totalStreams = track.total_streams_all_dsp
        const totalPlaylists = Object.values(track.dsp_breakdown).reduce(
          (sum, dsp) => sum + (dsp.playlist_count || 0),
          0
        )
        const activePlatforms = Object.keys(track.dsp_breakdown).length

        return (
          <div key={track.track_id} className="space-y-4">
            {/* Track Totals Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-gray-900">TOTALS</span>
                <div className="flex items-center gap-1">
                  <img src="/assets/spotify.png" alt="Spotify" className="w-5 h-5 object-contain" />
                  <span className="text-gray-400">+</span>
                  <img src="/assets/applemusicicon.png" alt="Apple Music" className="w-5 h-5 object-contain" />
                  <span className="text-gray-400">+</span>
                  <img src="/assets/amazonmusiciconnew.png" alt="Amazon Music" className="w-5 h-5 object-contain" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Total Streams</div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(totalStreams)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Total Playlists</div>
                  <div className="text-xl font-bold text-gray-900">{totalPlaylists}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Active Platforms</div>
                  <div className="text-xl font-bold text-gray-900">{activePlatforms}</div>
                </div>
              </div>
            </div>

            {/* Track Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-6">
                {/* Album Cover */}
                <div className="flex-shrink-0">
                  {track.cover_art_url ? (
                    <img
                      src={track.cover_art_url}
                      alt={track.track_name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Music className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{track.track_name}</h3>
                      {track.album_name && (
                        <p className="text-sm text-gray-600 mb-2">{track.album_name}</p>
                      )}
                      {track.release_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Released {formatDate(track.release_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DSP Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(track.dsp_breakdown).map(([dsp, data]) => {
                      const logo = getDSPLogo(dsp)

                      return (
                        <div
                          key={dsp}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-2 ${getDSPColor(dsp)}`}>
                            {logo && (
                              <img
                                src={logo}
                                alt={dsp}
                                className="w-4 h-4 object-contain"
                              />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Streams:</span>
                              <span className="font-semibold text-gray-900">
                                {formatNumber(data.streams_total)}
                              </span>
                            </div>
                            {data.streams_daily !== null && data.streams_daily !== undefined && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Daily:</span>
                                <span className="text-gray-700">
                                  +{formatNumber(data.streams_daily)}
                                </span>
                              </div>
                            )}
                            {data.rank_country !== null && data.rank_country !== undefined && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Country Rank:</span>
                                <span className="text-gray-700">#{data.rank_country}</span>
                              </div>
                            )}
                            {data.playlist_count !== null && data.playlist_count !== undefined && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Playlists:</span>
                                <span className="text-gray-700">{data.playlist_count}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
