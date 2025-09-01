import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Play, Square, Download, RotateCcw } from 'lucide-react'

interface EmotionResult {
  emotion: string
  confidence: number
  timestamp: Date
}

export function EmotionDetection() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mock emotion detection (simulates real AI analysis)
  const detectEmotion = async (): Promise<EmotionResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    const emotions = [
      { emotion: 'Happy', confidence: 0.85 + Math.random() * 0.15 },
      { emotion: 'Neutral', confidence: 0.70 + Math.random() * 0.25 },
      { emotion: 'Surprised', confidence: 0.60 + Math.random() * 0.35 },
      { emotion: 'Focused', confidence: 0.75 + Math.random() * 0.20 },
      { emotion: 'Excited', confidence: 0.80 + Math.random() * 0.15 },
      { emotion: 'Calm', confidence: 0.65 + Math.random() * 0.30 },
    ]
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    
    return {
      emotion: randomEmotion.emotion,
      confidence: Math.min(randomEmotion.confidence, 0.99),
      timestamp: new Date()
    }
  }

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      console.error('Camera access error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    setIsAnalyzing(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAnalysis = () => {
    if (!isStreaming) return
    
    setIsAnalyzing(true)
    
    const analyzeFrame = async () => {
      try {
        const result = await detectEmotion()
        setCurrentEmotion(result)
        setEmotionHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
      } catch (err) {
        console.error('Emotion detection error:', err)
      }
    }
    
    // Analyze every 2 seconds
    intervalRef.current = setInterval(analyzeFrame, 2000)
    analyzeFrame() // First analysis immediately
  }

  const stopAnalysis = () => {
    setIsAnalyzing(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resetSession = () => {
    setCurrentEmotion(null)
    setEmotionHistory([])
    stopAnalysis()
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
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const getEmotionColor = (emotion: string) => {
    const colors = {
      'Happy': 'text-yellow-400 bg-yellow-600/20',
      'Excited': 'text-orange-400 bg-orange-600/20',
      'Surprised': 'text-blue-400 bg-blue-600/20',
      'Neutral': 'text-gray-400 bg-gray-600/20',
      'Focused': 'text-purple-400 bg-purple-600/20',
      'Calm': 'text-green-400 bg-green-600/20',
    }
    return colors[emotion as keyof typeof colors] || 'text-gray-400 bg-gray-600/20'
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Emotion Detection</h1>
          <p className="text-neutral-400">
            Analyze emotional sentiment using your camera in real-time
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Camera Feed</h2>
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
                            onClick={startAnalysis}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Start Analysis
                          </button>
                        ) : (
                          <button
                            onClick={stopAnalysis}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors"
                          >
                            <Square className="w-4 h-4" />
                            Stop Analysis
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
                  {error ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <CameraOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400 font-medium mb-2">Camera Error</p>
                        <p className="text-neutral-400 text-sm">{error}</p>
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
                  ) : !isStreaming ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                        <p className="text-neutral-300 font-medium mb-2">Camera Ready</p>
                        <p className="text-neutral-500 text-sm">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Analysis Overlay */}
                      {isAnalyzing && (
                        <div className="absolute top-4 left-4 right-4">
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
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
              </div>
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
            
            {/* Statistics */}
            {emotionHistory.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Session Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Analyses</span>
                    <span className="text-white font-medium">{emotionHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Avg Confidence</span>
                    <span className="text-white font-medium">
                      {Math.round(emotionHistory.reduce((acc, r) => acc + r.confidence, 0) / emotionHistory.length * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Most Common</span>
                    <span className="text-white font-medium">
                      {emotionHistory.reduce((acc, r) => {
                        acc[r.emotion] = (acc[r.emotion] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 font-bold text-xs">1</span>
              </div>
              <div>
                <div className="font-medium text-white mb-1">Start Camera</div>
                <div className="text-neutral-400">Allow camera access and position yourself in frame</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 font-bold text-xs">2</span>
              </div>
              <div>
                <div className="font-medium text-white mb-1">Begin Analysis</div>
                <div className="text-neutral-400">Start real-time emotion detection and monitoring</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 font-bold text-xs">3</span>
              </div>
              <div>
                <div className="font-medium text-white mb-1">Review Results</div>
                <div className="text-neutral-400">Export data and analyze emotional patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}