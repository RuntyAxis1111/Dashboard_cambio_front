import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Brain, Bell, Search, Info, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User | null
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation()
  const { signOut } = useAuth()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
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
        {user && (
          <div className="mb-4">
            <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-blue-600 text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* MVP Button */}
            <a
              href="https://mvpia.hybelatinamerica.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 mb-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">MVP Dashboard</div>
                <div className="text-xs text-green-100">Versión Beta</div>
              </div>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-600" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
        
        {/* Enhanced Footer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Sistema Activo</span>
            </div>
            <span className="text-xs text-gray-500">v2.1.0</span>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">HYBE LATAM Data & AI Lab</p>
            <p className="text-xs text-gray-400">© 2024 • Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  )
}