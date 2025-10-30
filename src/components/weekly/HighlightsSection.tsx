import { useState } from 'react'
import { ExternalLink, CheckCircle2, Edit2 } from 'lucide-react'
import { EditSectionModal, EditableItem } from './EditSectionModal'
import { supabase } from '../../lib/supabase'

interface Highlight {
  text: string
  link?: string
}

interface HighlightsSectionProps {
  items: Highlight[]
  entidadId?: string
  onUpdate?: () => void
}

function formatTextWithColoredPercentages(text: string) {
  console.log('Original text:', text)
  // Match patterns like (+6,527,823; +318.3%) or (-1,234; -5.6%)
  const percentageRegex = /(\([+\-][\d,]+;\s*[+\-][\d.]+%\))/g
  const parts = text.split(percentageRegex)
  console.log('Split parts:', parts)

  return parts.map((part, idx) => {
    // Check if this part matches our percentage pattern by testing if it starts with (+ or (-
    if (part.startsWith('(+') || part.startsWith('(-')) {
      const isPositive = part.startsWith('(+')
      const colorClass = isPositive ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
      console.log('Matched part:', part, 'isPositive:', isPositive, 'class:', colorClass)
      return (
        <span key={idx} className={colorClass}>
          {part}
        </span>
      )
    }
    return <span key={idx}>{part}</span>
  })
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
      console.error('Error saving highlights:', error)
      throw error
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No highlights for this week</p>
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

  const editableItems: EditableItem[] = items.map((item, index) => ({
    titulo: '',
    texto: item.text,
    url: item.link,
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
          title="Highlights / Overall Summary"
          showPlatform={false}
        />
      )}

      <div className="space-y-3">
      {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-900">
                {formatTextWithColoredPercentages(item.text)}
              </span>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
      ))}

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
