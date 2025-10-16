import { formatNumber } from '../../lib/report-utils'

interface TopPost {
  texto: string
  valor: number
  categoria: string
  url?: string | null
  imagen_url?: string | null
  orden: number
}

interface TopPostsSectionProps {
  posts: TopPost[]
}

export function TopPostsSection({ posts }: TopPostsSectionProps) {
  if (posts.length === 0) return null

  const igPosts = posts.filter(p => p.categoria === 'top_ig').sort((a, b) => a.orden - b.orden)
  const ttPosts = posts.filter(p => p.categoria === 'top_tt').sort((a, b) => a.orden - b.orden)
  const ytPosts = posts.filter(p => p.categoria === 'top_yt').sort((a, b) => a.orden - b.orden)

  const maxRows = Math.max(igPosts.length, ttPosts.length, ytPosts.length)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 overflow-x-auto">
      <div className="grid grid-cols-3 gap-4 min-w-[600px]">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">IG</h4>
          <div className="space-y-3">
            {igPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">TikTok</h4>
          <div className="space-y-3">
            {ttPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">YTS</h4>
          <div className="space-y-3">
            {ytPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post }: { post: TopPost }) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{post.texto}</p>
      <p className="text-xs font-semibold text-gray-900">
        {formatNumber(post.valor)} views
      </p>
    </div>
  )

  if (post.url) {
    return (
      <a href={post.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
