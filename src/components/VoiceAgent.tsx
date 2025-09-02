import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react'

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
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID

  const connectToAgent = async () => {
    try {
      setError(null)
      setConnectionStatus('Connecting...')
      
      // Get signed URL from our API
      const response = await fetch('/api/elevenlabs/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get signed URL')
      }

      const { signedUrl } = await response.json()
      
      // Connect to ElevenLabs WebSocket
      const ws = new WebSocket(signedUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('Connected')
        console.log('Connected to ElevenLabs agent')
      }

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.type === 'audio' && message.audio_event) {
            // Handle audio response from agent
            const audioData = message.audio_event.audio_base_64
            if (audioData) {
              await playAudioResponse(audioData)
            }
          }
          
          if (message.type === 'interruption') {
            setIsSpeaking(false)
          }
          
        } catch (err) {
          console.error('Error processing message:', err)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        setConnectionStatus('Disconnected')
        setIsListening(false)
        setIsSpeaking(false)
        console.log('Disconnected from ElevenLabs agent')
      }

      ws.onerror = (error) => {
        setError('Connection error')
        setConnectionStatus('Error')
        console.error('WebSocket error:', error)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnectionStatus('Error')
    }
  }

  const playAudioResponse = async (audioBase64: string) => {
    try {
      setIsSpeaking(true)
      
      // Decode base64 audio
      const audioData = atob(audioBase64)
      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }
      
      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioArray.buffer)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      
      source.onended = () => {
        setIsSpeaking(false)
      }
      
      source.start()
      
    } catch (err) {
      console.error('Error playing audio:', err)
      setIsSpeaking(false)
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
        await sendAudioToAgent(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsListening(true)
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsListening(false)
        }
      }, 5000)
      
    } catch (err) {
      setError('Microphone access denied')
      console.error('Error accessing microphone:', err)
    }
  }

  const sendAudioToAgent = async (audioBlob: Blob) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return
    }

    try {
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      // Send audio to agent
      const message = {
        user_audio_chunk: base64Audio
      }
      
      wsRef.current.send(JSON.stringify(message))
      
    } catch (err) {
      console.error('Error sending audio:', err)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
    setIsSpeaking(false)
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
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden z-50">
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
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">¡Hola! Soy tu asistente de voz Pingüino Hybe.</p>
            <button
              onClick={connectToAgent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Conectar Agente
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
                      : 'bg-green-600 hover:bg-green-500 text-white disabled:opacity-50'
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
                Mantén presionado "Hablar" y pregúntame sobre los datos de HYBE LATAM
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}