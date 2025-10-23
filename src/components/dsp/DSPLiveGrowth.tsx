import { useState, useMemo } from 'react'
import { Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { useDSPLiveGrowth } from '../../hooks/useDSPLiveGrowth'
import { DSPCard } from './DSPCard'

interface DSPLiveGrowthProps {
  entityId: string | undefined
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never'
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function DSPLiveGrowth({ entityId }: DSPLiveGrowthProps) {
  const [selectedDsps, setSelectedDsps] = useState<string[]>(['spotify', 'apple_music', 'amazon_music'])
  const [daysRange, setDaysRange] = useState(7)
  const [activeMetrics, setActiveMetrics] = useState<Record<string, 'followers' | 'listeners' | 'streams'>>({
    spotify: 'listeners',
    apple_music: 'listeners',
    amazon_music: 'listeners'
  })
  const [showHighlights, setShowHighlights] = useState(false)

  const { latest, delta24h, delta7d, timeseries, loading, lastUpdate } = useDSPLiveGrowth(
    entityId,
    selectedDsps,
    daysRange
  )

  const highlights = useMemo(() => {
    if (delta24h.length === 0 && delta7d.length === 0) return null

    const maxFollowersDelta24h = delta24h.reduce((max, curr) => {
      const value = curr.followers_delta_24h || 0
      return value > (max.value || 0) ? { dsp: curr.dsp, value } : max
    }, { dsp: '', value: 0 })

    const maxListenersDelta7d = delta7d.reduce((max, curr) => {
      const value = curr.listeners_delta_7d || 0
      return value > (max.value || 0) ? { dsp: curr.dsp, value } : max
    }, { dsp: '', value: 0 })

    const maxStreamsDelta7d = delta7d.reduce((max, curr) => {
      const value = curr.streams_delta_7d || 0
      return value > (max.value || 0) ? { dsp: curr.dsp, value } : max
    }, { dsp: '', value: 0 })

    return {
      maxFollowersDelta24h,
      maxListenersDelta7d,
      maxStreamsDelta7d
    }
  }, [delta24h, delta7d])

  const shareData = useMemo(() => {
    if (latest.length === 0) return []
    return latest
      .filter((l) => l.followers_total !== null)
      .map((l) => ({
        dsp: l.dsp,
        value: l.followers_total || 0
      }))
  }, [latest])

  const totalFollowers = shareData.reduce((sum, d) => sum + d.value, 0)

  if (!entityId) return null

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl p-5 animate-pulse h-64"></div>
          ))}
        </div>
      </div>
    )
  }

  if (latest.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DSP LIVE GROWTH</h2>
            <p className="text-sm text-gray-500">Actualizado cada 15 min · Fuente: Chartmetric (cargado vía n8n)</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No DSP data yet</h3>
          <p className="text-gray-600">DSP metrics will appear here once n8n starts collecting data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DSP LIVE GROWTH</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Actualizado cada 15 min · Fuente: Chartmetric (cargado vía n8n)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Última actualización:</span>{' '}
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
              {formatRelativeTime(lastUpdate)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">DSP:</span>
          {['spotify', 'apple_music', 'amazon_music'].map((dsp) => (
            <button
              key={dsp}
              onClick={() => {
                setSelectedDsps((prev) =>
                  prev.includes(dsp) ? prev.filter((d) => d !== dsp) : [...prev, dsp]
                )
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedDsps.includes(dsp)
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dsp === 'spotify' ? 'Spotify' : dsp === 'apple_music' ? 'Apple Music' : 'Amazon Music'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Range:</span>
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setDaysRange(days)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                daysRange === days
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {highlights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {highlights.maxFollowersDelta24h.value > 0 && (
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className="bg-green-50 border border-green-200 rounded-xl p-4 text-left hover:bg-green-100 transition-colors"
            >
              <div className="text-xs text-green-600 font-medium mb-1">Mayor Δ24h (followers)</div>
              <div className="text-2xl font-bold text-green-700">
                +{formatNumber(highlights.maxFollowersDelta24h.value)}
              </div>
              <div className="text-xs text-green-600 mt-1 capitalize">{highlights.maxFollowersDelta24h.dsp.replace('_', ' ')}</div>
            </button>
          )}
          {highlights.maxListenersDelta7d.value > 0 && (
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left hover:bg-blue-100 transition-colors"
            >
              <div className="text-xs text-blue-600 font-medium mb-1">Mayor Δ7d (listeners)</div>
              <div className="text-2xl font-bold text-blue-700">
                +{formatNumber(highlights.maxListenersDelta7d.value)}
              </div>
              <div className="text-xs text-blue-600 mt-1 capitalize">{highlights.maxListenersDelta7d.dsp.replace('_', ' ')}</div>
            </button>
          )}
          {highlights.maxStreamsDelta7d.value > 0 && (
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-left hover:bg-purple-100 transition-colors"
            >
              <div className="text-xs text-purple-600 font-medium mb-1">Top streams 7d</div>
              <div className="text-2xl font-bold text-purple-700">
                +{formatNumber(highlights.maxStreamsDelta7d.value)}
              </div>
              <div className="text-xs text-purple-600 mt-1 capitalize">{highlights.maxStreamsDelta7d.dsp.replace('_', ' ')}</div>
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {selectedDsps.map((dsp) => {
          const dspLatest = latest.find((l) => l.dsp === dsp)
          const dspDelta24h = delta24h.find((d) => d.dsp === dsp)
          const dspDelta7d = delta7d.find((d) => d.dsp === dsp)
          const dspTimeseries = timeseries[dsp] || []

          return (
            <DSPCard
              key={dsp}
              dsp={dsp}
              latest={dspLatest}
              delta24h={dspDelta24h}
              delta7d={dspDelta7d}
              timeseries={dspTimeseries}
              activeMetric={activeMetrics[dsp] || 'listeners'}
              onMetricChange={(metric) =>
                setActiveMetrics((prev) => ({ ...prev, [dsp]: metric }))
              }
            />
          )
        })}
      </div>

      {shareData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por DSP (Followers)</h3>
          <div className="flex items-center gap-4">
            {shareData.map((d) => {
              const percentage = totalFollowers > 0 ? ((d.value / totalFollowers) * 100).toFixed(1) : '0'
              return (
                <div key={d.dsp} className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {d.dsp.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-500">{formatNumber(d.value)} followers</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
