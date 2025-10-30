import { useState } from 'react'
import { ExternalLink, Quote, Edit2 } from 'lucide-react'
import { EditSectionModal, EditableItem } from './EditSectionModal'
import { supabase } from '../../lib/supabase'

interface FanSentimentItem {
  image_url?: string
  quote?: string
  source_url?: string
}

interface FanSentimentSectionProps {
  items: FanSentimentItem[]
  entidadId?: string
  onUpdate?: () => void
}

export function FanSentimentSection({ items, entidadId, onUpdate }: FanSentimentSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (updatedItems: EditableItem[]) => {
    if (!entidadId) return

    try {
      const { data: existingItems } = await supabase
        .from('reportes_items')
        .select('id')
        .eq('entidad_id', entidadId)
        .eq('categoria', 'fan_sentiment')

      if (existingItems) {
        await supabase
          .from('reportes_items')
          .delete()
          .in('id', existingItems.map(i => i.id))
      }

      const newItems = updatedItems.map((item, index) => ({
        entidad_id: entidadId,
        categoria: 'fan_sentiment',
        plataforma: 'social',
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
      console.error('Error saving fan sentiment:', error)
      throw error
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No fan sentiment data for this week</p>
        {entidadId && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <Edit2 className="w-4 h-4" />
            Add Fan Sentiment
          </button>
        )}
      </div>
    )
  }

  const editableItems: EditableItem[] = items.map((item, index) => ({
    titulo: '',
    texto: item.quote || '',
    url: item.source_url || '',
    posicion: index
  }))

  return (
    <>
      {isEditing && (
        <EditSectionModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          items={editableItems}
          title="Fan Sentiment"
          showPlatform={false}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-600 transition-colors">
          {item.image_url && (
            <div className="aspect-video bg-gray-100">
              <img
                src={item.image_url}
                alt={item.quote || 'Fan content'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            {item.quote && (
              <div className="flex gap-2 mb-2">
                <Quote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-900 italic">{item.quote}</p>
              </div>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
              >
                View Source
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}

      {entidadId && (
        <div className="col-span-full mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 print:hidden"
          >
            <Edit2 className="w-4 h-4" />
            Edit Fan Sentiment
          </button>
        </div>
      )}
    </div>
    </>
  )
}
