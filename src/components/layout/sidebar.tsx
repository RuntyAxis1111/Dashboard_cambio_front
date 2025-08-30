import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  Brain, 
  Bell, 
  Database, 
  FolderOpen, 
  Info,
  ChevronRight
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboards', href: '/dashboards', icon: BarChart3 },
  { 
    name: 'AI Studio', 
    href: '/ai', 
    icon: Brain,
    badge: 'Beta',
    children: [
      { name: 'MMM', href: '/ai/mmm' },
      { name: 'Hybe LLM', href: '/ai/llm' },
      { name: 'Experiments', href: '/ai/experiments' },
    ]
  },
  { name: 'Subscriptions', href: '/subscriptions', icon: Bell },
  { name: 'Data Explorer', href: '/data', icon: Database },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'About', href: '/about', icon: Info },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto hide-scrollbar">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? location.pathname === '/'
            : location.pathname.startsWith(item.href)
          
          const hasChildren = item.children && item.children.length > 0
          const isAIStudio = item.name === 'AI Studio'
          const showChildren = isAIStudio && (isActive || location.pathname.startsWith('/ai'))

          return (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive: linkActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring',
                    (linkActive && item.href === '/') || (isActive && item.href !== '/') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-hybe-gold text-black rounded-full">
                    {item.badge}
                  </span>
                )}
                {hasChildren && (
                  <ChevronRight 
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showChildren && "rotate-90"
                    )} 
                  />
                )}
              </NavLink>

              {/* AI Studio Children */}
              {showChildren && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children?.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors focus-ring',
                          isActive 
                            ? 'bg-accent text-accent-foreground font-medium' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )
                      }
                    >
                      <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}