import { useState, useRef, useEffect } from 'react'
import { X, Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react'

interface VoicePanelProps {
  isOpen: boolean
  onClose: () => void
}

type ConnectionState = 'idle' | 'connecting' | 'live' | 'stopped' | 'error'

export function VoicePanel({ isOpen, onClose }: VoicePanelProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [transcription, setTranscription] = useState<string>('')
  const [agentResponse, setAgentResponse] = useState<string>('')

  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null)

  // Audio conversion utilities
  const float32ToPCM16 = (float32Array: Float32Array): ArrayBuffer => {
    const pcm16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]))
      pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
    }
    return pcm16.buffer
  }

  const pcm16ToFloat32 = (pcm16Buffer: ArrayBuffer): Float32Array => {
    const pcm16 = new Int16Array(pcm16Buffer)
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF)
    }
    return float32
  }

  const playAudioBuffer = async (audioData: string) => {
    if (!audioContextRef.current) return

    try {
      // Decode base64 to PCM16
      const binaryString = atob(audioData)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Convert PCM16 to Float32
      const float32Data = pcm16ToFloat32(bytes.buffer)
      
      // Create AudioBuffer
      const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 16000)
      audioBuffer.copyToChannel(float32Data, 0)
      
      // Play the buffer
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      source.start()
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  const startConversation = async () => {
    try {
      setConnectionState('connecting')
      setError(null)
      setTranscription('')
      setAgentResponse('')

      // Get signed URL from our serverless endpoint
      const response = await fetch('/api/elevenlabs/signed-url')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const { signed_url } = await response.json()
      if (!signed_url) {
        throw new Error('No signed URL received')
      }

      // Create WebSocket connection
      wsRef.current = new WebSocket(signed_url)

      wsRef.current.onopen = async () => {
        console.log('WebSocket connected')
        
        // Send initialization message
        wsRef.current?.send(JSON.stringify({
          type: 'conversation_initiation_client_data',
          conversation_config_override: {
            agent: {
              first_message: 'Hola, soy Pingüino Hybe. ¿Qué dashboard quieres revisar?',
              language: 'es'
            }
          }
        }))

        // Setup audio context and microphone
        try {
          audioContextRef.current = new AudioContext({ sampleRate: 16000 })
          
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true
            }
          })
          
          mediaStreamRef.current = stream
          sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream)
          
          // Create processor for audio chunks
          processorNodeRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1)
          
          processorNodeRef.current.onaudioprocess = (event) => {
            if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
              const inputBuffer = event.inputBuffer.getChannelData(0)
              const pcm16Buffer = float32ToPCM16(inputBuffer)
              const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16Buffer)))
              
              wsRef.current.send(JSON.stringify({
                user_audio_chunk: base64Audio
              }))
            }
          }
          
          sourceNodeRef.current.connect(processorNodeRef.current)
          processorNodeRef.current.connect(audioContextRef.current.destination)
          
          setConnectionState('live')
        } catch (audioError) {
          console.error('Audio setup error:', audioError)
          setError('No se pudo acceder al micrófono. Verifica los permisos.')
          setConnectionState('error')
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle audio from agent
          if (data.audio_event?.audio_base_64) {
            playAudioBuffer(data.audio_event.audio_base_64)
          } else if (data.audio_base_64) {
            playAudioBuffer(data.audio_base_64)
          }
          
          // Handle transcriptions
          if (data.user_transcription_event?.user_transcript) {
            setTranscription(data.user_transcription_event.user_transcript)
          }
          
          // Handle agent responses
          if (data.agent_response_event?.agent_response) {
            setAgentResponse(data.agent_response_event.agent_response)
          }
          
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Error de conexión con el servidor de voz')
        setConnectionState('error')
      }

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        
        if (event.code === 1006 && event.reason.includes('Origin not allowed')) {
          setError(`Origin no permitido: ${window.location.origin}. Agrega este origin en la Allowlist del agente y solicita un nuevo signed URL.`)
        } else if (connectionState !== 'stopped') {
          setError('Conexión cerrada inesperadamente')
        }
        
        setConnectionState('stopped')
      }

    } catch (error) {
      console.error('Connection error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      setConnectionState('error')
    }
  }

  const stopConversation = () => {
    setConnectionState('stopped')
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    // Stop audio processing
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect()
      processorNodeRef.current = null
    }
    
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }
    
    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setTranscription('')
    setAgentResponse('')
    setError(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConversation()
    }
  }, [])

  // Handle panel close
  const handleClose = () => {
    if (connectionState === 'live') {
      stopConversation()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white border border-gray-300 rounded-2xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-300 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg">🐧</span>
          </div>
          <div>
            <h3 className="font-semibold text-black">Pingüino Hybe</h3>
            <p className="text-xs text-gray-600">Asistente de Voz</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Cerrar panel de voz"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionState === 'live' ? 'bg-green-500 animate-pulse' :
              connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              connectionState === 'error' ? 'bg-red-500' :
              'bg-gray-400'
            }`} />
            <span className="text-sm text-gray-600 capitalize">
              {connectionState === 'live' ? 'En vivo' :
               connectionState === 'connecting' ? 'Conectando...' :
               connectionState === 'error' ? 'Error' :
               connectionState === 'stopped' ? 'Detenido' :
               'Inactivo'}
            </span>
          </div>
          
          {connectionState === 'live' && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Transcription */}
        {transcription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">Tú dijiste:</div>
            <div className="text-sm text-blue-800">{transcription}</div>
          </div>
        )}

        {/* Agent Response */}
        {agentResponse && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium mb-1">Pingüino Hybe:</div>
            <div className="text-sm text-green-800">{agentResponse}</div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {connectionState === 'idle' || connectionState === 'stopped' || connectionState === 'error' ? (
            <button
              onClick={startConversation}
              disabled={connectionState === 'connecting'}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
            >
              <Mic className="w-4 h-4" />
              {connectionState === 'connecting' ? 'Conectando...' : 'Iniciar Conversación'}
            </button>
          ) : (
            <button
              onClick={stopConversation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors text-white"
            >
              <MicOff className="w-4 h-4" />
              Detener
            </button>
          )}
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 text-center">
          Origin: {window.location.origin}
        </div>
      </div>
    </div>
  )
}