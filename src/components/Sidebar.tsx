import { Link, useLocation } from 'react-router-dom'
import { Chrome as Home, ChartBar as BarChart3, Brain, Bell, Search, Info, LogOut, FileText, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User | null
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ user, isMobileOpen = false, onMobileClose }: SidebarProps) {
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
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/ai', label: 'AI Studio', icon: Brain },
    { path: '/subscriptions', label: 'Subscriptions', icon: Bell },
    { path: '/data', label: 'Data Explorer', icon: Search },
    { path: '/about', label: 'About', icon: Info }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-50 border-r border-gray-200 flex flex-col
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-black">HYBE LATAM</h1>
          <p className="text-sm text-gray-600">Data & AI Lab</p>
        </div>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
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
            <p className="text-xs text-gray-400">© 2025 • Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}