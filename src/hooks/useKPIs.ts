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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data based on project and platform
        const mockData = getMockKPIData(project, platform)
        setData(mockData)
      } catch (err) {
        console.error('Error fetching KPIs:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [project, platform, dateRange])

  return { data, loading, error }
}

// Mock data generator
function getMockKPIData(project: string, platform: string): KPIData {
  const baseData = {
    palf: {
      facebook: {
        totalFollowers: 2400000,
        engagementRate: 4.8,
        reach: 18200000,
        impressions: 45600000,
        change: { followers: '+12.5%', engagement: '+0.3%', reach: '-2.1%', impressions: '+8.7%' }
      },
      instagram: {
        totalFollowers: 3200000,
        engagementRate: 6.2,
        reach: 24500000,
        impressions: 52300000,
        change: { followers: '+15.2%', engagement: '+1.1%', reach: '+3.4%', impressions: '+12.1%' }
      },
      twitter: {
        totalFollowers: 1800000,
        engagementRate: 3.4,
        reach: 12400000,
        impressions: 28900000,
        change: { followers: '+8.7%', engagement: '-0.5%', reach: '-1.2%', impressions: '+5.3%' }
      }
    },
    bts: {
      facebook: {
        totalFollowers: 45600000,
        engagementRate: 8.9,
        reach: 125000000,
        impressions: 289000000,
        change: { followers: '+5.2%', engagement: '+2.1%', reach: '+7.8%', impressions: '+15.4%' }
      },
      instagram: {
        totalFollowers: 52300000,
        engagementRate: 12.4,
        reach: 156000000,
        impressions: 345000000,
        change: { followers: '+7.8%', engagement: '+3.2%', reach: '+9.1%', impressions: '+18.7%' }
      },
      twitter: {
        totalFollowers: 38900000,
        engagementRate: 6.7,
        reach: 98500000,
        impressions: 234000000,
        change: { followers: '+4.3%', engagement: '+1.8%', reach: '+5.6%', impressions: '+11.2%' }
      }
    },
    kocky_ka: {
      tiktok: {
        totalFollowers: 850000,
        engagementRate: 15.2,
        reach: 12400000,
        impressions: 28900000,
        change: { followers: '+25.8%', engagement: '+4.2%', reach: '+18.3%', impressions: '+32.1%' }
      }
    }
  }

  const projectData = baseData[project as keyof typeof baseData]
  const platformData = projectData?.[platform as keyof typeof projectData]

  if (!platformData) {
    // Default fallback data
    return {
      totalFollowers: 1000000,
      engagementRate: 5.0,
      reach: 8000000,
      impressions: 20000000,
      change: { followers: '+10.0%', engagement: '+2.0%', reach: '+5.0%', impressions: '+8.0%' },
      trend: { followers: 'up', engagement: 'up', reach: 'up', impressions: 'up' }
    }
  }

  return {
    ...platformData,
    trend: {
      followers: platformData.change.followers.startsWith('+') ? 'up' : 'down',
      engagement: platformData.change.engagement.startsWith('+') ? 'up' : 'down',
      reach: platformData.change.reach.startsWith('+') ? 'up' : 'down',
      impressions: platformData.change.impressions.startsWith('+') ? 'up' : 'down'
    }
  }
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