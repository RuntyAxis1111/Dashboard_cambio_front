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
