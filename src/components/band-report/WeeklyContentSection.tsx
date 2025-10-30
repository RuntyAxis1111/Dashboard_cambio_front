import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { EditSectionModal, EditableItem } from '../weekly/EditSectionModal'
import { supabase } from '../../lib/supabase'

interface ContentItem {
  posicion: number
  plataforma: string
  titulo: string | null
  texto: string
  link_url?: string | null
  imagen_url?: string | null
}

interface WeeklyContentSectionProps {
  items: ContentItem[]
  entidadId?: string
  onUpdate?: () => void
}

const PLATFORM_LABELS: Record<string, string> = {
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
}

export function WeeklyContentSection({ items, entidadId, onUpdate }: WeeklyContentSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (updatedItems: EditableItem[]) => {
    if (!entidadId) return

    try {
      const { data: existingItems } = await supabase
        .from('reportes_items')
        .select('id')
        .eq('entidad_id', entidadId)
        .eq('categoria', 'contenido_semanal')

      if (existingItems) {
        await supabase
          .from('reportes_items')
          .delete()
          .in('id', existingItems.map(i => i.id))
      }

      const newItems = updatedItems.map((item, index) => ({
        entidad_id: entidadId,
        categoria: 'contenido_semanal',
        plataforma: item.plataforma || 'youtube',
        posicion: index,
        titulo: item.titulo || '',
        texto: item.texto || '',
        url: item.url || item.link_url || null
      }))

      if (newItems.length > 0) {
        const { error } = await supabase
          .from('reportes_items')
          .insert(newItems)

        if (error) throw error
      }

      onUpdate?.()
    } catch (error) {
      console.error('Error saving weekly content:', error)
      throw error
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
        {entidadId && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <Edit2 className="w-4 h-4" />
            Add Content
          </button>
        )}
      </div>
    )
  }

  const editableItems: EditableItem[] = items.map(item => ({
    titulo: item.titulo || '',
    texto: item.texto,
    url: item.link_url || '',
    posicion: item.posicion,
    plataforma: item.plataforma
  }))

  const sortedItems = [...items].sort((a, b) => {
    if (a.plataforma !== b.plataforma) {
      return a.plataforma.localeCompare(b.plataforma)
    }
    return a.posicion - b.posicion
  })

  const groupedByPlatform = sortedItems.reduce((acc, item) => {
    if (!acc[item.plataforma]) {
      acc[item.plataforma] = []
    }
    acc[item.plataforma].push(item)
    return acc
  }, {} as Record<string, ContentItem[]>)

  return (
    <>
      {isEditing && (
        <EditSectionModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          items={editableItems}
          title="Weekly Content Recap"
          showPlatform={true}
        />
      )}

      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
      {Object.entries(groupedByPlatform).map(([platform, platformItems]) => (
        <div key={platform}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {PLATFORM_LABELS[platform] || platform}
          </h4>
          <ul className="space-y-3">
            {platformItems.map((item, idx) => (
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
      ))}

      {entidadId && (
        <div className="mt-6 pt-4 border-t border-gray-300">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 print:hidden"
          >
            <Edit2 className="w-4 h-4" />
            Edit Content Recap
          </button>
        </div>
      )}
    </div>
    </>
  )
}
