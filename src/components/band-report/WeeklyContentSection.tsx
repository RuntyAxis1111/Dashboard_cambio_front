import { useState } from 'react'
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ContentItem {
  id?: string
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
  const [editedItems, setEditedItems] = useState<ContentItem[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setEditedItems(items.map(i => ({ ...i })))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedItems([])
  }

  const handleAddItem = (platform: string) => {
    const newItem: ContentItem = {
      id: `temp-${Date.now()}`,
      posicion: editedItems.filter(i => i.plataforma === platform).length,
      plataforma: platform,
      titulo: '',
      texto: '',
      link_url: ''
    }
    setEditedItems([...editedItems, newItem])
  }

  const handleDeleteItem = (itemId: string) => {
    setEditedItems(editedItems.filter(i => i.id !== itemId))
  }

  const handleItemChange = (itemId: string, field: keyof ContentItem, value: string) => {
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
        .eq('categoria', 'contenido_semanal')

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
          categoria: 'contenido_semanal',
          plataforma: item.plataforma,
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
      console.error('Error saving weekly content:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (items.length === 0 && !isEditing) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const displayItems = isEditing ? editedItems : items
  const sortedItems = [...displayItems].sort((a, b) => {
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
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      {entidadId && (
        <div className="px-4 py-2 border-b border-gray-300 flex justify-end print:hidden">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Content Recap
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
                {isSaving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-6">
        {Object.entries(groupedByPlatform).map(([platform, platformItems]) => (
          <div key={platform}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {PLATFORM_LABELS[platform] || platform}
              </h4>
              {isEditing && (
                <button
                  onClick={() => handleAddItem(platform)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Item
                </button>
              )}
            </div>
            <ul className="space-y-3">
              {platformItems.map((item, idx) => (
                <ContentItemCard
                  key={item.id || idx}
                  item={item}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onItemChange={handleItemChange}
                  onDelete={handleDeleteItem}
                />
              ))}
            </ul>
          </div>
        ))}

        {isEditing && (
          <div className="pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Add items for different platforms: YouTube, Instagram, or TikTok
            </p>
            <div className="flex gap-2 mt-2">
              {['youtube', 'instagram', 'tiktok'].map(platform => (
                <button
                  key={platform}
                  onClick={() => handleAddItem(platform)}
                  className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  Add {PLATFORM_LABELS[platform]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ContentItemCardProps {
  item: ContentItem
  isEditing: boolean
  isSaving: boolean
  onItemChange: (itemId: string, field: keyof ContentItem, value: string) => void
  onDelete: (itemId: string) => void
}

function ContentItemCard({ item, isEditing, isSaving, onItemChange, onDelete }: ContentItemCardProps) {
  if (isEditing && item.id) {
    return (
      <li className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Title (optional)</label>
              <input
                type="text"
                value={item.titulo || ''}
                onChange={(e) => onItemChange(item.id!, 'titulo', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isSaving}
                placeholder="Video title or content title"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Description</label>
              <textarea
                value={item.texto || ''}
                onChange={(e) => onItemChange(item.id!, 'texto', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isSaving}
                placeholder="Content description"
                rows={2}
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
    <li className="flex items-start text-sm">
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
  )
}
