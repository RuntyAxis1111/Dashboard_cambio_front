import { formatNumberCompact } from '../../lib/report-utils'

interface TopPost {
  posicion: number
  plataforma: string
  titulo: string | null
  texto: string
  link_url?: string | null
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
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <img src="/assets/instagram.png" alt="Instagram" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700">IG</h4>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {igPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <img src="/assets/tik-tok (1).png" alt="TikTok" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700">TikTok</h4>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {ttPosts.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <img src="/assets/youtube (1).png" alt="YouTube" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700">YTS</h4>
          </div>
          <div className="space-y-2 sm:space-y-3">
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
  const linkUrl = post.link_url || post.url

  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-sm transition-shadow">
      {post.titulo && (
        <p className="text-xs font-medium text-black mb-1 line-clamp-2">
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {post.titulo}
            </a>
          ) : (
            post.titulo
          )}
        </p>
      )}
      <p className="text-xs text-gray-600 line-clamp-3">{post.texto}</p>
    </div>
  )

  return content
}
