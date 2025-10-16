import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Menu } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { CommandPalette } from './CommandPalette'

interface TopbarProps {
  user: SupabaseUser | null
  onMobileMenuToggle?: () => void
}

export function Topbar({ user, onMobileMenuToggle }: TopbarProps) {
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
      <header className="bg-gray-100 border-b border-gray-300 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowCommandPalette(true)}
              className="relative flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-gray-400 transition-colors w-full max-w-xs lg:w-80"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search or press ⌘K</span>
              <span className="sm:hidden">Search</span>
              <div className="ml-auto hidden sm:block">
                <kbd className="px-2 py-1 text-xs bg-gray-200 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden md:flex items-center gap-2 p-2 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </span>
            </div>
            <div className="md:hidden p-2 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </div>
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