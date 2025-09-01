import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Play, Square, Download, RotateCcw } from 'lucide-react'
import { initHuman, detectOnce, getTopEmotion, warmup } from '../lib/human'

interface EmotionResult {
  emotion: string
  confidence: number
  allEmotions: { emotion: string; score: number }[]
  timestamp: Date
}

export function Experiments() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isAIReady, setIsAIReady] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState('')
  
  const normalVideoRef = useRef<HTMLVideoElement>(null)
  const aiVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Real AI emotion detection
  const detectEmotion = async (): Promise<EmotionResult> => {
    if (!aiVideoRef.current || !isAIReady) {
      throw new Error('AI not ready or video not available')
    }

    try {
      // Detect using real AI
      const result = await detectOnce(aiVideoRef.current)
      
      // Get ALL emotions with scores
      const emotions = result?.face?.[0]?.emotion || []
      const allEmotions = emotions.map((e: any) => ({
        emotion: e.emotion,
        score: e.score
      })).sort((a: any, b: any) => b.score - a.score)
      
      const topEmotion = allEmotions[0]
      
      if (topEmotion) {
        return {
          emotion: topEmotion.emotion,
          confidence: topEmotion.score,
          allEmotions: allEmotions,
          timestamp: new Date()
        }
      } else {
        // Fallback if no face detected
        return {
          emotion: 'No Face',
          confidence: 0,
          allEmotions: [],
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.error('AI detection error:', error)
      throw error
    }
  }

  const startCamera = async () => {
    try {
      setError(null)
      setIsAIReady(false)
      setLoadingProgress(0)
      setLoadingStage('Requesting camera access...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      setLoadingProgress(20)
      setLoadingStage('Setting up video streams...')
      
      // Asignar el MISMO stream a AMBOS videos
      if (normalVideoRef.current) {
        normalVideoRef.current.srcObject = stream
        normalVideoRef.current.muted = true
        normalVideoRef.current.playsInline = true
        await normalVideoRef.current.play()
      }
      
      if (aiVideoRef.current) {
        aiVideoRef.current.srcObject = stream
        aiVideoRef.current.muted = true
        aiVideoRef.current.playsInline = true
        await aiVideoRef.current.play()
      }
      
      setLoadingProgress(40)
      setLoadingStage('Initializing AI models...')
      
      // Initialize AI after video is ready
      try {
        setLoadingProgress(60)
        setLoadingStage('Loading neural networks...')
        await initHuman('webgl')
        
        setLoadingProgress(80)
        setLoadingStage('Warming up AI engine...')
        if (aiVideoRef.current) {
          await warmup(aiVideoRef.current)
        }
        
        setLoadingProgress(100)
        setLoadingStage('AI ready!')
        setIsAIReady(true)
      } catch (aiError) {
        console.warn('AI initialization failed, falling back to mock:', aiError)
        setIsAIReady(false)
      }
      
      streamRef.current = stream
      setIsStreaming(true)
      setLoadingProgress(100)
      setLoadingStage('Ready!')
      
    } catch (err) {
      setError(`Camera error: ${err}`)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (normalVideoRef.current) normalVideoRef.current.srcObject = null
    if (aiVideoRef.current) aiVideoRef.current.srcObject = null
    setIsStreaming(false)
    setIsAnalyzing(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAnalysis = () => {
    if (!isStreaming || !isAIReady) return
    
    setIsAnalyzing(true)
    
    const analyzeFrame = async () => {
      try {
        const result = await detectEmotion()
        setCurrentEmotion(result)
        setEmotionHistory(prev => [result, ...prev.slice(0, 9)])
      } catch (err) {
        console.error('Emotion detection error:', err)
        // Fallback to mock if AI fails
        const mockResult = {
          emotion: 'Error',
          confidence: 0,
          allEmotions: [],
          timestamp: new Date()
        }
        setCurrentEmotion(mockResult)
      }
    }
    
    intervalRef.current = setInterval(analyzeFrame, 2000)
    analyzeFrame()
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Experiments</h1>
          <p className="text-neutral-400">
            Real-time emotion detection using advanced AI models
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dual Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Dual Camera View</h2>
                  <div className="flex gap-2">
                    {!isStreaming ? (
                      <button
                        onClick={startCamera}
                        disabled={!isAIReady && (loadingProgress > 0 && loadingProgress < 100)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        {loadingProgress > 0 && loadingProgress < 100 ? 'Loading...' : 'Start Camera'}
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
                {/* Loading Progress Bar */}
                {loadingProgress > 0 && loadingProgress < 100 && (
                  <div className="mb-6 p-4 bg-neutral-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Loading AI Models</span>
                      <span className="text-blue-400 font-bold">{loadingProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-neutral-400">{loadingStage}</div>
                  </div>
                )}
                
                {/* DOS VIDEOS LADO A LADO */}
                <div className="grid grid-cols-2 gap-4">
                  {/* VIDEO NORMAL (IZQUIERDA) */}
                  <div className="relative bg-neutral-800 rounded-xl overflow-hidden aspect-video">
                    <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                      <span className="text-white text-xs font-medium">Normal Feed</span>
                    </div>
                    
                    <video
                      ref={normalVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                      style={{ display: isStreaming ? 'block' : 'none' }}
                    />
                    
                    {!isStreaming && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                          <p className="text-neutral-400 text-sm">Normal Video</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* VIDEO AI (DERECHA) */}
                  <div className="relative bg-neutral-800 rounded-xl overflow-hidden aspect-video">
                    <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                      <span className="text-white text-xs font-medium">AI Analysis</span>
                    </div>
                    
                    <video
                      ref={aiVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                      style={{ display: isStreaming ? 'block' : 'none' }}
                    />
                    
                    {!isStreaming && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                          <p className="text-neutral-400 text-sm">AI Filtered</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Emotion Overlay - SOLO en video AI */}
                    {isAnalyzing && currentEmotion && (
                      <div className="absolute bottom-2 left-2 right-2 z-20">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
                          <div className={`text-center text-sm font-medium ${getEmotionColor(currentEmotion.emotion)}`}>
                            {currentEmotion.emotion} ({Math.round(currentEmotion.confidence * 100)}%)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="space-y-6">
            {/* Current Emotion */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Emotion</h3>
              {currentEmotion ? (
                <div className="space-y-4">
                  {/* Main emotion display */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-semibold ${getEmotionColor(currentEmotion.emotion)}`}>
                      {currentEmotion.emotion}
                    </div>
                    <div className="mt-3 text-2xl font-bold text-white">
                      {Math.round(currentEmotion.confidence * 100)}%
                    </div>
                    <div className="text-sm text-neutral-500">
                      Primary Emotion
                    </div>
                  </div>
                  
                  {/* All emotions breakdown */}
                  {currentEmotion.allEmotions && currentEmotion.allEmotions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-300 mb-3">AI Analysis Breakdown</h4>
                      <div className="space-y-2">
                        {currentEmotion.allEmotions.slice(0, 6).map((emotion, index) => (
                          <div key={emotion.emotion} className="flex items-center gap-3">
                            <div className="w-16 text-xs text-neutral-400 text-right">
                              {emotion.emotion}
                            </div>
                            <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  index === 0 ? 'bg-blue-500' :
                                  index === 1 ? 'bg-green-500' :
                                  index === 2 ? 'bg-yellow-500' :
                                  index === 3 ? 'bg-purple-500' :
                                  index === 4 ? 'bg-red-500' :
                                  'bg-gray-500'
                                }`}
                                style={{ width: `${emotion.score * 100}%` }}
                              />
                            </div>
                            <div className="w-12 text-xs text-neutral-300 text-right">
                              {Math.round(emotion.score * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            
            {/* Detailed Analysis */}
            {currentEmotion?.allEmotions && currentEmotion.allEmotions.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Neural Network Output</h3>
                <div className="space-y-3">
                  {currentEmotion.allEmotions.map((emotion, index) => (
                    <div key={emotion.emotion} className="flex items-center justify-between p-2 bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' :
                          index === 4 ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-white text-sm font-medium">{emotion.emotion}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white font-mono">
                          {(emotion.score * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Experiments