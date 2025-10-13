import { supabase } from './supabase'

export interface WeeklyReport {
  report_id: string
  artist_id: string
  artist_name: string
  week_start: string
  week_end: string
  report_title?: string
  status: string
  version: string
  cover_image_url?: string
  created_at: string
}

export interface ReportSection {
  section_id: string
  report_id: string
  section_type: string
  platform?: string
  title?: string
  order_index: number
  payload_json: any
  meta_json: any
  confidence?: number
  created_at: string
}

export interface ReportMedia {
  media_id: string
  report_id: string
  section_id?: string
  media_type: string
  title?: string
  url: string
  provider?: string
  metrics_json?: any
  section_type?: string
  platform?: string
  created_at: string
}

export interface ArtistSummary {
  artist_id: string
  artist_name: string
  week_end: string
  cover_image_url?: string
}

export async function getLatestWeekEnd(): Promise<string | null> {
  const { data, error } = await supabase
    .from('spotify_report_weekly')
    .select('week_end')
    .eq('status', 'ready')
    .order('week_end', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching latest week:', error)
    return null
  }

  return data?.week_end || null
}

export async function getArtistsForWeek(weekEnd: string): Promise<ArtistSummary[]> {
  const { data, error } = await supabase
    .from('spotify_report_weekly')
    .select('artist_id, artist_name, week_end, cover_image_url')
    .eq('week_end', weekEnd)
    .eq('status', 'ready')
    .order('artist_name', { ascending: true })

  if (error) {
    console.error('Error fetching artists for week:', error)
    return []
  }

  return data || []
}

export async function getWeeklyReport(artistId: string, weekEnd?: string): Promise<WeeklyReport | null> {
  let query = supabase
    .from('spotify_report_weekly')
    .select('*')
    .eq('artist_id', artistId)
    .eq('status', 'ready')

  if (weekEnd) {
    query = query.eq('week_end', weekEnd)
  }

  const { data, error } = await query
    .order('week_end', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching weekly report:', error)
    return null
  }

  return data
}

export async function getAvailableWeeks(artistId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('spotify_report_weekly')
    .select('week_end')
    .eq('artist_id', artistId)
    .eq('status', 'ready')
    .order('week_end', { ascending: false })

  if (error) {
    console.error('Error fetching available weeks:', error)
    return []
  }

  return data?.map((r: any) => r.week_end) || []
}

export async function getReportSections(reportId: string): Promise<ReportSection[]> {
  const { data, error } = await supabase
    .from('spotify_report_sections')
    .select('*')
    .eq('report_id', reportId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching report sections:', error)
    return []
  }

  return data || []
}

export async function getReportMedia(reportId: string): Promise<ReportMedia[]> {
  const { data, error } = await supabase
    .from('spotify_report_media')
    .select('*')
    .eq('report_id', reportId)

  if (error) {
    console.error('Error fetching report media:', error)
    return []
  }

  return data || []
}

function isDbReportsEnabled(): boolean {
  return true
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function listWeeklyReportsNew(): Promise<ArtistSummary[]> {
  if (!isDbReportsEnabled()) {
    return []
  }

  try {
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select(`
        id,
        artist_id,
        week_end,
        title
      `)
      .eq('report_type', 'artist')
      .order('week_end', { ascending: false })

    if (reportsError || !reports || reports.length === 0) {
      return []
    }

    const artistIds = [...new Set(reports.map(r => r.artist_id))]
    const { data: artists, error: artistsError } = await supabase
      .from('artistas_registry')
      .select('id, nombre')
      .in('id', artistIds)

    if (artistsError || !artists) {
      return []
    }

    const artistMap = new Map(artists.map(a => [a.id, a.nombre]))

    const artistSummaries: ArtistSummary[] = []
    const seenArtists = new Set<number>()

    for (const report of reports) {
      if (seenArtists.has(report.artist_id)) continue
      seenArtists.add(report.artist_id)

      const artistName = artistMap.get(report.artist_id)
      if (!artistName) continue

      const artistId = slugify(artistName)

      const { data: oldReport } = await supabase
        .from('spotify_report_weekly')
        .select('cover_image_url')
        .eq('artist_id', artistId)
        .order('week_end', { ascending: false })
        .limit(1)
        .maybeSingle()

      artistSummaries.push({
        artist_id: artistId,
        artist_name: artistName.toUpperCase(),
        week_end: report.week_end,
        cover_image_url: oldReport?.cover_image_url || null
      })
    }

    return artistSummaries
  } catch (error) {
    console.error('Error in listWeeklyReportsNew:', error)
    return []
  }
}

export async function listWeeklyReportsOld(): Promise<ArtistSummary[]> {
  try {
    const { data, error } = await supabase
      .from('spotify_report_weekly')
      .select('artist_id, artist_name, week_end, cover_image_url')
      .eq('status', 'ready')
      .order('week_end', { ascending: false })

    if (error || !data) {
      return []
    }

    const seen = new Set<string>()
    const results: ArtistSummary[] = []

    for (const row of data) {
      if (!seen.has(row.artist_id)) {
        seen.add(row.artist_id)
        results.push({
          artist_id: row.artist_id,
          artist_name: row.artist_name,
          week_end: row.week_end,
          cover_image_url: row.cover_image_url
        })
      }
    }

    return results
  } catch (error) {
    console.error('Error in listWeeklyReportsOld:', error)
    return []
  }
}

export async function listWeeklyReports(fallbackSamples: ArtistSummary[]): Promise<ArtistSummary[]> {
  if (!isDbReportsEnabled()) {
    return fallbackSamples
  }

  const newResults = await listWeeklyReportsNew()
  if (newResults.length > 0) {
    return newResults
  }

  const oldResults = await listWeeklyReportsOld()
  if (oldResults.length > 0) {
    return oldResults
  }

  return fallbackSamples
}
