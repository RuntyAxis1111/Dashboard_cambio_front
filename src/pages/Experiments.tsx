import React, { useRef, useState, useEffect } from 'react'
import { Camera, CameraOff, Play, Square, Download, RotateCcw, AlertCircle } from 'lucide-react'
import { initHuman, detectOnce, drawFrame, getTopEmotion, type Backend } from '../lib/human'

interface EmotionResult {
  emotion: string
  confidence: number
  timestamp: Date
}

export function Experiments() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [streamInfo, setStreamInfo] = useState<any>(null)
  const [status, setStatus] = useState('Stopped')
  const [backend, setBackend] = useState<Backend>('webgl')
  const [fps, setFps] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)
  const humanRef = useRef<any>(null)

  // Debug logging function
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)])
    console.log(`[DEBUG] ${message}`)
  }

  // Initialize Human.js
  useEffect(() => {
    const init = async () => {
      try {
        addLog(`🤖 Inicializando Human.js con backend: ${backend}`)
        humanRef.current = await initHuman(backend)
        addLog('✅ Human.js inicializado correctamente')
      } catch (err) {
        addLog(`❌ Error inicializando Human.js: ${err}`)
        setError(`Error inicializando AI: ${err}`)
      }
    }
    init()
  }, [backend])

  const startCamera = async () => {
    try {
      setError(null)
      setIsVideoReady(false)
      addLog('🎥 Solicitando acceso a la cámara...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      addLog('✅ Stream obtenido exitosamente')
      
      const tracks = stream.getVideoTracks()
      if (tracks.length > 0) {
        const track = tracks[0]
        const settings = track.getSettings()
        setStreamInfo(settings)
        addLog(`📹 Video track: ${settings.width}x${settings.height}, ${settings.frameRate}fps`)
      }
      
      if (videoRef.current) {
        const video = videoRef.current
        addLog('🔧 Configurando elemento video...')
        
        video.srcObject = stream
        video.muted = true
        video.playsInline = true
        
        video.onloadedmetadata = () => {
          addLog('📊 Video: metadata cargada')
          addLog(`📐 Video dimensions: ${video.videoWidth}x${video.videoHeight}`)
        }
        video.oncanplay = () => {
          addLog('▶️ Video: can play')
          setIsVideoReady(true)
        }
        video.onplay = () => addLog('🎬 Video: playing')
        video.onerror = (e) => {
          const errorMsg = `Video error: ${e}`
          addLog(`❌ ${errorMsg}`)
          setError(errorMsg)
        }
        
        setTimeout(async () => {
          try {
            addLog('▶️ Intentando reproducir video...')
            await video.play()
            addLog('✅ Video reproduciéndose exitosamente!')
          } catch (error) {
            addLog(`⚠️ Autoplay falló: ${error}`)
          }
        }, 100)
        
        streamRef.current = stream
        setIsStreaming(true)
        addLog('🟢 Estado streaming activado')
      }
    } catch (err) {
      const errorMsg = `No se pudo acceder a la cámara: ${err}`
      setError(errorMsg)
      addLog(`❌ ${errorMsg}`)
    }
  }

  const stopCamera = () => {
    addLog('🛑 Deteniendo cámara...')
    setIsVideoReady(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      addLog('📴 Stream detenido')
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      addLog('🔌 Video desconectado')
    }
    setIsStreaming(false)
    setIsAnalyzing(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setStatus('Stopped')
    addLog('✅ Cámara detenida completamente')
  }

  const start = async () => {
    if (!humanRef.current) {
      addLog('❌ Human.js no está inicializado')
      return
    }
    
    if (!videoRef.current || !canvasRef.current) {
      addLog('❌ Video o canvas no disponible')
      return
    }

    try {
      setStatus('Starting...')
      addLog('🚀 Iniciando detección de emociones...')
      
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Setup canvas
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      addLog(`🎨 Canvas configurado: ${canvas.width}x${canvas.height}`)
      
      // Warmup
      addLog('🔥 Calentando modelo...')
      await humanRef.current.warmup()
      addLog('✅ Modelo calentado')
      
      setIsAnalyzing(true)
      setStatus('Running')
      
      let frameCount = 0
      let lastTime = performance.now()
      
      const loop = async () => {
        if (!isAnalyzing) return
        
        try {
          const now = performance.now()
          frameCount++
          
          if (now - lastTime >= 1000) {
            setFps(Math.round(frameCount * 1000 / (now - lastTime)))
            frameCount = 0
            lastTime = now
          }
          
          const result = await detectOnce(video)
          
          if (result.face && result.face.length > 0) {
            const topEmotion = getTopEmotion(result)
            if (topEmotion) {
              setCurrentEmotion({
                emotion: topEmotion.emotion,
                confidence: topEmotion.score,
                timestamp: new Date()
              })
              setEmotionHistory(prev => [
                {
                  emotion: topEmotion.emotion,
                  confidence: topEmotion.score,
                  timestamp: new Date()
                },
                ...prev.slice(0, 9)
              ])
            }
            
            drawFrame(canvas, video, result)
          }
          
          rafRef.current = requestAnimationFrame(loop)
        } catch (err) {
          setError(`Error: ${err}`)
          setStatus('Error occurred')
          console.error('Loop error:', err)
        }
      }
      
      rafRef.current = requestAnimationFrame(loop)
      
    } catch (err) {
      setError(`Error: ${err}`)
      setStatus('Error occurred')
      addLog(`❌ Error en start: ${err}`)
    }
  }

  const stop = () => {
    setIsAnalyzing(false)
    setStatus('Stopped')
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    addLog('⏹️ Análisis detenido')
  }

  const resetSession = () => {
    setCurrentEmotion(null)
    setEmotionHistory([])
    stop()
    addLog('🔄 Sesión reiniciada')
  }

  const exportResults = () => {
    const data = {
      session: {
        startTime: emotionHistory[emotionHistory.length - 1]?.timestamp,
        endTime: emotionHistory[0]?.timestamp,
        totalAnalyses: emotionHistory.length
      },
      results: emotionHistory
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emotion-analysis-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addLog('📁 Resultados exportados')
  }

  const testCanvas = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    
   // Clear canvas first
   ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
   // Draw a small test circle instead of blocking rectangle
   ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
   ctx.beginPath()
   ctx.arc(50, 50, 20, 0, 2 * Math.PI)
   ctx.fill()
    addLog('🎨 Test canvas: cuadrado rojo dibujado')
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const getEmotionColor = (emotion: string) => {
    const colors = {
      'happy': 'text-yellow-400 bg-yellow-600/20',
      'sad': 'text-blue-400 bg-blue-600/20',
      'angry': 'text-red-400 bg-red-600/20',
      'fear': 'text-purple-400 bg-purple-600/20',
      'surprise': 'text-orange-400 bg-orange-600/20',
      'disgust': 'text-green-400 bg-green-600/20',
      'neutral': 'text-gray-400 bg-gray-600/20',
    }
    return colors[emotion.toLowerCase() as keyof typeof colors] || 'text-gray-400 bg-gray-600/20'
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Experiments</h1>
          <p className="text-neutral-400">
            Real-time emotion detection using advanced AI models
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Emotion Detection</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'Running' ? 'bg-green-600/20 text-green-400' :
                        status === 'Error occurred' ? 'bg-red-600/20 text-red-400' :
                        'bg-neutral-600/20 text-neutral-400'
                      }`}>
                        Status: {status}
                      </span>
                      <span className="text-neutral-400">Backend: {backend}</span>
                      <span className="text-neutral-400">FPS: {fps}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isStreaming ? (
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </button>
                    ) : (
                      <>
                        {!isAnalyzing ? (
                          <button
                            onClick={start}
                            disabled={!isVideoReady}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </button>
                        ) : (
                          <button
                            onClick={stop}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors"
                          >
                            <Square className="w-4 h-4" />
                            Stop
                          </button>
                        )}
                        <button
                          onClick={stopCamera}
                          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          <CameraOff className="w-4 h-4" />
                          Stop Camera
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative bg-neutral-800 rounded-xl overflow-hidden aspect-video">
                  {/* Video element */}
                  {isStreaming && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                      onClick={() => {
                        addLog('👆 Usuario hizo clic en el video')
                        if (videoRef.current) {
                          videoRef.current.play()
                            .then(() => {
                              addLog('✅ Reproducción manual exitosa!')
                              setIsVideoReady(true)
                            })
                            .catch(error => {
                              addLog(`❌ Reproducción manual falló: ${error}`)
                              setError(`Error de reproducción: ${error}`)
                            })
                        }
                      }}
                    />
                  )}
                  
                  {/* Canvas overlay for AI visualization */}
                  <canvas
                    ref={canvasRef}
                   className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] pointer-events-none opacity-0"
                  />
                  
                  {/* Error overlay */}
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 z-20">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400 font-medium mb-2">Error</p>
                        <p className="text-neutral-400 text-sm max-w-md">{error}</p>
                        <button
                          onClick={() => {
                            setError(null)
                            startCamera()
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Default state */}
                  {!isStreaming && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                        <p className="text-neutral-300 font-medium mb-2">Camera Ready</p>
                        <p className="text-neutral-500 text-sm">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Overlay */}
                  {isAnalyzing && (
                    <div className="absolute top-4 left-4 right-4 z-50">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-white text-sm font-medium">Analyzing...</span>
                          </div>
                          {currentEmotion && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(currentEmotion.emotion)}`}>
                              {currentEmotion.emotion} ({Math.round(currentEmotion.confidence * 100)}%)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls & Debug Panel */}
          <div className="space-y-6">
            {/* Current Emotion */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Emotion</h3>
              {currentEmotion ? (
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-semibold ${getEmotionColor(currentEmotion.emotion)}`}>
                    {currentEmotion.emotion}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">
                    {Math.round(currentEmotion.confidence * 100)}%
                  </div>
                  <div className="text-sm text-neutral-500">
                    Confidence Level
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-8 h-8 text-neutral-500" />
                  </div>
                  <p className="text-neutral-500">Start analysis to see results</p>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Backend</label>
                  <select
                    value={backend}
                    onChange={(e) => setBackend(e.target.value as Backend)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="webgl">WebGL</option>
                    <option value="wasm">WASM</option>
                  </select>
                </div>
                
                <button
                  onClick={resetSession}
                  disabled={emotionHistory.length === 0}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Session
                </button>
                
                <button
                  onClick={exportResults}
                  disabled={emotionHistory.length === 0}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
                
                {isStreaming && !isVideoReady && (
                  <button
                    onClick={() => videoRef.current?.play().catch(console.error)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Force Play Video
                  </button>
                )}
                
                <button
                  onClick={testCanvas}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  Test Canvas
                </button>
              </div>
            </div>
            
            {/* Debug Panel */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Debug Info</h3>
              
              {/* Stream Info */}
              {streamInfo && (
                <div className="mb-4 p-3 bg-neutral-800 rounded-lg">
                  <div className="text-sm font-medium text-white mb-2">Stream Settings:</div>
                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>Resolution: {streamInfo.width}x{streamInfo.height}</div>
                    <div>Frame Rate: {streamInfo.frameRate}fps</div>
                    <div>Device: {streamInfo.deviceId?.substring(0, 8)}...</div>
                  </div>
                </div>
              )}
              
              {/* Video Element State */}
              {videoRef.current && (
                <div className="mb-4 p-3 bg-neutral-800 rounded-lg">
                  <div className="text-sm font-medium text-white mb-2">Video Element:</div>
                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>Ready State: {videoRef.current.readyState}</div>
                    <div>Paused: {videoRef.current.paused ? 'Yes' : 'No'}</div>
                    <div>Muted: {videoRef.current.muted ? 'Yes' : 'No'}</div>
                    <div>Has Stream: {videoRef.current.srcObject ? 'Yes' : 'No'}</div>
                    <div>Video Size: {videoRef.current.videoWidth}x{videoRef.current.videoHeight}</div>
                  </div>
                </div>
              )}
              
              {/* Canvas State */}
              {canvasRef.current && (
                <div className="mb-4 p-3 bg-neutral-800 rounded-lg">
                  <div className="text-sm font-medium text-white mb-2">Canvas Element:</div>
                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>Canvas Size: {canvasRef.current.width}x{canvasRef.current.height}</div>
                    <div>Context: {canvasRef.current.getContext('2d') ? 'Available' : 'Not Available'}</div>
                  </div>
                </div>
              )}
              
              {/* Debug Log */}
              <div className="max-h-48 overflow-y-auto">
                <div className="text-sm font-medium text-white mb-2">Debug Log:</div>
                <div className="space-y-1">
                  {debugInfo.length === 0 ? (
                    <div className="text-xs text-neutral-500">No debug info yet</div>
                  ) : (
                    debugInfo.map((log, index) => (
                      <div key={index} className="text-xs text-neutral-300 font-mono bg-neutral-800 p-2 rounded">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setDebugInfo([])}
                className="mt-3 w-full px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
              >
                Clear Debug Log
              </button>
            </div>
            
            {/* Emotion History */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Analysis</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {emotionHistory.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-4">No analysis yet</p>
                ) : (
                  emotionHistory.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getEmotionColor(result.emotion).split(' ')[1]}`} />
                        <span className="text-white font-medium">{result.emotion}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{Math.round(result.confidence * 100)}%</div>
                        <div className="text-xs text-neutral-500">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Experiments