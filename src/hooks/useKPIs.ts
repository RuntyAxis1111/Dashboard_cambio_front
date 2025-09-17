import { useState, useEffect } from 'react'

interface KPIData {
  totalFollowers: number
  engagementRate: number
  reach: number
  impressions: number
  change: {
    followers: string
    engagement: string
    reach: string
    impressions: string
  }
  trend: {
    followers: 'up' | 'down'
    engagement: 'up' | 'down'
    reach: 'up' | 'down'
    impressions: 'up' | 'down'
  }
}

export function useKPIs(project: string, platform: string, dateRange?: { start: string; end: string }) {
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchKPIs() {
      if (!project || !platform) return

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          project,
          platform,
          ...(dateRange && {
            start_date: dateRange.start,
            end_date: dateRange.end
          })
        })

        const response = await fetch(`/api/bigquery/kpis?${params}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const kpiData = await response.json()
        
        // Transform BigQuery data to KPI format
        const transformedData: KPIData = {
          totalFollowers: kpiData.total_followers || 0,
          engagementRate: kpiData.engagement_rate || 0,
          reach: kpiData.reach || 0,
          impressions: kpiData.impressions || 0,
          change: {
            followers: kpiData.followers_change || '+0%',
            engagement: kpiData.engagement_change || '+0%',
            reach: kpiData.reach_change || '+0%',
            impressions: kpiData.impressions_change || '+0%'
          },
          trend: {
            followers: kpiData.followers_change?.startsWith('+') ? 'up' : 'down',
            engagement: kpiData.engagement_change?.startsWith('+') ? 'up' : 'down',
            reach: kpiData.reach_change?.startsWith('+') ? 'up' : 'down',
            impressions: kpiData.impressions_change?.startsWith('+') ? 'up' : 'down'
          }
        }
        
        setData(transformedData)
      } catch (err) {
        console.error('Error fetching KPIs:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        
        // Fallback to mock data in case of error
        setData({
          totalFollowers: 2400000,
          engagementRate: 4.8,
          reach: 18200000,
          impressions: 45600000,
          change: {
            followers: '+12.5%',
            engagement: '+0.3%',
            reach: '-2.1%',
            impressions: '+8.7%'
          },
          trend: {
            followers: 'up',
            engagement: 'up',
            reach: 'down',
            impressions: 'up'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [project, platform, dateRange])

  return { data, loading, error }
}

// Helper function to format numbers
export function formatKPIValue(value: number, type: 'followers' | 'rate' | 'reach' | 'impressions'): string {
  if (type === 'rate') {
    return `${value.toFixed(1)}%`
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  
  return value.toString()
}