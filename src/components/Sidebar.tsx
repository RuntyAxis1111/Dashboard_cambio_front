import { useLocation, Link } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Beaker, 
  Bell, 
  Database, 
  FolderOpen, 
  Info 
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboards', href: '/dashboards', icon: BarChart3 },
  { 
    name: 'AI Studio', 
    href: '/ai', 
    icon: Brain,
    children: [
      { name: 'MMM', href: '/ai/mmm', icon: TrendingUp },
      { name: 'Hybe LLM', href: '/ai/llm', icon: MessageSquare },
      { name: 'AI Emotion Detection', href: '/ai/experiments', icon: Beaker },
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
    <aside className="bg-gray-100 border-r border-gray-300 flex flex-col">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-lg font-semibold text-black">
          HYBE LATAM<br />
          <span className="text-gray-600 text-sm font-normal">Data & AI Lab</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.children && item.children.some(child => location.pathname === child.href))
          
          return (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-gray-200 text-black' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
              
              {item.children && isActive && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors
                        ${location.pathname === child.href
                          ? 'text-black bg-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <child.icon className="w-4 h-4" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-300">
        <div className="text-xs text-gray-500">
          Demo Mode
        </div>
      </div>
    </aside>
  )
}