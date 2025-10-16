import { formatNumber } from '../../lib/report-utils'
import { ExternalLink } from 'lucide-react'

interface TopContentItem {
  titulo: string
  url: string | null
  vistas: number | null
  plataforma: string
}

interface MVViewsSectionProps {
  mainMetric: { valor: number } | null
  topContent: TopContentItem[]
}

export function MVViewsSection({ mainMetric, topContent }: MVViewsSectionProps) {
  const instagramPosts = topContent.filter(i => i.plataforma === 'instagram').slice(0, 3)
  const tiktokPosts = topContent.filter(i => i.plataforma === 'tiktok').slice(0, 3)
  const youtubePosts = topContent.filter(i => i.plataforma === 'youtube').slice(0, 3)

  return (
    <div className="space-y-6">
      {mainMetric && (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-2xl p-8 text-center">
          <h4 className="text-lg font-medium text-gray-600 mb-2">Total MV Views (48h)</h4>
          <div className="text-5xl font-bold text-black">{formatNumber(mainMetric.valor)}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {instagramPosts.length > 0 && (
          <div>
            <h5 className="font-semibold text-black mb-3">Top Instagram</h5>
            <div className="space-y-3">
              {instagramPosts.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-300 rounded-xl p-4">
                  <div className="text-sm font-medium text-black mb-1 line-clamp-2">{item.titulo}</div>
                  {item.vistas != null && (
                    <div className="text-xs text-gray-600 mb-2">{formatNumber(item.vistas)} views</div>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tiktokPosts.length > 0 && (
          <div>
            <h5 className="font-semibold text-black mb-3">Top TikTok</h5>
            <div className="space-y-3">
              {tiktokPosts.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-300 rounded-xl p-4">
                  <div className="text-sm font-medium text-black mb-1 line-clamp-2">{item.titulo}</div>
                  {item.vistas != null && (
                    <div className="text-xs text-gray-600 mb-2">{formatNumber(item.vistas)} views</div>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {youtubePosts.length > 0 && (
          <div>
            <h5 className="font-semibold text-black mb-3">Top YouTube</h5>
            <div className="space-y-3">
              {youtubePosts.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-300 rounded-xl p-4">
                  <div className="text-sm font-medium text-black mb-1 line-clamp-2">{item.titulo}</div>
                  {item.vistas != null && (
                    <div className="text-xs text-gray-600 mb-2">{formatNumber(item.vistas)} views</div>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {instagramPosts.length === 0 && tiktokPosts.length === 0 && youtubePosts.length === 0 && !mainMetric && (
        <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
          <p className="text-gray-500 text-center">No MV views data available yet</p>
        </div>
      )}
    </div>
  )
}
