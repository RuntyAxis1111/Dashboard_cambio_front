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
}
