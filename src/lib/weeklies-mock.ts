export interface WeeklyKPI {
  label: string
  value: string | number
  unit?: string
  delta?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface ChartEntry {
  chart_name: string
  country: string
  entity_type: 'track' | 'album'
  entity_name: string
  rank: number
  delta?: number
  weeks_on_chart?: number
}

export interface PlaylistEntry {
  playlist_name: string
  position: number
  followers?: number
  country?: string
  date?: string
}

export interface MarketEntry {
  country: string
  country_code: string
  active: boolean
}

export interface TrendEntry {
  track_name: string
  global_change: number
  us_change: number
  top_markets: { country: string; change: number }[]
}

export interface TikTokPost {
  title: string
  views: number
  link: string
  creator?: string
}

export interface SalesEntry {
  release_name: string
  type: 'album' | 'track'
  tw_units: number
  rtd_units: number
  tw_change: number
  rtd_change: number
}

export interface MVEntry {
  title: string
  total_views: number
  link: string
}

export interface IGMemberGrowth {
  member_name: string
  start_followers: number
  end_followers: number
  delta: number
  delta_pct: number
  profile_link: string
}

export interface FanSentiment {
  topics: string[]
  attachments?: { type: 'image' | 'link'; url: string; caption?: string }[]
}

export interface DSPData {
  charts: ChartEntry[]
  playlists: PlaylistEntry[]
  markets: MarketEntry[]
  active_market_count?: number
}

export interface WeeklySection {
  section_type: string
  title: string
  order_index: number
  payload: any
  meta?: Record<string, any>
}

export interface WeeklyReport {
  artist: string
  artist_id: string
  week_start: string
  week_end: string
  kpis: WeeklyKPI[]
  sections: WeeklySection[]
}

export interface ArtistSummary {
  artist_id: string
  artist_name: string
  last_week: string
  thumbnail?: string
}

export const mockArtistsSummary: ArtistSummary[] = [
  {
    artist_id: 'daddy-yankee',
    artist_name: 'Daddy Yankee',
    last_week: '2025-10-06',
    thumbnail: '/placeholder-user.jpg'
  },
  {
    artist_id: 'bts',
    artist_name: 'BTS',
    last_week: '2025-10-06',
    thumbnail: '/placeholder-user.jpg'
  },
  {
    artist_id: 'kocky-ka',
    artist_name: 'Kocky Ka',
    last_week: '2025-10-06',
    thumbnail: '/placeholder-user.jpg'
  },
  {
    artist_id: 'chicocurlyhead',
    artist_name: 'Chicocurlyhead',
    last_week: '2025-10-06',
    thumbnail: '/placeholder-user.jpg'
  },
  {
    artist_id: 'magna',
    artist_name: 'Magna',
    last_week: '2025-10-06',
    thumbnail: '/placeholder-user.jpg'
  }
]

export const mockWeeklyReports: Record<string, WeeklyReport> = {
  'bts-2025-10-06': {
    artist: 'BTS',
    artist_id: 'bts',
    week_start: '2025-09-30',
    week_end: '2025-10-06',
    kpis: [
      { label: 'Monthly Listeners', value: '85.7M', unit: '', delta: '+5.2%', trend: 'up' },
      { label: 'Active Markets', value: 125, unit: 'countries', delta: '+2', trend: 'up' },
      { label: 'Instagram Followers', value: '73.5M', unit: '', delta: '+2.1%', trend: 'up' },
      { label: 'TikTok Followers', value: '52.3M', unit: '', delta: '+4.8%', trend: 'up' },
      { label: 'YouTube Subscribers', value: '75.2M', unit: '', delta: '+1.5%', trend: 'up' }
    ],
    sections: [
      {
        section_type: 'highlights',
        title: 'Highlights',
        order_index: 1,
        payload: {
          items: [
            { text: 'Dynamite surpassed 1.5 billion streams on Spotify', link: 'https://open.spotify.com' },
            { text: 'Featured on cover of Rolling Stone Korea' },
            { text: 'New collaboration announced with Coldplay', link: 'https://billboard.com' },
            { text: 'Billboard Music Awards nomination received' }
          ]
        }
      },
      {
        section_type: 'streaming_data',
        title: 'Streaming Data — DSPs',
        order_index: 2,
        payload: {
          spotify: {
            charts: [
              { chart_name: 'Top 200', country: 'Global', entity_type: 'track', entity_name: 'Dynamite', rank: 15, delta: 3, weeks_on_chart: 156 },
              { chart_name: 'Top 200', country: 'US', entity_type: 'track', entity_name: 'Butter', rank: 25, delta: 1, weeks_on_chart: 142 }
            ],
            playlists: [
              { playlist_name: 'Global Top 50', position: 18, followers: 28000000, country: 'Global', date: '2025-10-01' },
              { playlist_name: 'K-Pop Daebak', position: 1, followers: 8500000, country: 'Global', date: '2025-10-03' }
            ],
            markets: [],
            active_market_count: 125
          },
          apple: {
            charts: [
              { chart_name: 'Top Songs', country: 'Global', entity_type: 'track', entity_name: 'Butter', rank: 22, delta: 2 }
            ],
            playlists: [
              { playlist_name: 'K-Pop Now', position: 1, country: 'Global', date: '2025-10-02' }
            ],
            markets: [],
            active_market_count: 98
          }
        }
      },
      {
        section_type: 'tiktok',
        title: 'TikTok',
        order_index: 3,
        payload: {
          metrics: [
            { track_name: 'Dynamite', daily_creates: 25000, total_creates: 8500000 },
            { track_name: 'Butter', daily_creates: 18000, total_creates: 7200000 }
          ],
          top_posts: [
            { title: 'BTS Dance Cover Challenge', views: 15000000, link: 'https://tiktok.com', creator: '@btsdance' },
            { title: 'ARMY Reaction Video', views: 8500000, link: 'https://tiktok.com', creator: '@armyreacts' }
          ]
        }
      },
      {
        section_type: 'mv_views',
        title: 'MV Views (YouTube)',
        order_index: 4,
        payload: {
          videos: [
            { title: 'Dynamite (Official MV)', total_views: 1750000000, link: 'https://youtube.com' },
            { title: 'Butter (Official MV)', total_views: 950000000, link: 'https://youtube.com' }
          ]
        }
      }
    ]
  },
  'daddy-yankee-2025-10-06': {
    artist: 'Daddy Yankee',
    artist_id: 'daddy-yankee',
    week_start: '2025-09-30',
    week_end: '2025-10-06',
    kpis: [
      { label: 'Monthly Listeners', value: '45.2M', unit: '', delta: '+2.3%', trend: 'up' },
      { label: 'Active Markets', value: 78, unit: 'countries', delta: '+3', trend: 'up' },
      { label: 'Instagram Followers', value: '12.5M', unit: '', delta: '+1.2%', trend: 'up' },
      { label: 'TikTok Followers', value: '8.9M', unit: '', delta: '+3.5%', trend: 'up' },
      { label: 'YouTube Subscribers', value: '32.1M', unit: '', delta: '+0.8%', trend: 'up' }
    ],
    sections: [
      {
        section_type: 'highlights',
        title: 'Highlights',
        order_index: 1,
        payload: {
          items: [
            { text: 'New single "La Nueva" reached #1 on Spotify Global Chart', link: 'https://open.spotify.com' },
            { text: 'Featured on Apple Music\'s "Latin Heat" editorial playlist' },
            { text: 'Billboard interview published', link: 'https://billboard.com' },
            { text: '10M milestone on TikTok creates for "Gasolina"' }
          ]
        }
      },
      {
        section_type: 'streaming_data',
        title: 'Streaming Data — DSPs',
        order_index: 2,
        payload: {
          spotify: {
            charts: [
              { chart_name: 'Top 200', country: 'Global', entity_type: 'track', entity_name: 'La Nueva', rank: 1, delta: 5, weeks_on_chart: 2 },
              { chart_name: 'Top 200', country: 'US', entity_type: 'track', entity_name: 'La Nueva', rank: 3, delta: 2, weeks_on_chart: 2 },
              { chart_name: 'Top 200', country: 'Mexico', entity_type: 'track', entity_name: 'La Nueva', rank: 1, delta: 0, weeks_on_chart: 3 }
            ],
            playlists: [
              { playlist_name: 'Today\'s Top Hits', position: 12, followers: 35000000, country: 'Global', date: '2025-10-01' },
              { playlist_name: 'Viva Latino', position: 1, followers: 15000000, country: 'Global', date: '2025-10-02' }
            ],
            markets: [
              { country: 'United States', country_code: 'US', active: true },
              { country: 'Mexico', country_code: 'MX', active: true },
              { country: 'Colombia', country_code: 'CO', active: true }
            ],
            active_market_count: 78
          },
          apple: {
            charts: [
              { chart_name: 'Top Songs', country: 'US', entity_type: 'track', entity_name: 'La Nueva', rank: 5, delta: 3 },
              { chart_name: 'Top Songs', country: 'Mexico', entity_type: 'track', entity_name: 'La Nueva', rank: 1, delta: 0 }
            ],
            playlists: [
              { playlist_name: 'Latin Heat', position: 3, country: 'Global', date: '2025-10-03' }
            ],
            markets: [
              { country: 'United States', country_code: 'US', active: true },
              { country: 'Mexico', country_code: 'MX', active: true }
            ],
            active_market_count: 65
          },
          amazon: {
            charts: [
              { chart_name: 'Top Songs', country: 'US', entity_type: 'track', entity_name: 'La Nueva', rank: 8, delta: 2 }
            ],
            playlists: [],
            markets: [
              { country: 'United States', country_code: 'US', active: true }
            ],
            active_market_count: 12
          }
        }
      },
      {
        section_type: 'streaming_trends',
        title: 'Streaming Trends',
        order_index: 3,
        payload: {
          trends: [
            {
              track_name: 'La Nueva',
              global_change: 15.5,
              us_change: 12.3,
              top_markets: [
                { country: 'Mexico', change: 22.1 },
                { country: 'Colombia', change: 18.7 },
                { country: 'Argentina', change: 14.2 }
              ]
            },
            {
              track_name: 'Gasolina',
              global_change: 5.2,
              us_change: 3.8,
              top_markets: [
                { country: 'US', change: 3.8 },
                { country: 'Spain', change: 8.1 }
              ]
            }
          ]
        }
      },
      {
        section_type: 'tiktok',
        title: 'TikTok',
        order_index: 4,
        payload: {
          metrics: [
            { track_name: 'La Nueva', daily_creates: 12500, total_creates: 2500000 },
            { track_name: 'Gasolina', daily_creates: 8900, total_creates: 15000000 }
          ],
          top_posts: [
            { title: 'Dance Challenge by @dancemoves', views: 2500000, link: 'https://tiktok.com/@dancemoves', creator: '@dancemoves' },
            { title: 'Reaction Video by @latinmusic', views: 1800000, link: 'https://tiktok.com/@latinmusic', creator: '@latinmusic' }
          ]
        }
      },
      {
        section_type: 'sales_streams',
        title: 'Sales & Streams',
        order_index: 5,
        payload: {
          sales: [
            { release_name: 'La Nueva', type: 'track', tw_units: 125000, rtd_units: 3500000, tw_change: 15.5, rtd_change: 22.3 },
            { release_name: 'Legendaddy', type: 'album', tw_units: 45000, rtd_units: 1200000, tw_change: 2.1, rtd_change: 5.6 }
          ]
        }
      },
      {
        section_type: 'mv_views',
        title: 'MV Views (YouTube)',
        order_index: 6,
        payload: {
          videos: [
            { title: 'La Nueva (Official Video)', total_views: 45000000, link: 'https://youtube.com/watch?v=abc' },
            { title: 'Gasolina (Official Video)', total_views: 2100000000, link: 'https://youtube.com/watch?v=xyz' }
          ]
        }
      }
    ]
  }
}

export function getWeeklyReport(artistId: string, weekStart: string): WeeklyReport | null {
  const key = `${artistId}-${weekStart}`
  return mockWeeklyReports[key] || null
}

export function getAvailableWeeks(artistId: string): string[] {
  return ['2025-10-06', '2025-09-29', '2025-09-22', '2025-09-15']
}
