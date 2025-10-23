import { TrendingUp, TrendingDown, ExternalLink, Minus } from 'lucide-react'
import { DSPLatest, DSPDelta24h, DSPDelta7d, DSPTimeseries } from '../../hooks/useDSPLiveGrowth'

interface DSPCardPropsWithHook {
  dsp: string
  latest: DSPLatest | undefined
  delta24h: DSPDelta24h | undefined
  delta7d: DSPDelta7d | undefined
  timeseries: DSPTimeseries[]
  activeMetric: 'followers' | 'listeners' | 'streams'
  onMetricChange: (metric: 'followers' | 'listeners' | 'streams') => void
}

interface DSPCardPropsSimple {
  dsp: string
  followers_total: number
  monthly_listeners: number
  streams_total: number
  rank_country: string | null
  dsp_artist_url: string | null
  followers_delta_24h: number
  listeners_delta_24h: number
  streams_delta_24h: number
  followers_delta_7d: number
  listeners_delta_7d: number
  streams_delta_7d: number
}

type DSPCardProps = DSPCardPropsWithHook | DSPCardPropsSimple

function isSimpleProps(props: DSPCardProps): props is DSPCardPropsSimple {
  return 'followers_total' in props
}

const dspConfig: Record<string, { name: string; color: string; icon: string }> = {
  spotify: { name: 'Spotify', color: '#1DB954', icon: '🎵' },
  apple_music: { name: 'Apple Music', color: '#FA243C', icon: '🍎' },
  amazon_music: { name: 'Amazon Music', color: '#FF9900', icon: '🎧' }
}

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function DeltaChip({ value, label }: { value: number | null | undefined; label: string }) {
  if (value === null || value === undefined) return null

  const isPositive = value > 0
  const isNeutral = value === 0

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isNeutral
          ? 'bg-gray-100 text-gray-600'
          : isPositive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isNeutral ? (
        <Minus className="w-3 h-3" />
      ) : isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>
        {isPositive ? '+' : ''}
        {formatNumber(value)} {label}
      </span>
    </div>
  )
}

function Sparkline({ data, metric }: { data: DSPTimeseries[]; metric: 'followers' | 'listeners' | 'streams' }) {
  if (data.length === 0) return <div className="h-16 flex items-center justify-center text-xs text-gray-400">No data</div>

  const field = metric === 'followers' ? 'followers_total' : metric === 'listeners' ? 'monthly_listeners' : 'streams_total'
  const values = data.map((d) => d[field] || 0).filter((v) => v > 0)

  if (values.length === 0) return <div className="h-16 flex items-center justify-center text-xs text-gray-400">No data</div>

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function DSPCard(props: DSPCardProps) {
  if (isSimpleProps(props)) {
    return <DSPCardSimple {...props} />
  }

  const {
    dsp,
    latest,
    delta24h,
    delta7d,
    timeseries,
    activeMetric,
    onMetricChange
  } = props

  const config = dspConfig[dsp] || { name: dsp, color: '#666', icon: '🎵' }

  const currentValue =
    activeMetric === 'followers'
      ? latest?.followers_total
      : activeMetric === 'listeners'
      ? latest?.monthly_listeners
      : latest?.streams_total

  const delta24hValue =
    activeMetric === 'followers'
      ? delta24h?.followers_delta_24h
      : activeMetric === 'listeners'
      ? delta24h?.listeners_delta_24h
      : delta24h?.streams_delta_24h

  const delta7dValue =
    activeMetric === 'followers'
      ? delta7d?.followers_delta_7d
      : activeMetric === 'listeners'
      ? delta7d?.listeners_delta_7d
      : delta7d?.streams_delta_7d

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="font-semibold text-gray-900">{config.name}</h3>
        </div>
        {latest?.dsp_artist_url && (
          <a
            href={latest.dsp_artist_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onMetricChange('followers')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            activeMetric === 'followers'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => onMetricChange('listeners')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            activeMetric === 'listeners'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Listeners
        </button>
        <button
          onClick={() => onMetricChange('streams')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            activeMetric === 'streams'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Streams
        </button>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(currentValue)}</div>
        <div className="flex flex-wrap gap-2">
          <DeltaChip value={delta24hValue} label="24h" />
          <DeltaChip value={delta7dValue} label="7d" />
        </div>
      </div>

      <div className="text-gray-400" style={{ color: config.color }}>
        <Sparkline data={timeseries} metric={activeMetric} />
      </div>

      {latest?.rank_country && (
        <div className="mt-3 text-xs text-gray-500">
          Rank: {latest.rank_country}
        </div>
      )}
    </div>
  )
}

function DSPCardSimple({
  dsp,
  followers_total,
  monthly_listeners,
  streams_total,
  rank_country,
  dsp_artist_url,
  followers_delta_24h,
  listeners_delta_24h,
  streams_delta_24h,
  followers_delta_7d,
  listeners_delta_7d,
  streams_delta_7d
}: DSPCardPropsSimple) {
  const config = dspConfig[dsp] || { name: dsp, color: '#666', icon: '🎵' }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${config.color}15` }}
          >
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
        </div>
        {dsp_artist_url && (
          <a
            href={dsp_artist_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-600 mb-2">Followers</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatNumber(followers_total)}
          </div>
          <div className="flex gap-2">
            <DeltaChip value={followers_delta_24h} label="24h" />
            <DeltaChip value={followers_delta_7d} label="7d" />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Monthly Listeners</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatNumber(monthly_listeners)}
          </div>
          <div className="flex gap-2">
            <DeltaChip value={listeners_delta_24h} label="24h" />
            <DeltaChip value={listeners_delta_7d} label="7d" />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Total Streams</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatNumber(streams_total)}
          </div>
          <div className="flex gap-2">
            <DeltaChip value={streams_delta_24h} label="24h" />
            <DeltaChip value={streams_delta_7d} label="7d" />
          </div>
        </div>
      </div>

      {rank_country && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">Country Rank</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">{rank_country}</div>
        </div>
      )}
    </div>
  )
}
