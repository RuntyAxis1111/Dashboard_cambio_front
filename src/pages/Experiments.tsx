import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Play, Square } from 'lucide-react'

export function Experiments() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
    console.log(message)
  }

  const startCamera = async () => {
    try {
      setError(null)
      addLog('🎥 Solicitando acceso a la cámara...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      addLog('✅ Stream obtenido exitosamente')
      
      if (videoRef.current) {
        const video = videoRef.current
        
        // Configurar video
        video.srcObject = stream
        video.muted = true
        video.playsInline = true
        
        addLog('🔧 Video configurado, intentando reproducir...')
        
        // Intentar reproducir
        try {
          await video.play()
          addLog('✅ Video reproduciéndose automáticamente!')
          setIsStreaming(true)
        } catch (playError) {
          addLog(`⚠️ Autoplay falló: ${playError}`)
          addLog('👆 Haz clic en el video para activarlo')
          setIsStreaming(true) // Marcar como streaming aunque no se reproduzca
        }
        
        streamRef.current = stream
      }
    } catch (err) {
      const errorMsg = `❌ Error de cámara: ${err}`
      setError(errorMsg)
      addLog(errorMsg)
    }
  }

  const stopCamera = () => {
    addLog('🛑 Deteniendo cámara...')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    addLog('✅ Cámara detenida')
  }

  const playVideo = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
        addLog('✅ Video activado manualmente!')
      } catch (err) {
        addLog(`❌ Error al reproducir: ${err}`)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Camera Test</h1>
          <p className="text-neutral-400">
            Prueba simple de cámara - sin complicaciones
          </p>
        </div>
        
        {/* Controls */}
        <div className="mb-6 flex gap-4">
          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors text-lg"
            >
              <Camera className="w-5 h-5" />
              Iniciar Cámara
            </button>
          ) : (
            <>
              <button
                onClick={playVideo}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors text-lg"
              >
                <Play className="w-5 h-5" />
                Activar Video
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors text-lg"
              >
                <CameraOff className="w-5 h-5" />
                Detener
              </button>
            </>
          )}
        </div>
        
        {/* Video Container */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Video Feed</h2>
          
          <div className="relative bg-black rounded-xl overflow-hidden" style={{ height: '400px' }}>
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onClick={playVideo}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                backgroundColor: '#ff0000', // Fondo rojo para debug
                border: '3px solid #00ff00', // Borde verde para ver el elemento
                cursor: 'pointer'
              }}
            />
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-3">
              <div className="text-white text-sm">
                <div>Estado: {isStreaming ? '🟢 Streaming' : '🔴 Detenido'}</div>
                <div>Stream: {streamRef.current ? '✅ Activo' : '❌ Ninguno'}</div>
                <div>Video: {videoRef.current?.srcObject ? '✅ Conectado' : '❌ Sin fuente'}</div>
              </div>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/80">
                <div className="text-center text-white">
                  <CameraOff className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-medium mb-2">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {/* Instructions */}
            {!isStreaming && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                  <p className="text-lg font-medium mb-2">Cámara Lista</p>
                  <p className="text-neutral-400">Haz clic en "Iniciar Cámara"</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Debug Logs */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Debug Log</h3>
          <div className="bg-black rounded-lg p-4 h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-neutral-500 text-sm">No hay logs aún...</div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400 text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-3 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
          >
            Limpiar Log
          </button>
        </div>
      </div>
    </div>
  )
}