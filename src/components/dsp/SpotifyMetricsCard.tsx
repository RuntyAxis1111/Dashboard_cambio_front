import { ExternalLink, AlertTriangle } from 'lucide-react'
import { useDSPMetrics } from '../../hooks/useDSPMetrics'
import { formatNumber, formatDeltaWithAbs, getDeltaColor } from '../../lib/format-utils'

interface SpotifyMetricsCardProps {
  entidadId: string
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

function DeltaChip({ value, pct, label }: { value?: number | null; pct?: number | null; label: string }) {
  if ((value === null || value === undefined) && (pct === null || pct === undefined)) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs" title="A la espera de datos en Supabase">
        {label}: —
      </div>
    )
  }

  const colorClass = getDeltaColor(pct !== null && pct !== undefined ? pct : value)
  const formatted = formatDeltaWithAbs(value, pct)

  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass} bg-opacity-10`}>
      {label}: {formatted}
    </div>
  )
}

export function SpotifyMetricsCard({ entidadId }: SpotifyMetricsCardProps) {
  const { latest, series, loading, error } = useDSPMetrics(entidadId, 'spotify', 30)

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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/assets/spotify.png" alt="Spotify" className="w-8 h-8 object-contain" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Spotify</h3>
            <p className="text-xs text-gray-500">Cobertura: Spotify ({coveragePlatforms}/{totalPlatforms})</p>
          </div>
        </div>
        {followers?.value && (
          <a
            href={`https://open.spotify.com/artist/${entidadId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Abrir en Spotify"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </a>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Followers</span>
            <span className="text-3xl font-bold text-gray-900">
              {followers?.value !== null && followers?.value !== undefined ? formatNumber(followers.value) : '—'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <DeltaChip value={followers?.week_diff} pct={followers?.week_pct} label="7d" />
            <DeltaChip value={followers?.month_diff} pct={followers?.month_pct} label="30d" />
          </div>

          {followersSeries.length >= 2 && (
            <SimpleSparkline data={followersSeries} className="text-green-600" />
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Monthly Listeners</span>
            <span className="text-3xl font-bold text-gray-900">
              {listeners?.value !== null && listeners?.value !== undefined ? formatNumber(listeners.value) : '—'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <DeltaChip value={listeners?.week_diff} pct={listeners?.week_pct} label="7d" />
            <DeltaChip value={listeners?.month_diff} pct={listeners?.month_pct} label="30d" />
          </div>

          {listenersSeries.length >= 2 && (
            <SimpleSparkline data={listenersSeries} className="text-blue-600" />
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Popularity</span>
            <span className="text-3xl font-bold text-gray-900">
              {popularity?.value !== null && popularity?.value !== undefined ? popularity.value.toFixed(0) : '—'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <DeltaChip value={popularity?.week_diff} pct={popularity?.week_pct} label="7d" />
            <DeltaChip value={popularity?.month_diff} pct={popularity?.month_pct} label="30d" />
          </div>

          {popularitySeries.length >= 2 && (
            <SimpleSparkline data={popularitySeries} className="text-purple-600" />
          )}
        </div>
      </div>

    </div>
  )
}
