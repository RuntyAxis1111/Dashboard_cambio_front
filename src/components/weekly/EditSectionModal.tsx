import { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, ExternalLink } from 'lucide-react'

export interface EditableItem {
  id?: string
  titulo: string
  texto: string
  url?: string
  link_url?: string
  posicion?: number
  plataforma?: string
}

interface EditSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (items: EditableItem[]) => Promise<void>
  items: EditableItem[]
  title: string
  showPlatform?: boolean
}

export function EditSectionModal({
  isOpen,
  onClose,
  onSave,
  items: initialItems,
  title,
  showPlatform = false
}: EditSectionModalProps) {
  const [items, setItems] = useState<EditableItem[]>(initialItems)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems, isOpen])

  if (!isOpen) return null

  const handleAddItem = () => {
    const newItem: EditableItem = {
      titulo: '',
      texto: '',
      url: '',
      posicion: items.length,
      ...(showPlatform && { plataforma: 'youtube' })
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, field: keyof EditableItem, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(items)
      onClose()
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit {title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border border-gray-300 rounded-xl p-4 space-y-4 relative">
              <button
                onClick={() => handleRemoveItem(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                disabled={isSaving}
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pr-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title {showPlatform ? '(Optional)' : ''}
                </label>
                <input
                  type="text"
                  value={item.titulo || ''}
                  onChange={(e) => handleUpdateItem(index, 'titulo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter title"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text
                </label>
                <textarea
                  value={item.texto || ''}
                  onChange={(e) => handleUpdateItem(index, 'texto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter text content"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  value={item.url || item.link_url || ''}
                  onChange={(e) => handleUpdateItem(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  disabled={isSaving}
                />
              </div>

              {showPlatform && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={item.plataforma || 'youtube'}
                    onChange={(e) => handleUpdateItem(index, 'plataforma', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddItem}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            disabled={isSaving}
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
