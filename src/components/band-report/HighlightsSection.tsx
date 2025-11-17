import { useState } from 'react'
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface HighlightItem {
  id?: string
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
  const [editedItems, setEditedItems] = useState<HighlightItem[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setEditedItems(items.map(i => ({ ...i })))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedItems([])
  }

  const handleAddItem = () => {
    const newItem: HighlightItem = {
      id: `temp-${Date.now()}`,
      posicion: editedItems.length,
      titulo: '',
      texto: '',
      link_url: ''
    }
    setEditedItems([...editedItems, newItem])
  }

  const handleDeleteItem = (itemId: string) => {
    setEditedItems(editedItems.filter(i => i.id !== itemId))
  }

  const handleItemChange = (itemId: string, field: keyof HighlightItem, value: string) => {
    setEditedItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  const handleSave = async () => {
    if (!entidadId) return
    setIsSaving(true)

    try {
      const { data: existingItems } = await supabase
        .from('reportes_items')
        .select('id')
        .eq('entidad_id', entidadId)
        .eq('categoria', 'highlights')

      if (existingItems && existingItems.length > 0) {
        await supabase
          .from('reportes_items')
          .delete()
          .in('id', existingItems.map(i => i.id))
      }

      const newItems = editedItems
        .filter(item => item.texto.trim() !== '')
        .map((item, index) => ({
          entidad_id: entidadId,
          categoria: 'highlights',
          plataforma: 'general',
          posicion: index,
          titulo: item.titulo || null,
          texto: item.texto,
          link_url: item.link_url || null
        }))

      if (newItems.length > 0) {
        const { error } = await supabase
          .from('reportes_items')
          .insert(newItems)

        if (error) throw error
      }

      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving highlights:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (items.length === 0 && !isEditing) {
    return (
      <div className="bg-white border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No data available yet</p>
      </div>
    )
  }

  const displayItems = isEditing ? editedItems : items
  const sortedItems = [...displayItems].sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
      {entidadId && (
        <div className="px-4 py-2 border-b border-gray-300 flex justify-end print:hidden">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Highlights
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Highlights'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <ul className="space-y-3">
          {sortedItems.map((item, idx) => (
            <HighlightItemCard
              key={item.id || idx}
              item={item}
              isEditing={isEditing}
              isSaving={isSaving}
              onItemChange={handleItemChange}
              onDelete={handleDeleteItem}
            />
          ))}
        </ul>

        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <button
              onClick={handleAddItem}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Highlight
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface HighlightItemCardProps {
  item: HighlightItem
  isEditing: boolean
  isSaving: boolean
  onItemChange: (itemId: string, field: keyof HighlightItem, value: string) => void
  onDelete: (itemId: string) => void
}

function HighlightItemCard({ item, isEditing, isSaving, onItemChange, onDelete }: HighlightItemCardProps) {
  if (isEditing && item.id) {
    return (
      <li className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Title (optional, bold text)</label>
              <input
                type="text"
                value={item.titulo || ''}
                onChange={(e) => onItemChange(item.id!, 'titulo', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isSaving}
                placeholder="e.g., TikTok views and interactions hit zero"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Description</label>
              <textarea
                value={item.texto || ''}
                onChange={(e) => onItemChange(item.id!, 'texto', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isSaving}
                placeholder="e.g., This week vs last week, TikTok views fell by -41,480 (-100.0%)..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">URL (optional)</label>
              <input
                type="url"
                value={item.link_url || ''}
                onChange={(e) => onItemChange(item.id!, 'link_url', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isSaving}
                placeholder="https://..."
              />
            </div>
          </div>
          <button
            onClick={() => onDelete(item.id!)}
            disabled={isSaving}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="flex gap-3">
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
  )
}
