import { formatNumberCompact } from '../../lib/report-utils'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Edit2, Save, X } from 'lucide-react'

interface MVItem {
  id?: string
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
  total_monetized?: number
}

interface MVViewsSectionProps {
  items: MVItem[]
  entidadId: string
  onUpdate?: () => void
}

export function MVViewsSection({ items, entidadId, onUpdate }: MVViewsSectionProps) {
  const [youtubeData, setYoutubeData] = useState<YouTubeGeneralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditingKPIs, setIsEditingKPIs] = useState(false)
  const [isEditingVideos, setIsEditingVideos] = useState(false)
  const [editedYoutubeData, setEditedYoutubeData] = useState<YouTubeGeneralData | null>(null)
  const [editedItems, setEditedItems] = useState<MVItem[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadYouTubeData() {
      try {
        const { data, error } = await supabase
          .from('reportes_youtube_general')
          .select('subscribers, total_views, total_watch_time, total_likes, total_comments, total_monetized')
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

  const handleEditKPIs = () => {
    setEditedYoutubeData(youtubeData ? { ...youtubeData } : {
      subscribers: 0,
      total_views: 0,
      total_watch_time: 0,
      total_likes: 0,
      total_comments: 0,
      total_monetized: 0
    })
    setIsEditingKPIs(true)
  }

  const handleEditVideos = () => {
    setEditedItems(items.map(item => ({ ...item })))
    setIsEditingVideos(true)
  }

  const handleCancelKPIs = () => {
    setIsEditingKPIs(false)
    setEditedYoutubeData(null)
  }

  const handleCancelVideos = () => {
    setIsEditingVideos(false)
    setEditedItems([])
  }

  const handleSaveKPIs = async () => {
    if (!editedYoutubeData) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('reportes_youtube_general')
        .update(editedYoutubeData)
        .eq('entidad_id', entidadId)

      if (error) throw error

      setYoutubeData(editedYoutubeData)
      setIsEditingKPIs(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving YouTube KPIs:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveVideos = async () => {
    setIsSaving(true)

    try {
      for (const item of editedItems) {
        if (item.id) {
          const { error } = await supabase
            .from('reportes_items')
            .update({
              titulo: item.titulo,
              texto: item.texto,
              link_url: item.link_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id)

          if (error) throw error
        }
      }

      setIsEditingVideos(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving videos:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKPIChange = (field: keyof YouTubeGeneralData, value: string) => {
    if (!editedYoutubeData) return
    setEditedYoutubeData({
      ...editedYoutubeData,
      [field]: value === '' ? 0 : parseFloat(value)
    })
  }

  const handleVideoChange = (index: number, field: keyof MVItem, value: string) => {
    setEditedItems(prev => prev.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    ))
  }

  const sortedItems = items.length > 0 ? [...items].sort((a, b) => a.posicion - b.posicion) : []
  const displayItems = isEditingVideos ? editedItems : sortedItems

  const kpiCards = [
    { label: 'Subscribers', value: 'subscribers', displayValue: youtubeData?.subscribers || 0 },
    { label: 'Total Views', value: 'total_views', displayValue: youtubeData?.total_views || 0 },
    { label: 'Total Watch Time', value: 'total_watch_time', displayValue: youtubeData?.total_watch_time || 0 },
    { label: 'Total Likes', value: 'total_likes', displayValue: youtubeData?.total_likes || 0 },
    { label: 'Total Comments', value: 'total_comments', displayValue: youtubeData?.total_comments || 0 },
    { label: 'Total Monetized', value: 'total_monetized', displayValue: youtubeData?.total_monetized || 0 }
  ].filter(kpi => {
    if (kpi.value === 'total_monetized') {
      return youtubeData?.total_monetized && youtubeData.total_monetized > 0
    }
    return true
  })

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-300 flex justify-end print:hidden">
        {!isEditingKPIs && !isEditingVideos && (
          <div className="flex gap-2">
            <button
              onClick={handleEditKPIs}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit KPIs
            </button>
            <button
              onClick={handleEditVideos}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Videos
            </button>
          </div>
        )}

        {isEditingKPIs && (
          <div className="flex gap-2">
            <button
              onClick={handleCancelKPIs}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveKPIs}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save KPIs'}
            </button>
          </div>
        )}

        {isEditingVideos && (
          <div className="flex gap-2">
            <button
              onClick={handleCancelVideos}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveVideos}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Videos'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className={`grid gap-3 mb-6 ${kpiCards.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}>
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
              <div className="text-lg font-semibold text-black">
                {isEditingKPIs ? (
                  <input
                    type="number"
                    value={editedYoutubeData?.[kpi.value as keyof YouTubeGeneralData] || 0}
                    onChange={(e) => handleKPIChange(kpi.value as keyof YouTubeGeneralData, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    disabled={isSaving}
                  />
                ) : (
                  loading ? '...' : formatNumberCompact(kpi.displayValue)
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedItems.length > 0 && (
          <>
            <h4 className="text-base font-semibold text-black mb-4">Top 5 Videos In Youtube Of Last Week</h4>

            {isEditingVideos ? (
          <div className="space-y-4">
            {displayItems.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.titulo || ''}
                      onChange={(e) => handleVideoChange(idx, 'titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      disabled={isSaving}
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description (views)</label>
                    <input
                      type="text"
                      value={item.texto || ''}
                      onChange={(e) => handleVideoChange(idx, 'texto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      disabled={isSaving}
                      placeholder="e.g. 80,911 views"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">URL (optional)</label>
                    <input
                      type="url"
                      value={item.link_url || ''}
                      onChange={(e) => handleVideoChange(idx, 'link_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      disabled={isSaving}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {displayItems.map((item, idx) => (
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
        )}
          </>
        )}
      </div>
    </div>
  )
}
