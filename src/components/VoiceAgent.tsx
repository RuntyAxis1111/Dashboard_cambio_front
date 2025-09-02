import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, AlertCircle, Phone, PhoneOff } from 'lucide-react'

interface VoiceAgentProps {
  isOpen: boolean
  onToggle: () => void
}

export function VoiceAgent({ isOpen, onToggle }: VoiceAgentProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY

  // Debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    setDebugLogs(prev => [logMessage, ...prev.slice(0, 9)])
  }

  // Convert Float32Array to Int16Array (PCM 16-bit)
  const float32ToInt16 = (float32Array: Float32Array): Int16Array => {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
    }
    return int16Array
  }

  // Convert Int16Array to base64
  const int16ToBase64 = (int16Array: Int16Array): string => {
    const uint8Array = new Uint8Array(int16Array.buffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    return btoa(binary)
  }

  const startVoiceCall = async () => {
    try {
      setError(null)
      setConnectionStatus('Connecting...')
      addDebugLog('🔄 Iniciando llamada de voz...')
      
      if (!agentId || !apiKey) {
        throw new Error('Configuración de ElevenLabs faltante')
      }
      
      // 1. Get signed URL
      addDebugLog('📡 Obteniendo signed URL...')
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey,
          },
        }
      )
      
      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text()
        addDebugLog(`❌ Error obteniendo signed URL: ${signedUrlResponse.status} - ${errorText}`)
        throw new Error(`ElevenLabs API error: ${signedUrlResponse.status}`)
      }
      
      const { signed_url } = await signedUrlResponse.json()
      addDebugLog('✅ Signed URL obtenida')
      
      // 2. Setup audio context and microphone
      addDebugLog('🎤 Configurando audio...')
      audioContextRef.current = new AudioContext({ sampleRate: 16000 })
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      mediaStreamRef.current = stream
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
      
      // Create audio processor for real-time streaming
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1)
      
      addDebugLog('✅ Audio configurado correctamente')
      
      // 3. Connect to WebSocket
      addDebugLog('🔌 Conectando a WebSocket...')
      const ws = new WebSocket(signed_url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('Connected')
        addDebugLog('✅ WebSocket conectado')
        
        // Send conversation initiation
        const initMessage = {
          type: 'conversation_initiation_client_data',
          conversation_config_override: {
            agent: {
              first_message: 'Hola, soy tu asistente Pingüino Hybe. ¿En qué puedo ayudarte?',
              language: 'es'
            }
          }
        }
        
        ws.send(JSON.stringify(initMessage))
        addDebugLog('📤 Mensaje de inicialización enviado')
        
        // Start real-time audio streaming
        startAudioStreaming()
      }

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          addDebugLog(`📨 Mensaje recibido: ${message.type}`)
          
          if (message.type === 'audio_event' && message.audio_base_64) {
            addDebugLog('🔊 Reproduciendo audio del agente')
            setAgentSpeaking(true)
            await playAudioResponse(message.audio_base_64)
          }
          
          if (message.type === 'agent_response_event') {
            addDebugLog(`🤖 Respuesta: ${message.agent_response?.substring(0, 50)}...`)
          }
          
          if (message.type === 'user_transcription_event') {
            addDebugLog(`👤 Transcripción: ${message.user_transcription}`)
          }
          
          if (message.type === 'interruption') {
            addDebugLog('⏸️ Interrupción detectada')
            setAgentSpeaking(false)
          }
          
          if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }))
          }
          
        } catch (err) {
          addDebugLog(`❌ Error procesando mensaje: ${err}`)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        setIsInCall(false)
        setConnectionStatus('Disconnected')
        addDebugLog(`🔌 WebSocket cerrado: ${event.code}`)
        stopAudioStreaming()
      }

      ws.onerror = (error) => {
        setError('Error de conexión WebSocket')
        setConnectionStatus('Error')
        addDebugLog(`❌ Error WebSocket: ${error}`)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMessage)
      setConnectionStatus('Error')
      addDebugLog(`💥 Error: ${errorMessage}`)
    }
  }

  const startAudioStreaming = () => {
    if (!processorRef.current || !sourceRef.current || !wsRef.current) return
    
    addDebugLog('🎵 Iniciando streaming de audio en tiempo real')
    setIsInCall(true)
    
    // Connect audio processing chain
    sourceRef.current.connect(processorRef.current)
    processorRef.current.connect(audioContextRef.current!.destination)
    
    // Process audio in real-time
    processorRef.current.onaudioprocess = (event) => {
      if (isMuted || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
      
      const inputBuffer = event.inputBuffer.getChannelData(0)
      
      // Convert to PCM 16-bit
      const int16Data = float32ToInt16(inputBuffer)
      const base64Audio = int16ToBase64(int16Data)
      
      // Send audio chunk immediately
      const audioMessage = {
        type: 'user_audio_chunk',
        user_audio_chunk: base64Audio
      }
      
      try {
        wsRef.current.send(JSON.stringify(audioMessage))
      } catch (err) {
        addDebugLog(`❌ Error enviando audio: ${err}`)
      }
    }
  }

  const stopAudioStreaming = () => {
    addDebugLog('🛑 Deteniendo streaming de audio')
    
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setIsInCall(false)
  }

  const playAudioResponse = async (audioBase64: string) => {
    try {
      if (!audioContextRef.current) return
      
      // Decode base64 audio
      const audioData = atob(audioBase64)
      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioArray.buffer)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      
      source.onended = () => {
        setAgentSpeaking(false)
      }
      
      source.start()
      
    } catch (err) {
      addDebugLog(`❌ Error reproduciendo audio: ${err}`)
      setAgentSpeaking(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    addDebugLog(`🎤 Micrófono ${!isMuted ? 'silenciado' : 'activado'}`)
  }

  const endCall = () => {
    addDebugLog('📞 Terminando llamada')
    
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    stopAudioStreaming()
    setIsConnected(false)
    setIsInCall(false)
    setAgentSpeaking(false)
    setConnectionStatus('Disconnected')
  }

  const clearDebugLogs = () => {
    setDebugLogs([])
  }

  useEffect(() => {
    return () => {
      endCall()
    }
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
      >
        <img 
          src="/assets/pinguinohybe.png" 
          alt="Pingüino Hybe" 
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <MessageCircle className="w-8 h-8 text-white hidden" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/pinguinohybe.png" 
              alt="Pingüino Hybe" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <MessageCircle className="w-6 h-6 text-white hidden" />
            <div>
              <h3 className="text-white font-semibold">Pingüino Hybe</h3>
              <p className="text-blue-100 text-xs">
                {isInCall ? (agentSpeaking ? '🗣️ Hablando...' : '👂 Escuchando...') : connectionStatus}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-700 text-sm font-medium">Error</p>
            </div>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        )}

        {!isInCall ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-4">
              ¡Hola! Soy tu asistente de voz Pingüino Hybe.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Conversación fluida en tiempo real
            </p>
            <button
              onClick={startVoiceCall}
              disabled={connectionStatus === 'Connecting...'}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Phone className="w-4 h-4" />
              {connectionStatus === 'Connecting...' ? 'Conectando...' : 'Iniciar Llamada'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Call Status */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                <Phone className="w-10 h-10 text-green-600" />
                {agentSpeaking && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                )}
              </div>
              <p className="text-gray-700 font-medium">
                {agentSpeaking ? 'Pingüino está hablando...' : 'Te estoy escuchando'}
              </p>
              <p className="text-gray-500 text-sm">
                Habla naturalmente, como una conversación normal
              </p>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-3">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={endCall}
                className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-full transition-colors"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                {isMuted ? '🔇 Micrófono silenciado' : '🎤 Micrófono activo'}
              </p>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {debugLogs.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Debug Logs</h4>
              <button
                onClick={clearDebugLogs}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {debugLogs.map((log, index) => (
                <div key={index} className="text-xs text-gray-600 font-mono mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}