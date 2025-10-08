import { ExternalLink, Play } from 'lucide-react'

interface MVEntry {
  title: string
  total_views: number
  link: string
}

interface MVViewsSectionProps {
  videos: MVEntry[]
}

export function MVViewsSection({ videos }: MVViewsSectionProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No music video data available for this week</p>
      </div>
    )
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-2">
      {videos.map((video, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{video.title}</div>
              <div className="text-sm text-gray-600">{formatNumber(video.total_views)} views</div>
            </div>
          </div>
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
          >
            Watch
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ))}
    </div>
  )
}
