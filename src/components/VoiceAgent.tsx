import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, AlertCircle } from 'lucide-react'

interface VoiceAgentProps {
  isOpen: boolean
  onToggle: () => void
}

export function VoiceAgent({ isOpen, onToggle }: VoiceAgentProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID

  // Debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    setDebugLogs(prev => [logMessage, ...prev.slice(0, 9)]) // Keep last 10 logs
  }

  const connectToAgent = async () => {
    try {
      setError(null)
      setConnectionStatus('Connecting...')
      addDebugLog('🔄 Iniciando conexión a ElevenLabs...')
      
      if (!agentId) {
        throw new Error('Agent ID no configurado en variables de entorno')
      }
      
      addDebugLog(`🤖 Agent ID: ${agentId}`)
      
      // Para desarrollo, llamamos directamente a ElevenLabs API
      // En producción, esto debería ir a través de nuestro endpoint serverless
      addDebugLog('📡 Llamando directamente a ElevenLabs API...')
      
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
      if (!apiKey) {
        throw new Error('API Key de ElevenLabs no configurada')
      }
      
      const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`
      addDebugLog(`🌐 URL: ${url}`)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      })
      
      addDebugLog(`📊 ElevenLabs response status: ${response.status}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        addDebugLog(`❌ ElevenLabs error: ${errorText}`)
        
        let errorMessage = `ElevenLabs API error: ${response.status}`
        if (response.status === 401) {
          errorMessage = 'Invalid API key - check xi-api-key header'
        } else if (response.status === 403) {
          errorMessage = 'Origin not allowed - check agent allowlist settings'
        } else if (response.status === 404) {
          errorMessage = 'Agent not found - check agent_id'
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      addDebugLog(`✅ ElevenLabs response: ${JSON.stringify(data)}`)
      
      const signedUrl = data.signed_url
      if (!signedUrl) {
        throw new Error('No signed_url in ElevenLabs response')
      }
      
      // Connect to ElevenLabs WebSocket
      addDebugLog('🔌 Conectando a WebSocket...')
      const ws = new WebSocket(signedUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('Connected')
        addDebugLog('✅ WebSocket conectado exitosamente')
        
        // Send initial conversation setup
        const initMessage = {
          type: 'conversation_initiation_client_data',
          conversation_config_override: { 
            agent: { 
              first_message: 'Hola', 
              language: 'es' 
            } 
          }
        }
        
        addDebugLog('📤 Enviando mensaje de inicialización...')
        ws.send(JSON.stringify(initMessage))
        addDebugLog('✅ Mensaje de inicialización enviado')
      }

      ws.onmessage = async (event) => {
        try {
          addDebugLog(`📨 Mensaje recibido: ${event.data.substring(0, 100)}...`)
          
          // Handle different message types according to ElevenLabs protocol
          const message = JSON.parse(event.data)
          addDebugLog(`📋 Tipo de mensaje: ${message.type}`)
          
          if (message.type === 'audio_event' && message.audio_base_64) {
            addDebugLog('🔊 Audio recibido del agente')
            await playAudioResponse(message.audio_base_64)
          }
          
          if (message.type === 'agent_response_event') {
            addDebugLog(`🤖 Respuesta del agente: ${message.agent_response}`)
          }
          
          if (message.type === 'user_transcription_event') {
            addDebugLog(`👤 Transcripción usuario: ${message.user_transcription}`)
          }
          
          if (message.type === 'interruption') {
            addDebugLog('⏸️ Interrupción recibida')
            setIsSpeaking(false)
          }
          
          if (message.type === 'ping') {
            addDebugLog('🏓 Ping recibido, enviando pong')
            ws.send(JSON.stringify({ type: 'pong' }))
          }
          
        } catch (err) {
          addDebugLog(`❌ Error procesando mensaje: ${err}`)
          console.error('Error processing message:', err)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        setConnectionStatus('Disconnected')
        setIsListening(false)
        setIsSpeaking(false)
        addDebugLog(`🔌 WebSocket cerrado: ${event.code} - ${event.reason}`)
      }

      ws.onerror = (error) => {
        setError('Connection error')
        setConnectionStatus('Error')
        addDebugLog(`❌ Error de WebSocket: ${error}`)
        console.error('WebSocket error:', error)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed'
      setError(errorMessage)
      setConnectionStatus('Error')
      addDebugLog(`💥 Error de conexión: ${errorMessage}`)
    }
  }

  const playAudioResponse = async (audioBase64: string) => {
    try {
      setIsSpeaking(true)
      addDebugLog('🎵 Reproduciendo respuesta de audio...')
      
      // Decode base64 audio
      const audioData = atob(audioBase64)
      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }
      
      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
        addDebugLog('🎧 AudioContext creado')
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioArray.buffer)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      
      source.onended = () => {
        setIsSpeaking(false)
        addDebugLog('🔇 Audio terminado')
      }
      
      source.start()
      addDebugLog('▶️ Audio iniciado')
      
    } catch (err) {
      addDebugLog(`❌ Error reproduciendo audio: ${err}`)
      console.error('Error playing audio:', err)
      setIsSpeaking(false)
    }
  }

  const startListening = async () => {
    try {
      addDebugLog('🎤 Iniciando grabación...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          addDebugLog(`📊 Chunk de audio: ${event.data.size} bytes`)
        }
      }
      
      mediaRecorder.onstop = async () => {
        addDebugLog('⏹️ Grabación detenida, procesando audio...')
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
        await sendAudioToAgent(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsListening(true)
      addDebugLog('🔴 Grabación iniciada')
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsListening(false)
          addDebugLog('⏰ Grabación detenida por timeout')
        }
      }, 5000)
      
    } catch (err) {
      const errorMessage = `Microphone access denied: ${err}`
      setError(errorMessage)
      addDebugLog(`❌ Error de micrófono: ${errorMessage}`)
      console.error('Error accessing microphone:', err)
    }
  }

  const sendAudioToAgent = async (audioBlob: Blob) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addDebugLog('❌ WebSocket no está abierto')
      return
    }

    try {
      addDebugLog(`📤 Enviando audio: ${audioBlob.size} bytes`)
      
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      addDebugLog(`📦 Audio convertido a base64: ${base64Audio.length} caracteres`)
      
      // Send audio to agent
      const message = {
        type: 'user_audio_chunk',
        user_audio_chunk: base64Audio
      }
      
      wsRef.current.send(JSON.stringify(message))
      addDebugLog('✅ Audio enviado al agente')
      
    } catch (err) {
      addDebugLog(`❌ Error enviando audio: ${err}`)
      console.error('Error sending audio:', err)
    }
  }

  const disconnect = () => {
    addDebugLog('🔌 Desconectando...')
    if (wsRef.current) {
      wsRef.current.close()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
    setIsSpeaking(false)
    addDebugLog('✅ Desconectado')
  }

  const clearDebugLogs = () => {
    setDebugLogs([])
  }

  useEffect(() => {
    return () => {
      disconnect()
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
              <p className="text-blue-100 text-xs">{connectionStatus}</p>
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

        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">¡Hola! Soy tu asistente de voz Pingüino Hybe.</p>
            <button
              onClick={connectToAgent}
              disabled={connectionStatus === 'Connecting...'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {connectionStatus === 'Connecting...' ? 'Conectando...' : 'Conectar Agente'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">
                {isSpeaking ? '🗣️ Hablando...' : 
                 isListening ? '👂 Escuchando...' : 
                 '💬 Listo para conversar'}
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={startListening}
                  disabled={isListening || isSpeaking}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isListening 
                      ? 'bg-red-600 text-white' 
                      : 'bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Grabando...' : 'Hablar'}
                </button>
                
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Desconectar
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Haz clic en "Hablar" y pregúntame sobre los datos de HYBE LATAM
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