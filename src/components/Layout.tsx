import { ReactNode } from 'react'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoiceAgent } from './VoiceAgent'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false)

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
}