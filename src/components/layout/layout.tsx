import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { useState } from 'react'

export function Layout() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenCommand={() => setIsCommandOpen(true)} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette 
        open={isCommandOpen} 
        onOpenChange={setIsCommandOpen} 
      />
    </div>
  )
}