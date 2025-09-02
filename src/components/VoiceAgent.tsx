import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import ConversationalAI from '../lib/conversationalAI';

interface VoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAgent({ isOpen, onClose }: VoiceAgentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Disconnected');
  
  const aiRef = useRef<ConversationalAI | null>(null);

  useEffect(() => {
    if (isOpen && !aiRef.current) {
      try {
        aiRef.current = new ConversationalAI();
      } catch (err) {
        setError('Failed to initialize AI: Check your API keys');
      }
    }

    return () => {
      if (aiRef.current) {
        aiRef.current.endConversation();
        aiRef.current = null;
      }
    };
  }, [isOpen]);

  const startConversation = async () => {
    if (!aiRef.current) return;

    try {
      setError(null);
      setStatus('Connecting...');
      
      await aiRef.current.startConversation({
        voice: 'pNInz6obpgDQGcFmaJgB', // Adam voice
        model: 'gpt-4'
      });
      
      setIsConnected(true);
      setStatus('Connected');
      
      // Auto-start listening
      setTimeout(() => {
        startListening();
      }, 1000);
      
    } catch (err) {
      setError(`Connection failed: ${err}`);
      setStatus('Failed');
    }
  };

  const endConversation = async () => {
    if (!aiRef.current) return;

    try {
      await aiRef.current.endConversation();
      setIsConnected(false);
      setIsListening(false);
      setStatus('Disconnected');
    } catch (err) {
      setError(`Error ending conversation: ${err}`);
    }
  };

  const startListening = () => {
    if (!aiRef.current || !isConnected) return;
    
    aiRef.current.startListening();
    setIsListening(true);
    setStatus('Listening...');
  };

  const stopListening = () => {
    if (!aiRef.current) return;
    
    aiRef.current.stopListening();
    setIsListening(false);
    setStatus('Connected');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto">
        <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-300 bg-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black">HYBE AI Assistant</h2>
                <p className="text-sm text-gray-600">Voice-powered data insights</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <PhoneOff className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isConnected 
                  ? isListening 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected 
                    ? isListening 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-blue-500'
                    : 'bg-gray-400'
                }`} />
                {status}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-6">
              {!isConnected ? (
                <button
                  onClick={startConversation}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors text-white"
                >
                  <Phone className="w-5 h-5" />
                  Start Conversation
                </button>
              ) : (
                <>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isListening ? 'Stop' : 'Listen'}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors text-black"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={endConversation}
                    className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-medium transition-colors text-white"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600">
              {!isConnected ? (
                <p>Click "Start Conversation" to begin talking with the AI assistant</p>
              ) : (
                <div className="space-y-1">
                  <p><strong>Try asking:</strong></p>
                  <p>"¿Cómo está el rendimiento de PALF en Instagram?"</p>
                  <p>"Muéstrame las métricas de engagement"</p>
                  <p>"¿Qué insights tienes de los dashboards?"</p>
                </div>
              )}
            </div>
          </div>

          {/* API Keys Notice */}
          <div className="p-4 bg-gray-100 border-t border-gray-300">
            <div className="text-xs text-gray-600 text-center">
              <p>Requires ElevenLabs & OpenAI API keys</p>
              <p>Configure in .env file for localhost</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}