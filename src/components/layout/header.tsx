import { Search, Bell, User, Command } from 'lucide-react'
import { Button } from '../ui/button'

interface HeaderProps {
  onOpenCommand: () => void
}

export function Header({ onOpenCommand }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            HYBE LATAM Data & AI Lab
          </h1>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Command Palette Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCommand}
            className="hidden md:flex items-center gap-2 text-muted-foreground"
          >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="w-3 h-3" />K
            </kbd>
          </Button>

          {/* Mobile search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCommand}
            className="md:hidden"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>

          {/* Demo Mode Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <div className="w-2 h-2 bg-hybe-green rounded-full animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Demo Mode</span>
          </div>
        </div>
      </div>
    </header>
  )
}