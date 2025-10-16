import { ReactNode, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoiceAgent } from './VoiceAgent'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  console.log('🏗️ Layout component rendering...')
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user } = useAuth()

  try {
    return (
      <div className="h-screen bg-white text-black lg:grid lg:grid-cols-[260px_1fr] overflow-hidden">
        <Sidebar
          user={user}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="flex flex-col overflow-hidden h-screen">
          <Topbar
            user={user}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <VoiceAgent
          isOpen={isVoiceAgentOpen}
          onToggle={() => setIsVoiceAgentOpen(!isVoiceAgentOpen)}
        />
      </div>
    )
  } catch (error) {
    console.error('❌ Error in Layout component:', error)
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', color: 'red' }}>
        <h2>Layout Component Error</h2>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      </div>
    )
  }
}