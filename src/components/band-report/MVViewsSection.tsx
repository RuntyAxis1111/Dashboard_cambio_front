import { formatNumberCompact } from '../../lib/report-utils'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface MVItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
}

interface YouTubeGeneralData {
  subscribers: number
  total_views: number
  total_watch_time: number
  total_likes: number
  total_comments: number
}

interface MVViewsSectionProps {
  items: MVItem[]
  entidadId: string
}

export function MVViewsSection({ items, entidadId }: MVViewsSectionProps) {
  const [youtubeData, setYoutubeData] = useState<YouTubeGeneralData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadYouTubeData() {
      try {
        const { data, error } = await supabase
          .from('reportes_youtube_general')
          .select('subscribers, total_views, total_watch_time, total_likes, total_comments')
          .eq('entidad_id', entidadId)
          .maybeSingle()

        if (error) throw error
        setYoutubeData(data)
      } catch (err) {
        console.error('Error loading YouTube data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadYouTubeData()
  }, [entidadId])

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data available yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)

  const kpiCards = [
    { label: 'Subscribers', value: youtubeData?.subscribers || 0 },
    { label: 'Total Views', value: youtubeData?.total_views || 0 },
    { label: 'Total Watch Time', value: youtubeData?.total_watch_time || 0 },
    { label: 'Total Likes', value: youtubeData?.total_likes || 0 },
    { label: 'Total Comments', value: youtubeData?.total_comments || 0 }
  ]

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <div className="grid grid-cols-5 gap-3 mb-6">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
            <div className="text-lg font-semibold text-black">
              {loading ? '...' : formatNumberCompact(kpi.value)}
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-base font-semibold text-black mb-4">Top 5 Videos In Youtube Of Last Week</h4>
      <ul className="space-y-2">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="flex items-start text-sm">
            <span className="mr-2 text-gray-500">•</span>
            <div className="flex-1">
              {item.titulo && (
                <div className="font-medium text-black mb-1">
                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {item.titulo}
                    </a>
                  ) : (
                    item.titulo
                  )}
                </div>
              )}
              <div className="text-gray-700">{item.texto}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
