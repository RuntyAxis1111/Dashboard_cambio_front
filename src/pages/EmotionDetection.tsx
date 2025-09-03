import { useState, useEffect } from 'react'
import { Search, ArrowRight, Hash, Music, BarChart3, Users, Megaphone } from 'lucide-react'
import { projects, artists } from '../lib/dashboards'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

interface SearchResult {
  id: string
  title: string
  subtitle: string
  path: string
  icon: React.ReactNode
  category: string
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Build search results
  const searchResults: SearchResult[] = []

  // Add main sections
  const mainSections = [
    { title: 'Home', path: '/', icon: <Hash className="w-4 h-4" />, category: 'Navigation' },
    { title: 'Dashboards', path: '/dashboards', icon: <BarChart3 className="w-4 h-4" />, category: 'Navigation' },
    { title: 'AI Studio', path: '/ai', icon: <BarChart3 className="w-4 h-4" />, category: 'Navigation' },
    { title: 'MMM', path: '/ai/mmm', icon: <BarChart3 className="w-4 h-4" />, category: 'AI Studio' },
    { title: 'Hybe LLM', path: '/ai/llm', icon: <BarChart3 className="w-4 h-4" />, category: 'AI Studio' },
    { title: 'Experiments', path: '/ai/experiments', icon: <BarChart3 className="w-4 h-4" />, category: 'AI Studio' },
    { title: 'Emotion Detection', path: '/ai/emotion-detection', icon: <BarChart3 className="w-4 h-4" />, category: 'AI Studio' },
    { title: 'Subscriptions', path: '/subscriptions', icon: <BarChart3 className="w-4 h-4" />, category: 'Navigation' },
    { title: 'Data Explorer', path: '/data', icon: <BarChart3 className="w-4 h-4" />, category: 'Navigation' },
    { title: 'About', path: '/about', icon: <BarChart3 className="w-4 h-4" />, category: 'Navigation' },
  ]

  mainSections.forEach(section => {
    searchResults.push({
      id: section.path,
      title: section.title,
      subtitle: section.category,
      path: section.path,
      icon: section.icon,
      category: section.category
    })
  })

  // Add artists
  artists.forEach(artist => {
    searchResults.push({
      id: `artist-${artist.id}`,
      title: artist.name,
      subtitle: 'Individual Artist',
      path: `/dashboard/artists/${artist.id}`,
      icon: <Megaphone className="w-4 h-4" />,
      category: 'Artists'
    })
  })

  // Add project dashboards
  projects.forEach(project => {
    const projectIcon = project.icon === 'Music' ? <Music className="w-4 h-4" /> :
                       project.icon === 'BarChart3' ? <BarChart3 className="w-4 h-4" /> :
                       project.icon === 'Users' ? <Users className="w-4 h-4" /> :
                       <BarChart3 className="w-4 h-4" />

    project.sections.forEach(section => {
      section.dashboards.forEach(dashboard => {
        const path = project.id === 'artists' 
          ? `/dashboard/artists/${dashboard.id}`
          : section.type === 'band'
          ? `/dashboard/${project.id}/band/${dashboard.id}`
          : `/dashboard/${project.id}/${dashboard.id}`

        searchResults.push({
          id: `${project.id}-${dashboard.id}`,
          title: dashboard.name,
          subtitle: `${project.name} • ${section.name}`,
          path,
          icon: projectIcon,
          category: project.name
        })
      })
    })
  })

  // Filter results based on query
  const filteredResults = query.length === 0 
    ? searchResults.slice(0, 8) // Show first 8 when no query
    : searchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          onNavigate(filteredResults[selectedIndex].path)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredResults, onNavigate, onClose])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto">
        <div 
          className="bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-300">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dashboards, artists, or navigate..."
              className="flex-1 bg-transparent text-black placeholder-gray-500 outline-none"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-gray-200 rounded border border-gray-300 text-gray-600">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-600 mb-2">No results found</div>
                <div className="text-sm text-gray-500">Try searching for an artist, platform, or section</div>
              </div>
            ) : (
              <div className="p-2">
                {filteredResults.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => onNavigate(result.path)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex 
                        ? 'bg-gray-200 text-black' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 p-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Select</span>
                </div>
              </div>
              <div>{filteredResults.length} results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}