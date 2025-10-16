import { formatNumberCompact } from '../../lib/report-utils'

interface TopPost {
  posicion: number
  plataforma: string
  titulo: string | null
  texto: string
  url?: string | null
  vistas?: number | null
}

interface TopPostsSectionProps {
  posts: TopPost[]
}

export function TopPostsSection({ posts }: TopPostsSectionProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const igPosts = posts.filter(p => p.plataforma === 'instagram').sort((a, b) => a.posicion - b.posicion)
  const ttPosts = posts.filter(p => p.plataforma === 'tiktok').sort((a, b) => a.posicion - b.posicion)
  const ytPosts = posts.filter(p => p.plataforma === 'youtube').sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[600px]">
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
      {post.titulo && (
        <p className="text-xs font-medium text-black mb-1 line-clamp-2">{post.titulo}</p>
      )}
      <p className="text-xs text-gray-600 line-clamp-2">{post.texto}</p>
    </div>
  )

  if (post.url) {
    return (
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}
