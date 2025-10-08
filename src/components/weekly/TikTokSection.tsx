import { ExternalLink, TrendingUp } from 'lucide-react'

interface TikTokMetric {
  track_name: string
  daily_creates: number
  total_creates: number
}

interface TikTokPost {
  title: string
  views: number
  link: string
  creator?: string
}

interface TikTokSectionProps {
  metrics?: TikTokMetric[]
  top_posts?: TikTokPost[]
}

export function TikTokSection({ metrics, top_posts }: TikTokSectionProps) {
  if ((!metrics || metrics.length === 0) && (!top_posts || top_posts.length === 0)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No TikTok data available for this week</p>
      </div>
    )
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {metrics && metrics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Create Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-3">{metric.track_name}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Daily Creates</div>
                    <div className="text-lg font-semibold text-black">
                      {formatNumber(metric.daily_creates)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Creates</div>
                    <div className="text-lg font-semibold text-black">
                      {formatNumber(metric.total_creates)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {top_posts && top_posts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Posts</h4>
          <div className="space-y-2">
            {top_posts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    {post.creator && <span>{post.creator}</span>}
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {formatNumber(post.views)} views
                    </span>
                  </div>
                </div>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
