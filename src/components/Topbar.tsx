import { Search, Command, Bell, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search or press ⌘K"
              className="bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 w-80"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-neutral-700 rounded border border-neutral-600 text-neutral-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <Bell className="w-5 h-5 text-neutral-400" />
          </button>
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <User className="w-5 h-5 text-neutral-400" />
            <span className="text-sm text-neutral-400">Demo User</span>
          </button>
        </div>
      </div>
    </header>
  )
}