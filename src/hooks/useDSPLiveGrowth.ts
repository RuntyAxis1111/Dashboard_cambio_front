import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface DSPLatest {
  entity_id: string
  dsp: string
  snapshot_ts: string
  followers_total: number | null
  monthly_listeners: number | null
  streams_total: number | null
  rank_country: string | null
  dsp_artist_url: string | null
  source: string
  ingested_at: string
}

export interface DSPDelta24h {
  entity_id: string
  dsp: string
  latest_ts: string
  followers_delta_24h: number | null
  listeners_delta_24h: number | null
  streams_delta_24h: number | null
}

export interface DSPDelta7d {
  entity_id: string
  dsp: string
  latest_ts: string
  followers_delta_7d: number | null
  listeners_delta_7d: number | null
  streams_delta_7d: number | null
}

export interface DSPTimeseries {
  entity_id: string
  dsp: string
  snapshot_ts: string
  followers_total: number | null
  monthly_listeners: number | null
  streams_total: number | null
}

export function useDSPLiveGrowth(
  entityId: string | undefined,
  selectedDsps: string[] = ['spotify', 'apple_music', 'amazon_music'],
  daysRange: number = 7
) {
  const [latest, setLatest] = useState<DSPLatest[]>([])
  const [delta24h, setDelta24h] = useState<DSPDelta24h[]>([])
  const [delta7d, setDelta7d] = useState<DSPDelta7d[]>([])
  const [timeseries, setTimeseries] = useState<Record<string, DSPTimeseries[]>>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadData = useCallback(async () => {
    if (!entityId) return

    try {
      setLoading(true)

      const [latestRes, delta24hRes, delta7dRes] = await Promise.all([
        supabase
          .from('v_dsp_latest')
          .select('*')
          .eq('entity_id', entityId)
          .in('dsp', selectedDsps),
        supabase
          .from('v_dsp_delta_24h')
          .select('*')
          .eq('entity_id', entityId)
          .in('dsp', selectedDsps),
        supabase
          .from('v_dsp_delta_7d')
          .select('*')
          .eq('entity_id', entityId)
          .in('dsp', selectedDsps)
      ])

      if (latestRes.error) throw latestRes.error
      if (delta24hRes.error) throw delta24hRes.error
      if (delta7dRes.error) throw delta7dRes.error

      setLatest(latestRes.data || [])
      setDelta24h(delta24hRes.data || [])
      setDelta7d(delta7dRes.data || [])

      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - daysRange)

      const timeseriesData: Record<string, DSPTimeseries[]> = {}
      for (const dsp of selectedDsps) {
        const { data, error } = await supabase
          .from('v_dsp_timeseries')
          .select('*')
          .eq('entity_id', entityId)
          .eq('dsp', dsp)
          .gte('snapshot_ts', fromDate.toISOString())
          .order('snapshot_ts', { ascending: true })

        if (!error && data) {
          timeseriesData[dsp] = data
        }
      }
      setTimeseries(timeseriesData)

      if (latestRes.data && latestRes.data.length > 0) {
        const maxTimestamp = Math.max(
          ...latestRes.data.map((d) => new Date(d.snapshot_ts).getTime())
        )
        setLastUpdate(new Date(maxTimestamp))
      }
    } catch (error) {
      console.error('Error loading DSP data:', error)
    } finally {
      setLoading(false)
    }
  }, [entityId, selectedDsps, daysRange])

  useEffect(() => {
    if (!entityId) {
      setLoading(false)
      return
    }

    loadData()

    const interval = setInterval(loadData, 15 * 60 * 1000)

    const channel = supabase
      .channel('dsp_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reportes_dsp_stbv',
          filter: `entity_id=eq.${entityId}`
        },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      channel.unsubscribe()
    }
  }, [entityId, loadData])

  return { latest, delta24h, delta7d, timeseries, loading, lastUpdate, refresh: loadData }
}
