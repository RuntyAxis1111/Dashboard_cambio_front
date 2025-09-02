import { useState, useEffect } from 'react'
import { VoicePanel } from './VoicePanel'

export function PenguinFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [penguinImg, setPenguinImg] = useState('')
  const [hotkey, setHotkey] = useState('KeyP')

  useEffect(() => {
    // Check if voice widget is enabled
    const enabled = import.meta.env.VITE_VOICE_WIDGET_ENABLED === 'true'
    setIsEnabled(enabled)
    
    if (enabled) {
      setPenguinImg(import.meta.env.VITE_PENGUIN_IMG || '/assets/pinguinohybe.png')
      setHotkey(import.meta.env.VITE_PENGUIN_HOTKEY || 'KeyP')
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === hotkey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger if user is typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return
        }
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEnabled, hotkey])

  if (!isEnabled) {
    return null
  }

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Abrir Pingüino Hybe - Asistente de Voz"
        title={`Pingüino Hybe (Presiona ${hotkey.replace('Key', '')} para abrir/cerrar)`}
      >
        <img 
          src={penguinImg}
          alt="Pingüino Hybe"
          className="w-12 h-12 object-contain mx-auto"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="hidden w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-blue-600 text-xl">🐧</span>
        </div>
      </button>

      {/* Voice Panel */}
      {isOpen && (
        <VoicePanel 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}