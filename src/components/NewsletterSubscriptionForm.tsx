import { useState, useEffect } from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2, Check, X } from 'lucide-react'
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
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Verificando estado de suscripción...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'subscribed') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ya estás suscrito
            </h3>
            <p className="text-gray-600 mb-1">
              Recibes nuestro newsletter semanalmente
            </p>
            <p className="text-sm text-gray-500 mb-6">
              en <strong>{user?.email}</strong>
            </p>

            {subscriptionData && subscriptionData.estado === 'activo' && (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-sm font-medium">Suscripción Activa</span>
                </div>

                <button
                  onClick={handleUnsubscribe}
                  disabled={isProcessing}
                  className="mt-4 px-6 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Cancelar suscripción
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">¿Qué estás recibiendo?</h3>
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
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Suscríbete a nuestro Newsletter
          </h2>
          <p className="text-gray-600 mb-4">
            Recibe las últimas actualizaciones, insights y análisis directamente en tu inbox
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600">
              Suscripción para:
            </p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {user?.email}
            </p>
          </div>

          {subscriberCount !== null && subscriberCount > 0 && (
            <p className="text-sm text-gray-500">
              Únete a {subscriberCount} personas que ya reciben nuestro newsletter
            </p>
          )}
        </div>

        {status === 'error' && errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={status === 'subscribing'}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'subscribing' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Suscribiendo...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Suscribirme con un click
            </>
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">¿Qué recibirás?</h3>
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
          <p className="text-xs text-gray-500 mt-4">
            Frecuencia: Semanal. Al suscribirte aceptas recibir el newsletter y puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  )
}
