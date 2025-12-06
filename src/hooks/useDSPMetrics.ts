import { useEffect, useState, useCallback } from 'react'
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

  const loadMetrics = useCallback(async () => {
    if (!entidadId) return

    try {
      setLoading(true)
      setError(null)

      const metrics = ['followers', 'listeners', 'popularity']

      const { data: latestData, error: latestError } = await supabase
        .from('dsp_series')
        .select('*')
        .eq('entidad_id', entidadId)
        .eq('platform', platform)
        .in('metric', metrics)
        .order('ts', { ascending: false })
        .limit(4)

      if (latestError) throw latestError

      const latestMap: Record<string, DSPMetricLatest> = {}
      if (latestData) {
        latestData.forEach((row) => {
          latestMap[row.metric] = {
            entidad_id: row.entidad_id,
            platform: row.platform,
            metric: row.metric,
            ts: row.ts,
            value: row.value ? parseFloat(row.value) : null,
            day_diff: row.day_diff ? parseFloat(row.day_diff) : null,
            week_diff: row.week_diff ? parseFloat(row.week_diff) : null,
            week_pct: row.week_pct ? parseFloat(row.week_pct) : null,
            month_diff: row.month_diff ? parseFloat(row.month_diff) : null,
            month_pct: row.month_pct ? parseFloat(row.month_pct) : null,
          } as DSPMetricLatest
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
          seriesMap[metric] = seriesData.map(d => ({
            ts: d.ts,
            value: d.value ? parseFloat(d.value) : null
          })) as DSPSeriesPoint[]
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
        insights: insightsData ? {
          ...insightsData,
          best_day_value: insightsData.best_day_value ? parseFloat(insightsData.best_day_value) : null,
          velocity_3d: insightsData.velocity_3d ? parseFloat(insightsData.velocity_3d) : null,
          velocity_7d: insightsData.velocity_7d ? parseFloat(insightsData.velocity_7d) : null,
          eta_days: insightsData.eta_days ? parseFloat(insightsData.eta_days) : null,
          capture_rate_per_1k: insightsData.capture_rate_per_1k ? parseFloat(insightsData.capture_rate_per_1k) : null,
        } as DSPInsights : null
      })
    } catch (err) {
      console.error('Error loading DSP metrics:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [entidadId, platform, daysRange])

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
  }, [entidadId, loadMetrics])

  return { ...data, loading, error, refresh: loadMetrics }
}
