import { Hash, TrendingUp, Video } from 'lucide-react'

interface TikTokPost {
  url?: string
  views?: number
  likes?: number
  creator?: string
}

interface TikTokTrendsRendererProps {
  data: {
    track?: string
    total_videos?: number
    total_views?: number
    trending_sounds?: { name: string; videos: number }[]
    top_posts?: TikTokPost[]
    summary?: string
    notes?: string
  }
}

export function TikTokTrendsRenderer({ data }: TikTokTrendsRendererProps) {
  return (
    <div className="space-y-6">
      {data.summary && (
        <p className="text-gray-700 leading-relaxed bg-pink-50 p-4 rounded-lg border border-pink-200">
          {data.summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.total_videos != null && (
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Total Videos</span>
            </div>
            <div className="text-3xl font-bold">
              {data.total_videos.toLocaleString()}
            </div>
          </div>
        )}

        {data.total_views != null && (
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Total Views</span>
            </div>
            <div className="text-3xl font-bold">
              {data.total_views.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {data.trending_sounds && data.trending_sounds.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Trending Sounds
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.trending_sounds.map((sound, index) => (
              <div key={index} className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <div className="font-medium text-black">{sound.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {sound.videos != null ? sound.videos.toLocaleString() : 0} videos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.top_posts && data.top_posts.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-black mb-3">Top Posts</h4>
          <div className="space-y-3">
            {data.top_posts.map((post, index) => (
              <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {post.creator && (
                      <div className="font-medium text-black mb-1">@{post.creator}</div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {post.views != null && (
                        <span>{post.views.toLocaleString()} views</span>
                      )}
                      {post.likes != null && (
                        <span>{post.likes.toLocaleString()} likes</span>
                      )}
                    </div>
                  </div>
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.notes && (
        <div className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
          {data.notes}
        </div>
      )}
    </div>
  )
}
