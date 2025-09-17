// BigQuery configuration and queries for HYBE LATAM
export interface BigQueryConfig {
  projectId: string
  credentials?: {
    client_email: string
    private_key: string
  }
}

// Configuration using the real project ID
export const BIGQUERY_CONFIG: BigQueryConfig = {
  projectId: 'dashboards-api-chartmetric',
  credentials: {
    client_email: process.env.BIGQUERY_CLIENT_EMAIL || '',
    private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
  }
}

// Platform to dataset mapping based on your BigQuery structure
export const PLATFORM_DATASETS = {
  // PALF platforms
  'palf-facebook': 'PALF_FACEBOOK',
  'palf-instagram': 'PALF_INSTAGRAM', 
  'palf-tiktok': 'PALF_TIKTOK',
  'palf-twitter': 'PALF_TWITTER',
  'palf-youtube': 'PALF_YOUTUBE2',
  
  // STBV platforms (assuming similar structure)
  'stbv-facebook': 'STBV_FACEBOOK',
  'stbv-instagram': 'STBV_INSTAGRAM',
  'stbv-tiktok': 'STBV_TIKTOK',
  'stbv-twitter': 'STBV_TWITTER',
  'stbv-youtube': 'STBV_YOUTUBE',
  
  // Communities
  'pisteo-instagram': 'PISTEO_INSTAGRAM',
  'pisteo-facebook': 'PISTEO_FACEBOOK',
  'pisteo-tiktok': 'PISTEO_TIKTOK',
  'pisteo-twitter': 'PISTEO_TWITTER',
  
  // Artists (assuming they follow similar pattern)
  'daddy-yankee-facebook': 'DADDY_YANKEE_FACEBOOK',
  'bts-twitter': 'BTS_TWITTER',
  'kocky-ka-tiktok': 'KOCKY_KA_TIKTOK',
}

// Table and column mapping for each platform type
export const PLATFORM_QUERIES = {
  facebook: {
    table: 'FBPAGE_PAGE',
    columns: {
      followers: 'PAGE_FOLLOWERS',
      engagement: 'PAGE_ENGAGEMENT_RATE', // Assuming this exists
      reach: 'PAGE_REACH', // Assuming this exists
      impressions: 'PAGE_IMPRESSIONS' // Assuming this exists
    }
  },
  instagram: {
    table: 'INSTAGRAM_ACCOUNT',
    columns: {
      followers: 'FOLLOWERS_COUNT',
      engagement: 'ENGAGEMENT_RATE',
      reach: 'REACH',
      impressions: 'IMPRESSIONS'
    }
  },
  tiktok: {
    table: 'TIKTOK_ACCOUNT', // Assuming
    columns: {
      followers: 'FOLLOWERS_COUNT',
      engagement: 'ENGAGEMENT_RATE',
      reach: 'VIEWS',
      impressions: 'TOTAL_VIEWS'
    }
  },
  twitter: {
    table: 'TWITTER_ACCOUNT', // Assuming
    columns: {
      followers: 'FOLLOWERS_COUNT',
      engagement: 'ENGAGEMENT_RATE',
      reach: 'IMPRESSIONS',
      impressions: 'TOTAL_IMPRESSIONS'
    }
  },
  youtube: {
    table: 'YOUTUBE_CHANNEL', // Assuming
    columns: {
      followers: 'SUBSCRIBERS_COUNT',
      engagement: 'ENGAGEMENT_RATE',
      reach: 'VIEWS',
      impressions: 'TOTAL_VIEWS'
    }
  }
}

// Build query for specific platform and project
export function buildKPIQuery(project: string, platform: string, dateRange?: { start: string; end: string }): string {
  const platformKey = `${project}-${platform}` as keyof typeof PLATFORM_DATASETS
  const dataset = PLATFORM_DATASETS[platformKey]
  const platformConfig = PLATFORM_QUERIES[platform as keyof typeof PLATFORM_QUERIES]
  
  if (!dataset || !platformConfig) {
    throw new Error(`Unsupported platform: ${project}-${platform}`)
  }
  
  const { table, columns } = platformConfig
  const endDate = dateRange?.end || '2025-09-17' // Default to today
  const startDate = dateRange?.start || '2025-08-17' // Default to 30 days ago
  
  return `
    WITH current_data AS (
      SELECT 
        ${columns.followers} as followers,
        ${columns.engagement} as engagement_rate,
        ${columns.reach} as reach,
        ${columns.impressions} as impressions,
        DATE
      FROM \`dashboards-api-chartmetric.${dataset}.${table}\`
      WHERE DATE = "${endDate}"
      ORDER BY DATE DESC
      LIMIT 1
    ),
    previous_data AS (
      SELECT 
        ${columns.followers} as followers,
        ${columns.engagement} as engagement_rate,
        ${columns.reach} as reach,
        ${columns.impressions} as impressions
      FROM \`dashboards-api-chartmetric.${dataset}.${table}\`
      WHERE DATE = "${startDate}"
      ORDER BY DATE DESC
      LIMIT 1
    )
    SELECT 
      current_data.followers as total_followers,
      current_data.engagement_rate,
      current_data.reach,
      current_data.impressions,
      CASE 
        WHEN previous_data.followers > 0 
        THEN ROUND(((current_data.followers - previous_data.followers) / previous_data.followers) * 100, 1)
        ELSE 0 
      END as followers_change_pct,
      CASE 
        WHEN previous_data.engagement_rate > 0 
        THEN ROUND(((current_data.engagement_rate - previous_data.engagement_rate) / previous_data.engagement_rate) * 100, 1)
        ELSE 0 
      END as engagement_change_pct,
      CASE 
        WHEN previous_data.reach > 0 
        THEN ROUND(((current_data.reach - previous_data.reach) / previous_data.reach) * 100, 1)
        ELSE 0 
      END as reach_change_pct,
      CASE 
        WHEN previous_data.impressions > 0 
        THEN ROUND(((current_data.impressions - previous_data.impressions) / previous_data.impressions) * 100, 1)
        ELSE 0 
      END as impressions_change_pct
    FROM current_data
    CROSS JOIN previous_data
  `
}

// Helper function to format percentage change
export function formatPercentageChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

// Helper function to format large numbers
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}