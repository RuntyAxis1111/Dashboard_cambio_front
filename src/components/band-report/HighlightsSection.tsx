import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { EditSectionModal, EditableItem } from '../weekly/EditSectionModal'
import { supabase } from '../../lib/supabase'

interface HighlightItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
}

interface HighlightsSectionProps {
  items: HighlightItem[]
  entidadId?: string
  onUpdate?: () => void
}

export function HighlightsSection({ items, entidadId, onUpdate }: HighlightsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (updatedItems: EditableItem[]) => {
    if (!entidadId) return

    try {
      const { data: existingItems } = await supabase
        .from('reportes_items')
        .select('id')
        .eq('entidad_id', entidadId)
        .eq('categoria', 'highlights')

      if (existingItems) {
        await supabase
          .from('reportes_items')
          .delete()
          .in('id', existingItems.map(i => i.id))
      }

      const newItems = updatedItems.map((item, index) => ({
        entidad_id: entidadId,
        categoria: 'highlights',
        plataforma: 'general',
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
      console.error('Error saving highlights:', error)
      throw error
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No data available yet</p>
        {entidadId && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <Edit2 className="w-4 h-4" />
            Add Highlights
          </button>
        )}
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)
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
          title="Highlights"
          showPlatform={false}
        />
      )}

      <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <ul className="space-y-3">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-gray-600 font-medium">•</span>
            <div>
              {item.titulo && (
                <>
                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-black hover:text-blue-600"
                    >
                      {item.titulo}
                    </a>
                  ) : (
                    <span className="font-semibold text-black">{item.titulo}</span>
                  )}
                  <span>: </span>
                </>
              )}
              <span className="text-gray-700">{item.texto}</span>
            </div>
          </li>
        ))}
      </ul>

      {entidadId && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 print:hidden"
        >
          <Edit2 className="w-4 h-4" />
          Edit Highlights
        </button>
      )}
    </div>
    </>
  )
}
