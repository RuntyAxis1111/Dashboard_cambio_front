import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Hash, Zap, BarChart3, Brain } from 'lucide-react'
import { Dialog, DialogContent } from '../ui/dialog'
import { cn } from '../../lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const commands = [
  // Quick navigation
  { id: 'home', label: 'Home', href: '/', icon: Search, group: 'Navigation' },
  { id: 'dashboards', label: 'Dashboards', href: '/dashboards', icon: BarChart3, group: 'Navigation' },
  { id: 'ai-studio', label: 'AI Studio', href: '/ai', icon: Brain, group: 'Navigation' },
  
  // Projects
  { id: 'palf', label: 'PALF Project', href: '/dashboard/palf/youtube', icon: Hash, group: 'Projects' },
  { id: 'stbv', label: 'STBV Project', href: '/dashboard/stbv/instagram', icon: Hash, group: 'Projects' },
  { id: 'communities', label: 'Communities', href: '/dashboard/communities/instagram', icon: Hash, group: 'Projects' },
  
  // Artists
  { id: 'daddy-yankee', label: 'Daddy Yankee', href: '/dashboard/artists/daddy-yankee', icon: Zap, group: 'Artists' },
  { id: 'bts', label: 'BTS', href: '/dashboard/artists/bts', icon: Zap, group: 'Artists' },
  { id: 'chicocurlyhead', label: 'ChicoCurlyHead', href: '/dashboard/artists/chicocurlyhead', icon: Zap, group: 'Artists' },
  
  // AI Tools
  { id: 'mmm', label: 'Marketing Mix Modeling', href: '/ai/mmm', icon: Brain, group: 'AI Tools' },
  { id: 'llm', label: 'Hybe LLM Assistant', href: '/ai/llm', icon: Brain, group: 'AI Tools' },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = []
    }
    acc[command.group].push(command)
    return acc
  }, {} as Record<string, typeof commands>)

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const command = filteredCommands[selectedIndex]
        if (command) {
          navigate(command.href)
          onOpenChange(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex, navigate, onOpenChange])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="command-palette max-w-2xl p-0 gap-0">
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, artists, tools..."
            className="flex-1 py-4 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([group, commands]) => (
            <div key={group} className="mb-4 last:mb-0">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group}
              </div>
              <div className="space-y-1">
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        navigate(command.href)
                        onOpenChange(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors',
                        isSelected 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-accent/50'
                      )}
                    >
                      <command.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="flex-1 text-sm">{command.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}