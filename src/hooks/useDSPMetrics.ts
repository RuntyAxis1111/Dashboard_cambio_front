import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface DSPMetricLatest {
  entidad_id: string
  platform: string
  metric: string
  ts: string
  value: number | null
  day_diff: number | null
  week_diff: number | null
  week_pct: number | null
  month_diff: number | null
  month_pct: number | null
}

export interface DSPSeriesPoint {
  ts: string
  value: number | null
}

export interface DSPInsights {
  entidad_id: string
  platform: string
  as_of_date: string
  streak_days: number | null
  best_day_date: string | null
  best_day_value: number | null
  velocity_3d: number | null
  velocity_7d: number | null
  eta_target_label: string | null
  eta_days: number | null
  anomaly: boolean | null
  capture_rate_per_1k: number | null
  extra: any
}

export interface DSPMetricsData {
  latest: Record<string, DSPMetricLatest>
  series: Record<string, DSPSeriesPoint[]>
  insights: DSPInsights | null
}

export function useDSPMetrics(
  entidadId: string | undefined,
  platform: 'spotify' | 'apple' | 'amazon',
  daysRange: number = 30
) {
  const [data, setData] = useState<DSPMetricsData>({
    latest: {},
    series: {},
    insights: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!entidadId) {
      setLoading(false)
      return
    }

    loadMetrics()

    const interval = setInterval(loadMetrics, 15 * 60 * 1000)

    const channel = supabase
      .channel('dsp_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dsp_series',
          filter: `entidad_id=eq.${entidadId}`
        },
        () => {
          loadMetrics()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      channel.unsubscribe()
    }
  }, [entidadId, platform, daysRange])

  async function loadMetrics() {
    if (!entidadId) return

    try {
      setLoading(true)
      setError(null)

      const metrics = ['followers', 'listeners', 'popularity', 'fl_ratio']

      const { data: latestData, error: latestError } = await supabase
        .from('v_dsp_latest')
        .select('*')
        .eq('entidad_id', entidadId)
        .eq('platform', platform)
        .in('metric', metrics)

      if (latestError) throw latestError

      const latestMap: Record<string, DSPMetricLatest> = {}
      if (latestData) {
        latestData.forEach((row) => {
          latestMap[row.metric] = row as DSPMetricLatest
        })
      }

      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - daysRange)

      const seriesMap: Record<string, DSPSeriesPoint[]> = {}
      for (const metric of metrics) {
        const { data: seriesData, error: seriesError } = await supabase
          .from('dsp_series')
          .select('ts, value')
          .eq('entidad_id', entidadId)
          .eq('platform', platform)
          .eq('metric', metric)
          .gte('ts', fromDate.toISOString().split('T')[0])
          .order('ts', { ascending: true })

        if (!seriesError && seriesData) {
          seriesMap[metric] = seriesData as DSPSeriesPoint[]
        }
      }

      const { data: insightsData, error: insightsError } = await supabase
        .from('dsp_insights')
        .select('*')
        .eq('entidad_id', entidadId)
        .eq('platform', platform)
        .order('as_of_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (insightsError) throw insightsError

      setData({
        latest: latestMap,
        series: seriesMap,
        insights: insightsData as DSPInsights | null
      })
    } catch (err) {
      console.error('Error loading DSP metrics:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return { ...data, loading, error, refresh: loadMetrics }
}
