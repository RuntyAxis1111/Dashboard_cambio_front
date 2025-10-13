import { supabase } from './supabase'
import type { WeeklyReport } from '../types/weekly-report'

function isDbReportsEnabled(): boolean {
  const viteFlag = import.meta.env.VITE_USE_DB_REPORTS
  const nextFlag = import.meta.env.NEXT_PUBLIC_USE_DB_REPORTS
  return viteFlag === 'true' || nextFlag === 'true'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getWeeklyReportFromNewSchema(
  artistSlug: string,
  weekEnd?: string
): Promise<WeeklyReport | null> {
  try {
    const { data: artists } = await supabase
      .from('artistas_registry')
      .select('id, nombre')
      .ilike('nombre', `%${artistSlug.replace(/-/g, ' ')}%`)

    if (!artists || artists.length === 0) {
      return null
    }

    const artistId = artists[0].id
    const artistName = artists[0].nombre

    let query = supabase
      .from('reports')
      .select('*')
      .eq('report_type', 'artist')
      .eq('artist_id', artistId)

    if (weekEnd) {
      query = query.eq('week_end', weekEnd)
    }

    const { data: report, error: reportError } = await query
      .order('week_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (reportError || !report) {
      return null
    }

    const { data: sections } = await supabase
      .from('report_sections')
      .select('*')
      .eq('report_id', report.id)
      .order('order_no', { ascending: true })

    const result: WeeklyReport = {
      artist: artistName.toUpperCase(),
      week_start: report.week_start,
      week_end: report.week_end,
      highlights: []
    }

    if (sections) {
      for (const section of sections) {
        const key = section.section_key
        const data = section.data_json || {}

        switch (key) {
          case 'highlights':
            result.highlights = data.bullets || []
            if (data.link) {
              result.highlight_link = data.link
            }
            break

          case 'fan_sentiment':
            result.fan_sentiment = section.content_md || data.text || ''
            break

          case 'billboard_charts':
            result.billboard_charts = data.charts || []
            break

          case 'spotify_charts':
            result.spotify_charts = data.charts || []
            break

          case 'streaming_trends':
            result.streaming_trends = data.trends || []
            break

          case 'tiktok_trends':
            result.tiktok_trends = data.trends || []
            break

          case 'apple_music':
            result.apple_music = data.data || []
            break

          case 'shazam':
            result.shazam = data.data || []
            break

          case 'playlist_adds':
            result.playlist_adds = data.adds || []
            break

          case 'demographics':
            result.demographics = data
            break

          case 'top_countries':
            result.top_countries = data.countries || []
            break

          case 'top_cities':
            result.top_cities = data.cities || []
            break

          case 'release_engagement':
            result.release_engagement = data
            break

          case 'mv_views':
            result.mv_views = data.views || []
            break

          case 'spotify_stats':
            result.spotify_stats = data
            break

          case 'audience_segmentation':
            result.audience_segmentation = data
            break

          case 'total_audience':
            result.total_audience = data.total || 0
            break
        }
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching from new schema:', error)
    return null
  }
}

async function getWeeklyReportFromOldSchema(
  artistSlug: string,
  weekEnd?: string
): Promise<WeeklyReport | null> {
  try {
    let query = supabase
      .from('spotify_report_weekly')
      .select('*')
      .eq('artist_id', artistSlug)
      .eq('status', 'ready')

    if (weekEnd) {
      query = query.eq('week_end', weekEnd)
    }

    const { data, error } = await query
      .order('week_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return {
      artist: data.artist_name,
      week_start: data.week_start,
      week_end: data.week_end,
      highlights: []
    }
  } catch (error) {
    console.error('Error fetching from old schema:', error)
    return null
  }
}

export async function getWeeklyReportDetailed(
  artistSlug: string,
  weekEnd?: string,
  fallbackSample?: WeeklyReport | null
): Promise<WeeklyReport | null> {
  if (!isDbReportsEnabled()) {
    return fallbackSample || null
  }

  const newReport = await getWeeklyReportFromNewSchema(artistSlug, weekEnd)
  if (newReport) {
    return newReport
  }

  const oldReport = await getWeeklyReportFromOldSchema(artistSlug, weekEnd)
  if (oldReport) {
    return oldReport
  }

  return fallbackSample || null
}
