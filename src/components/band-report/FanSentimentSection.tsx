import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { EditSectionModal, EditableItem } from '../weekly/EditSectionModal'
import { supabase } from '../../lib/supabase'

interface SentimentItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
  por_que_importa?: string | null
}

interface FanSentimentSectionProps {
  items: SentimentItem[]
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
        titulo: item.titulo || null,
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

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
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

  const sortedItems = [...items]
    .filter(item => item.texto && item.texto.trim() !== '')
    .sort((a, b) => a.posicion - b.posicion)

  const editableItems: EditableItem[] = sortedItems.map(item => ({
    titulo: item.titulo || '',
    texto: item.texto,
    url: item.link_url || '',
    posicion: item.posicion
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

      <div className="space-y-4">
      {sortedItems.map((item, idx) => (
        <div key={idx} className="bg-white border border-gray-300 rounded-2xl p-6">
          {item.titulo && (
            <h4 className="font-semibold text-black mb-2">
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
            </h4>
          )}
          <p className="text-gray-700 mb-3">{item.texto}</p>
          {item.por_que_importa && (
            <div className="bg-gray-50 border-l-4 border-gray-400 pl-4 py-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Why it matters:</span> {item.por_que_importa}
              </p>
            </div>
          )}
        </div>
      ))}

      {entidadId && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 print:hidden"
        >
          <Edit2 className="w-4 h-4" />
          Edit Fan Sentiment
        </button>
      )}
    </div>
    </>
  )
}
