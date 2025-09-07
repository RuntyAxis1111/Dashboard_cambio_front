import { ReactNode } from 'react'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoiceAgent } from './VoiceAgent'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  console.log('🏗️ Layout component rendering...')
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false)

  try {
    return (
      <div className="h-screen bg-white text-black grid grid-cols-[260px_1fr] overflow-hidden">
        <Sidebar />
        <div className="flex flex-col overflow-hidden">
          <Topbar />
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
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    )
  }
}