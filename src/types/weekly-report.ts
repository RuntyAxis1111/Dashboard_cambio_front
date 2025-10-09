export type ChartRow = {
  rank: string
  chart: string
  track: string
  weeks: string
  notes?: string
  markets?: number
}

export type StreamingTrend = {
  title: string
  bullets: string[]
}

export type TikTokTrend = {
  topic: string
  top_posts: string[]
  notes?: string
}

export type WeeklyReport = {
  artist_id: string
  artist_name: string
  week_start: string
  week_end: string
  highlights: {
    items: string[]
    video_link?: string
  }
  billboard_charts?: ChartRow[]
  spotify_charts?: ChartRow[]
  streaming_trends?: StreamingTrend[]
  tiktok_trends?: TikTokTrend[]
}
