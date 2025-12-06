import { useState, useEffect } from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

type SubscriptionStatus = 'checking' | 'not_subscribed' | 'subscribed' | 'subscribing' | 'error'

export function NewsletterSubscriptionForm() {
  const { user } = useAuth()
  const [status, setStatus] = useState<SubscriptionStatus>('checking')
  const [errorMessage, setErrorMessage] = useState('')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const checkSubscriptionAndCount = async () => {
      if (!user?.email) return

      // Verificar si ya está suscrito
      const { data: existingSubscription } = await supabase
        .from('subscriptores_newsletter_general')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .maybeSingle()

      // Obtener conteo de suscriptores activos
      const { count } = await supabase
        .from('subscriptores_newsletter_general')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activo')

      setSubscriberCount(count)

      if (existingSubscription) {
        setSubscriptionData(existingSubscription)
        setStatus('subscribed')
      } else {
        setStatus('not_subscribed')
      }
    }

    checkSubscriptionAndCount()
  }, [user])

  const handleSubscribe = async () => {
    if (!user?.email) {
      setStatus('error')
      setErrorMessage('No se pudo obtener tu email. Por favor intenta nuevamente.')
      return
    }

    setStatus('subscribing')
    setErrorMessage('')

    try {
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || null

      const { error } = await supabase
        .from('subscriptores_newsletter_general')
        .insert([
          {
            email: user.email.toLowerCase(),
            nombre: userName,
            acepto_terminos: true,
          },
        ])

      if (error) {
        if (error.code === '23505') {
          setStatus('subscribed')
        } else {
          setStatus('error')
          setErrorMessage('Ocurrió un error al procesar tu suscripción. Por favor intenta nuevamente.')
        }
      } else {
        setStatus('subscribed')
        if (subscriberCount !== null) {
          setSubscriberCount(subscriberCount + 1)
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setStatus('error')
      setErrorMessage('Ocurrió un error inesperado. Por favor intenta nuevamente.')
    }
  }

  const handleUnsubscribe = async () => {
    if (!user?.email) return

    setIsProcessing(true)
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('subscriptores_newsletter_general')
        .update({
          estado: 'cancelado',
          fecha_cancelacion: new Date().toISOString()
        })
        .eq('email', user.email.toLowerCase())

      if (error) {
        setStatus('error')
        setErrorMessage('Ocurrió un error al cancelar tu suscripción.')
      } else {
        setStatus('not_subscribed')
        setSubscriptionData(null)
        if (subscriberCount !== null && subscriberCount > 0) {
          setSubscriberCount(subscriberCount - 1)
        }
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setStatus('error')
      setErrorMessage('Ocurrió un error inesperado.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === 'checking') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="flex-1">
            <p className="text-gray-600">Verificando estado de suscripción...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Newsletter Semanal
            </h3>
            <p className="text-sm text-gray-600">
              Análisis de métricas, insights exclusivos y actualizaciones de la industria musical
            </p>
            {subscriberCount !== null && subscriberCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {subscriberCount} {subscriberCount === 1 ? 'persona suscrita' : 'personas suscritas'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {status === 'subscribed' ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-sm font-medium">Suscrito</span>
                </div>
                <button
                  onClick={handleUnsubscribe}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={status === 'subscribing'}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'subscribing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suscribiendo...
                  </>
                ) : (
                  'Suscribirme'
                )}
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Ver detalles"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {status === 'error' && errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">¿Qué incluye este newsletter?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Análisis semanal de métricas y tendencias</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Insights exclusivos sobre la industria musical</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Reportes de performance de artistas destacados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Actualizaciones de nuevas funcionalidades de la plataforma</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 mb-1">Tu suscripción:</p>
                  <p>{user?.email}</p>
                  <p className="mt-2">Frecuencia: Semanal. Puedes cancelar en cualquier momento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
