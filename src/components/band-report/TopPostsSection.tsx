import { formatNumberCompact } from '../../lib/report-utils'
import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface TopPost {
  id?: string
  posicion: number
  plataforma: string
  titulo: string | null
  texto: string
  link_url?: string | null
  url?: string | null
  vistas?: number | null
}

interface TopPostsSectionProps {
  posts: TopPost[]
  entidadId?: string
  onUpdate?: () => void
}

export function TopPostsSection({ posts, entidadId, onUpdate }: TopPostsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPosts, setEditedPosts] = useState<TopPost[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const handleEdit = () => {
    setEditedPosts(posts.map(p => ({ ...p })))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedPosts([])
  }

  const handleSave = async () => {
    if (!entidadId) return
    setIsSaving(true)

    try {
      for (const post of editedPosts) {
        if (post.id) {
          const { error } = await supabase
            .from('reportes_items')
            .update({
              titulo: post.titulo,
              texto: post.texto,
              link_url: post.link_url || post.url,
              updated_at: new Date().toISOString()
            })
            .eq('id', post.id)

          if (error) throw error
        }
      }

      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving top posts:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePostChange = (postId: string, field: keyof TopPost, value: string) => {
    setEditedPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, [field]: value } : p
    ))
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const displayPosts = isEditing ? editedPosts : posts
  const igPosts = displayPosts.filter(p => p.plataforma === 'instagram').sort((a, b) => a.posicion - b.posicion)
  const ttPosts = displayPosts.filter(p => p.plataforma === 'tiktok').sort((a, b) => a.posicion - b.posicion)
  const ytPosts = displayPosts.filter(p => p.plataforma === 'youtube').sort((a, b) => a.posicion - b.posicion)

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
              Edit Posts
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
                {isSaving ? 'Saving...' : 'Save Posts'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <img src="/assets/instagram.png" alt="Instagram" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700">IG</h4>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {igPosts.map((post, idx) => (
                <PostCard
                  key={post.id || idx}
                  post={post}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onPostChange={handlePostChange}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <img src="/assets/tik-tok (1).png" alt="TikTok" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700">TikTok</h4>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {ttPosts.map((post, idx) => (
                <PostCard
                  key={post.id || idx}
                  post={post}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onPostChange={handlePostChange}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <img src="/assets/youtube (1).png" alt="YouTube" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700">YTS</h4>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {ytPosts.map((post, idx) => (
                <PostCard
                  key={post.id || idx}
                  post={post}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onPostChange={handlePostChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PostCardProps {
  post: TopPost
  isEditing: boolean
  isSaving: boolean
  onPostChange: (postId: string, field: keyof TopPost, value: string) => void
}

function PostCard({ post, isEditing, isSaving, onPostChange }: PostCardProps) {
  const linkUrl = post.link_url || post.url

  if (isEditing && post.id) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Title</label>
          <input
            type="text"
            value={post.titulo || ''}
            onChange={(e) => onPostChange(post.id!, 'titulo', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            disabled={isSaving}
            placeholder="Post title"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Description</label>
          <textarea
            value={post.texto || ''}
            onChange={(e) => onPostChange(post.id!, 'texto', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            disabled={isSaving}
            placeholder="Post description"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">URL (optional)</label>
          <input
            type="url"
            value={linkUrl || ''}
            onChange={(e) => onPostChange(post.id!, 'link_url', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            disabled={isSaving}
            placeholder="https://..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-sm transition-shadow">
      {post.titulo && (
        <p className="text-xs font-medium text-black mb-1 line-clamp-2">
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {post.titulo}
            </a>
          ) : (
            post.titulo
          )}
        </p>
      )}
      <p className="text-xs text-gray-600 line-clamp-3">{post.texto}</p>
    </div>
  )
}
