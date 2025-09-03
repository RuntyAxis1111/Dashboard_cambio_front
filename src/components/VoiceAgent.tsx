import { useState } from 'react'
import { MessageCircle, X, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface VoiceAgentProps {
  isOpen: boolean
  onToggle: () => void
}

export function VoiceAgent({ isOpen, onToggle }: VoiceAgentProps) {
  const [nombre, setNombre] = useState('')
  const [numeroTelefono, setNumeroTelefono] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim() || !numeroTelefono.trim()) {
      setErrorMessage('Por favor completa todos los campos')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // 1. Guardar en Supabase
      const { error } = await supabase
        .from('llamadas_solicitudes')
        .insert([
          {
            nombre: nombre.trim(),
            numero_telefono: numeroTelefono.trim()
          }
        ])

      if (error) {
        throw error
      }

      // 2. Enviar webhook a N8N
      try {
        const webhookResponse = await fetch('https://runtyaxis.app.n8n.cloud/webhook/47d3362a-3589-4981-bbcc-4732937933e0', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            numero_telefono: numeroTelefono.trim(),
            timestamp: new Date().toISOString(),
            source: 'pingüino_hybe'
          })
        })
        
        if (!webhookResponse.ok) {
          console.warn('Webhook N8N falló, pero datos guardados en Supabase')
        } else {
          console.log('✅ Webhook N8N enviado exitosamente')
        }
      } catch (webhookError) {
        console.warn('Error enviando webhook N8N:', webhookError)
        // No fallar todo el proceso si el webhook falla
      }
      setSubmitStatus('success')
      setNombre('')
      setNumeroTelefono('')
      
      // Auto-cerrar después de 3 segundos
      setTimeout(() => {
        setSubmitStatus('idle')
        onToggle()
      }, 3000)

    } catch (error) {
      console.error('Error guardando solicitud:', error)
      setErrorMessage('Error al enviar la solicitud. Inténtalo de nuevo.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <p className="text-blue-100 text-xs">Solicitar llamada</p>
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
      <div className="p-6">
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">¡Solicitud enviada!</h3>
            <p className="text-gray-600 text-sm">
              El Pingüino te llamará pronto al número que proporcionaste.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                ¡Hola! Soy Pingüino Hybe
              </h3>
              <p className="text-gray-600 text-sm">
                Déjame tu número y te llamaré para platicar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-black mb-2">
                  Tu nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-black mb-2">
                  Número de teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={numeroTelefono}
                  onChange={(e) => setNumeroTelefono(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  disabled={isSubmitting}
                />
              </div>

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    Solicitar llamada
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Te llamaremos en los próximos minutos
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}