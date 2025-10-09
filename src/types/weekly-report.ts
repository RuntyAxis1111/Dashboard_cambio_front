export type BillboardChartRow = {
  rank: string
  chart: string
  work: string
  weeks: number
  notes: string
}

export type SpotifyChartRow = {
  track: string
  markets: number
  notes: string
}

export type StreamingTrend = {
  track: string
  bullets: string[]
}

export type TikTokTrend = {
  track: string
  top_posts: string[]
  note?: string
}

export type PlaylistAdd = {
  playlist: string
  curator: string
  followers_k: number
  track: string
  date_added: string
  position: string
  peak: number
  note: string
}

export type Demographics = {
  gender: { female: number; male: number; non_binary: number; not_specified: number }
  age_pct: Record<string, number>
}

export type TopCountry = {
  rank: number
  country: string
  listeners: number
}

export type TopCity = {
  rank: number
  city: string
  listeners: number
}

export type ReleaseEngagement = {
  title: string
  days_since_release: number
  active_audience_total: number
  engaged_streamed: number
  engaged_pct: number
}

export type SpotifyStats = {
  listeners: number
  streams: number
  streams_per_listener: number
  saves: number
  playlist_adds: number
}

export type AudienceSegmentation = {
  active: number
  previously_active: number
  programmed: number
}

export type WeeklyReport = {
  artist: string
  week_start: string
  week_end: string
  highlights: string[]
  highlight_link?: {
    label: string
    url: string
  }
  billboard_charts?: BillboardChartRow[]
  spotify_charts?: SpotifyChartRow[]
  streaming_trends?: StreamingTrend[]
  tiktok_trends?: TikTokTrend[]
  apple_music?: any[]
  shazam?: any[]
  playlist_adds?: PlaylistAdd[]
  demographics?: Demographics
  top_countries?: TopCountry[]
  top_cities?: TopCity[]
  release_engagement?: ReleaseEngagement
  total_audience?: number
  fan_sentiment?: string
  spotify_stats?: SpotifyStats
  audience_segmentation?: AudienceSegmentation
}
