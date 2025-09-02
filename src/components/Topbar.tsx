import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Command } from 'lucide-react'
import { CommandPalette } from './CommandPalette'

export function Topbar() {
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="bg-gray-100 border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCommandPalette(true)}
              className="relative flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-gray-400 transition-colors w-80"
            >
              <Search className="w-4 h-4" />
              <span>Search or press ⌘K</span>
              <div className="ml-auto">
                <kbd className="px-2 py-1 text-xs bg-gray-200 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Demo User</span>
            </button>
          </div>
        </div>
      </header>
      
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(path) => {
          navigate(path)
          setShowCommandPalette(false)
        }}
      />
    </>
  )
}