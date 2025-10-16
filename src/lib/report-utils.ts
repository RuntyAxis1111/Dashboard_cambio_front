export function reportKindLabel(tipo?: string | null, subtipo?: string | null): string {
  const norm = (s?: string | null) => (s ?? '').toLowerCase()
  const t = norm(tipo)
  const st = norm(subtipo)

  if (st === 'banda')   return 'Band Report'
  if (st === 'solista') return 'Solo Artist Report'
  if (st === 'duo')     return 'Duo Report'

  if (t === 'show')   return 'Show Report'
  if (t === 'artist') return 'Artist Report'

  return 'Report'
}

export function isBandReport(tipo?: string | null, subtipo?: string | null): boolean {
  const norm = (s?: string | null) => (s ?? '').toLowerCase()
  return norm(subtipo) === 'banda' || norm(tipo) === 'banda'
}

export const METRIC_LABELS: Record<string, string> = {
  ig_followers: 'Instagram Followers',
  ig_ctr_link: 'CTR Link-in-Bio',
  ig_engagement_reach: 'Engagement / Reach',
  ig_views_reach: 'Views / Reach',
  yt_realtime_48h: 'YouTube Views (48h)',
  yt_views: 'YouTube Views',
  yt_subscribers: 'YouTube Subscribers',
  yt_watch_time: 'Watch Time',
  sp_listeners: 'Spotify Listeners',
  sp_followers: 'Spotify Followers',
  sp_streams: 'Spotify Streams',
  sp_monthly_listeners: 'Monthly Listeners',
  tt_views: 'TikTok Views',
  tt_likes: 'TikTok Likes',
  tt_comments: 'TikTok Comments',
  tt_shares: 'TikTok Shares',
  tt_followers: 'TikTok Followers',
  listeners_28d: 'Listeners (28d)',
  streams_7d: 'Streams (7d)',
}

export function getMetricLabel(key: string): string {
  return METRIC_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function formatNumber(num: number | null | undefined): string {
  if (num == null) return 'N/A'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatNumberCompact(num: number | null | undefined): string {
  if (num == null) return 'N/A'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatDeltaNum(delta: number | null | undefined): string {
  if (delta == null) return 'N/A'
  const sign = delta >= 0 ? '+' : ''
  if (Math.abs(delta) >= 1_000_000) return `${sign}${(delta / 1_000_000).toFixed(1)}M`
  if (Math.abs(delta) >= 1_000) return `${sign}${(delta / 1_000).toFixed(1)}K`
  return `${sign}${delta.toLocaleString()}`
}

export function formatDelta(delta: number | null | undefined, decimals = 1): string {
  if (delta == null) return 'N/A'
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(decimals)}%`
}

export function formatDeltaPct(delta: number | null | undefined): string {
  if (delta == null) return 'N/A'
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}

export function getDeltaColor(delta: number | null | undefined): string {
  if (delta == null) return 'text-gray-600'
  if (delta > 0) return 'text-green-600'
  if (delta < 0) return 'text-red-600'
  return 'text-gray-600'
}

export function getDeltaBgColor(delta: number | null | undefined): string {
  if (delta == null) return 'bg-gray-100'
  if (delta > 0) return 'bg-green-100'
  if (delta < 0) return 'bg-red-100'
  return 'bg-gray-100'
}
