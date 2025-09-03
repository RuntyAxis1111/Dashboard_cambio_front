import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Brain, Bell, Search, Info } from 'lucide-react'

export function Sidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboards', label: 'Dashboards', icon: BarChart3 },
    { path: '/ai', label: 'AI Studio', icon: Brain },
    { path: '/subscriptions', label: 'Subscriptions', icon: Bell },
    { path: '/data', label: 'Data Explorer', icon: Search },
    { path: '/about', label: 'About', icon: Info }
  ]

  return (
    <div className="bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-black">HYBE LATAM</h1>
        <p className="text-sm text-gray-600">Data & AI Lab</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Demo Mode</p>
      </div>
    </div>
  )
}