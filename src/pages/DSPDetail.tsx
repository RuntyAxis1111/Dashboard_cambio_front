import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Users, Radio, Disc, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { DSPCard } from '../components/dsp/DSPCard'

interface EntityInfo {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}

interface DSPMetrics {
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

interface HighlightMetric {
  label: string
  value: string
  delta?: string
  deltaType?: 'positive' | 'negative'
  icon: React.ReactNode
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function DSPDetail() {
  const { entityId } = useParams<{ entityId: string }>()
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [dspMetrics, setDspMetrics] = useState<DSPMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDSPData() {
      if (!entityId) return

      try {
        const { data: entityData, error: entityError } = await supabase
          .from('reportes_entidades')
          .select('id, nombre, slug, imagen_url')
          .eq('id', entityId)
          .single()

        if (entityError) throw entityError
        setEntity(entityData)

        const { data: latestData, error: latestError } = await supabase
          .from('v_dsp_latest')
          .select('*')
          .eq('entity_id', entityId)

        if (latestError) throw latestError

        const { data: delta24hData, error: delta24hError } = await supabase
          .from('v_dsp_delta_24h')
          .select('*')
          .eq('entity_id', entityId)

        if (delta24hError) throw delta24hError

        const { data: delta7dData, error: delta7dError } = await supabase
          .from('v_dsp_delta_7d')
          .select('*')
          .eq('entity_id', entityId)

        if (delta7dError) throw delta7dError

        const metricsMap = new Map<string, DSPMetrics>()

        latestData?.forEach((item) => {
          metricsMap.set(item.dsp, {
            dsp: item.dsp,
            followers_total: item.followers_total || 0,
            monthly_listeners: item.monthly_listeners || 0,
            streams_total: item.streams_total || 0,
            rank_country: item.rank_country,
            dsp_artist_url: item.dsp_artist_url,
            followers_delta_24h: 0,
            listeners_delta_24h: 0,
            streams_delta_24h: 0,
            followers_delta_7d: 0,
            listeners_delta_7d: 0,
            streams_delta_7d: 0
          })
        })

        delta24hData?.forEach((delta) => {
          const metric = metricsMap.get(delta.dsp)
          if (metric) {
            metric.followers_delta_24h = delta.followers_delta_24h || 0
            metric.listeners_delta_24h = delta.listeners_delta_24h || 0
            metric.streams_delta_24h = delta.streams_delta_24h || 0
          }
        })

        delta7dData?.forEach((delta) => {
          const metric = metricsMap.get(delta.dsp)
          if (metric) {
            metric.followers_delta_7d = delta.followers_delta_7d || 0
            metric.listeners_delta_7d = delta.listeners_delta_7d || 0
            metric.streams_delta_7d = delta.streams_delta_7d || 0
          }
        })

        const dspOrder = ['spotify', 'apple_music', 'amazon_music']
        const sortedMetrics = Array.from(metricsMap.values()).sort(
          (a, b) => dspOrder.indexOf(a.dsp) - dspOrder.indexOf(b.dsp)
        )

        setDspMetrics(sortedMetrics)
      } catch (error) {
        console.error('Error loading DSP data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDSPData()
  }, [entityId])

  const totalFollowers = dspMetrics.reduce((sum, m) => sum + m.followers_total, 0)
  const totalListeners = dspMetrics.reduce((sum, m) => sum + m.monthly_listeners, 0)
  const totalStreams = dspMetrics.reduce((sum, m) => sum + m.streams_total, 0)
  const totalFollowersDelta7d = dspMetrics.reduce((sum, m) => sum + m.followers_delta_7d, 0)
  const totalListenersDelta7d = dspMetrics.reduce((sum, m) => sum + m.listeners_delta_7d, 0)
  const totalStreamsDelta7d = dspMetrics.reduce((sum, m) => sum + m.streams_delta_7d, 0)

  const highlights: HighlightMetric[] = [
    {
      label: 'Total Followers',
      value: formatNumber(totalFollowers),
      delta: totalFollowersDelta7d > 0 ? `+${formatNumber(totalFollowersDelta7d)}` : formatNumber(totalFollowersDelta7d),
      deltaType: totalFollowersDelta7d >= 0 ? 'positive' : 'negative',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Monthly Listeners',
      value: formatNumber(totalListeners),
      delta: totalListenersDelta7d > 0 ? `+${formatNumber(totalListenersDelta7d)}` : formatNumber(totalListenersDelta7d),
      deltaType: totalListenersDelta7d >= 0 ? 'positive' : 'negative',
      icon: <Radio className="w-5 h-5" />
    },
    {
      label: 'Total Streams',
      value: formatNumber(totalStreams),
      delta: totalStreamsDelta7d > 0 ? `+${formatNumber(totalStreamsDelta7d)}` : formatNumber(totalStreamsDelta7d),
      deltaType: totalStreamsDelta7d >= 0 ? 'positive' : 'negative',
      icon: <Disc className="w-5 h-5" />
    },
    {
      label: 'Active Platforms',
      value: dspMetrics.length.toString(),
      icon: <TrendingUp className="w-5 h-5" />
    }
  ]

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports', href: '/reports/weeklies' },
    { label: entity?.nombre || 'DSP Growth' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl h-32"></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entity not found</h2>
            <Link to="/reports/weeklies" className="text-blue-600 hover:text-blue-700">
              Back to reports
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4 mt-6">
            <Link
              to="/reports/weeklies"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {entity.imagen_url && (
              <img
                src={entity.imagen_url}
                alt={entity.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{entity.nombre}</h1>
              <p className="text-gray-600">DSP Live Growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Highlights / Overall Summary</h2>
          </div>
          <div className="space-y-2 text-gray-700">
            <p className="leading-relaxed">
              <span className="font-semibold">Top DSP this week:</span> {dspMetrics.length > 0 ? (() => {
                const topDSP = dspMetrics.reduce((prev, current) =>
                  (prev.followers_delta_7d > current.followers_delta_7d) ? prev : current
                )
                const dspNames: Record<string, string> = {
                  spotify: 'Spotify',
                  apple_music: 'Apple Music',
                  amazon_music: 'Amazon Music'
                }
                return `${dspNames[topDSP.dsp] || topDSP.dsp} gained ${formatNumber(topDSP.followers_delta_7d)} followers (+${((topDSP.followers_delta_7d / (topDSP.followers_total - topDSP.followers_delta_7d)) * 100).toFixed(1)}%)`
              })() : 'No data available'}
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold">Streaming momentum:</span> Total streams increased by {formatNumber(totalStreamsDelta7d)} this week across all platforms, showing {totalStreamsDelta7d > 0 ? 'strong' : 'stable'} growth trajectory.
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold">Audience expansion:</span> Monthly listeners grew by {formatNumber(totalListenersDelta7d)} ({((totalListenersDelta7d / (totalListeners - totalListenersDelta7d)) * 100).toFixed(1)}%), indicating {totalListenersDelta7d > totalFollowersDelta7d ? 'strong discovery momentum beyond the core fanbase' : 'steady engagement with existing audience'}.
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold">Platform presence:</span> Active on {dspMetrics.length} major streaming platforms with a combined reach of {formatNumber(totalFollowers)} followers and {formatNumber(totalListeners)} monthly listeners.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">TOTALS</h2>
            <div className="flex items-center gap-2">
              <img src="/assets/spotify.png" alt="Spotify" className="w-6 h-6 object-contain" />
              <span className="text-gray-400">+</span>
              <img src="/assets/applemusicicon.png" alt="Apple Music" className="w-6 h-6 object-contain" />
              <span className="text-gray-400">+</span>
              <img src="/assets/amazonmusiciconnew.png" alt="Amazon Music" className="w-6 h-6 object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    {highlight.icon}
                  </div>
                  <div className="text-sm text-gray-600">{highlight.label}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {highlight.value}
                </div>
                {highlight.delta && (
                  <div
                    className={`text-sm font-medium ${
                      highlight.deltaType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {highlight.delta} (7d)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Breakdown</h2>

        {dspMetrics.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No DSP data available</h3>
            <p className="text-gray-600">Data will appear here once n8n starts collecting metrics</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dspMetrics.map((metrics) => (
              <DSPCard key={metrics.dsp} {...metrics} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
