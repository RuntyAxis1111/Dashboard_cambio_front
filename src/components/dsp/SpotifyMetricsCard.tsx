import { ExternalLink, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useDSPMetrics } from '../../hooks/useDSPMetrics'
import { formatNumber, formatDeltaWithAbs, getDeltaColor } from '../../lib/format-utils'

interface SpotifyMetricsCardProps {
  entidadId: string
}

interface Playlist {
  id: number
  playlist_nombre: string
  pista: string
  fecha_agregado: string
  posicion: string
  posicion_maxima: number
  seguidores: string
  imagen_url: string | null
  link_url: string | null
}

function SimpleSparkline({ data, className = '' }: { data: { ts: string; value: number | null }[]; className?: string }) {
  if (data.length < 2) return <div className="h-8 w-full bg-gray-100 rounded" />

  const validData = data.filter(d => d.value !== null)
  if (validData.length < 2) return <div className="h-8 w-full bg-gray-100 rounded" />

  const values = validData.map(d => d.value!)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = validData.map((d, i) => {
    const x = (i / (validData.length - 1)) * 100
    const y = 100 - ((d.value! - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={`h-8 w-full ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

function DeltaChipStacked({ value, pct }: { value?: number | null; pct?: number | null }) {
  if ((value === null || value === undefined) && (pct === null || pct === undefined)) {
    return <span className="text-[10px] text-gray-500">—</span>
  }

  const colorClass = getDeltaColor(pct !== null && pct !== undefined ? pct : value)
  const formatted = formatDeltaWithAbs(value, pct)

  return (
    <span className={`text-[10px] font-medium ${colorClass}`}>
      {formatted}
    </span>
  )
}

function DeltaChip({ value, pct, label }: { value?: number | null; pct?: number | null; label: string }) {
  if ((value === null || value === undefined) && (pct === null || pct === undefined)) {
    return (
      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]" title="A la espera de datos en Supabase">
        {label}: —
      </div>
    )
  }

  const colorClass = getDeltaColor(pct !== null && pct !== undefined ? pct : value)
  const formatted = formatDeltaWithAbs(value, pct)

  return (
    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${colorClass} bg-opacity-10`}>
      {label}: {formatted}
    </div>
  )
}

export function SpotifyMetricsCard({ entidadId }: SpotifyMetricsCardProps) {
  const { latest, series, loading, error } = useDSPMetrics(entidadId, 'spotify', 30)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistsLoading, setPlaylistsLoading] = useState(true)

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const { data, error } = await supabase
          .from('dsp_playlists')
          .select('*')
          .eq('entidad_id', entidadId)
          .order('id', { ascending: true })

        if (error) throw error
        setPlaylists(data || [])
      } catch (err) {
        console.error('Error loading playlists:', err)
      } finally {
        setPlaylistsLoading(false)
      }
    }

    loadPlaylists()
  }, [entidadId])

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-100 rounded"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error al cargar métricas</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  const followers = latest.followers
  const listeners = latest.listeners
  const popularity = latest.popularity

  const followersSeries = series.followers || []
  const listenersSeries = series.listeners || []
  const popularitySeries = series.popularity || []

  const hasAnyData = followers || listeners || popularity

  if (!hasAnyData) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/assets/spotify.png" alt="Spotify" className="w-8 h-8 object-contain" />
          <h3 className="text-xl font-bold text-gray-900">Spotify</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">A la espera de datos en Supabase</p>
          <p className="text-xs mt-2">Los datos serán cargados por n8n desde Chartmetric</p>
        </div>
      </div>
    )
  }

  const coveragePlatforms = 1
  const totalPlatforms = 3

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/assets/spotify.png" alt="Spotify" className="w-6 h-6 object-contain" />
          <div>
            <h3 className="text-base font-bold text-gray-900">Spotify</h3>
            <p className="text-[10px] text-gray-500">Cobertura: Spotify ({coveragePlatforms}/{totalPlatforms})</p>
          </div>
        </div>
        {followers?.value && (
          <a
            href={`https://open.spotify.com/artist/${entidadId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Abrir en Spotify"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="space-y-2 w-48">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <span className="text-[10px] font-medium text-gray-600 block mb-0.5">Followers</span>
            <span className="text-xl font-bold text-gray-900 block mb-1">
              {followers?.value !== null && followers?.value !== undefined ? formatNumber(followers.value) : '—'}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">7d:</span>
                <DeltaChipStacked value={followers?.week_diff} pct={followers?.week_pct} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">30d:</span>
                <DeltaChipStacked value={followers?.month_diff} pct={followers?.month_pct} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <span className="text-[10px] font-medium text-gray-600 block mb-0.5">Monthly Listeners</span>
            <span className="text-xl font-bold text-gray-900 block mb-1">
              {listeners?.value !== null && listeners?.value !== undefined ? formatNumber(listeners.value) : '—'}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">7d:</span>
                <DeltaChipStacked value={listeners?.week_diff} pct={listeners?.week_pct} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">30d:</span>
                <DeltaChipStacked value={listeners?.month_diff} pct={listeners?.month_pct} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <span className="text-[10px] font-medium text-gray-600 block mb-0.5">Popularity</span>
            <span className="text-xl font-bold text-gray-900 block mb-1">
              {popularity?.value !== null && popularity?.value !== undefined ? popularity.value.toFixed(0) : '—'}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">7d:</span>
                <DeltaChipStacked value={popularity?.week_diff} pct={popularity?.week_pct} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">30d:</span>
                <DeltaChipStacked value={popularity?.month_diff} pct={popularity?.month_pct} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-hidden">
          {playlistsLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs text-gray-500">Cargando playlists...</span>
            </div>
          ) : playlists.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs text-gray-500">No hay playlists disponibles</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Playlist</th>
                    <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Pista</th>
                    <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Fecha</th>
                    <th className="text-center py-1.5 px-2 font-semibold text-gray-700">Posición</th>
                    <th className="text-center py-1.5 px-2 font-semibold text-gray-700">Peak</th>
                    <th className="text-right py-1.5 px-2 font-semibold text-gray-700">Seguidores</th>
                  </tr>
                </thead>
                <tbody>
                  {playlists.map((playlist) => (
                    <tr key={playlist.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          {playlist.imagen_url && (
                            <img
                              src={playlist.imagen_url}
                              alt={playlist.playlist_nombre}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            {playlist.link_url ? (
                              <a
                                href={playlist.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-900 hover:text-green-600 truncate block"
                              >
                                {playlist.playlist_nombre}
                              </a>
                            ) : (
                              <span className="font-medium text-gray-900 truncate block">
                                {playlist.playlist_nombre}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-gray-600">{playlist.pista}</td>
                      <td className="py-2 px-2 text-gray-600">
                        {new Date(playlist.fecha_agregado).toLocaleDateString('es', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                          {playlist.posicion}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-gray-900 font-medium">
                        {playlist.posicion_maxima}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-900 font-medium">
                        {playlist.seguidores}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
