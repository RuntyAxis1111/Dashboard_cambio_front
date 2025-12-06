import { useState } from 'react'
import { Mail, User, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  email: string
  nombre: string
}

export function NewsletterSubscriptionForm() {
  const [formData, setFormData] = useState<FormData>({ email: '', nombre: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  useState(() => {
    const fetchSubscriberCount = async () => {
      const { count } = await supabase
        .from('subscriptores_newsletter_general')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activo')

      if (count !== null) {
        setSubscriberCount(count)
      }
    }
    fetchSubscriberCount()
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) {
      setFormState('error')
      setErrorMessage('Por favor ingresa un email válido')
      return
    }

    if (!acceptedTerms) {
      setFormState('error')
      setErrorMessage('Debes aceptar los términos y condiciones')
      return
    }

    setFormState('loading')
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('subscriptores_newsletter_general')
        .insert([
          {
            email: formData.email.toLowerCase().trim(),
            nombre: formData.nombre.trim() || null,
            acepto_terminos: acceptedTerms,
          },
        ])

      if (error) {
        if (error.code === '23505') {
          setFormState('error')
          setErrorMessage('Este email ya está suscrito a nuestro newsletter')
        } else {
          setFormState('error')
          setErrorMessage('Ocurrió un error al procesar tu suscripción. Por favor intenta nuevamente.')
        }
      } else {
        setFormState('success')
        if (subscriberCount !== null) {
          setSubscriberCount(subscriberCount + 1)
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setFormState('error')
      setErrorMessage('Ocurrió un error inesperado. Por favor intenta nuevamente.')
    }
  }

  const handleReset = () => {
    setFormData({ email: '', nombre: '' })
    setAcceptedTerms(false)
    setFormState('idle')
    setErrorMessage('')
  }

  if (formState === 'success') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Suscripción exitosa!
            </h3>
            <p className="text-gray-600 mb-1">
              Te has suscrito exitosamente a nuestro newsletter
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Recibirás actualizaciones en <strong>{formData.email}</strong>
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Suscribir otro email
            </button>
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
          <p className="text-gray-600">
            Recibe las últimas actualizaciones, insights y análisis directamente en tu inbox
          </p>
          {subscriberCount !== null && subscriberCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Únete a {subscriberCount} personas que ya reciben nuestro newsletter
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  formState === 'error' && errorMessage.includes('email')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
                disabled={formState === 'loading'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Tu nombre"
                disabled={formState === 'loading'}
              />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={formState === 'loading'}
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Acepto recibir el newsletter semanal y entiendo que puedo cancelar mi suscripción en cualquier momento
            </label>
          </div>

          {formState === 'error' && errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState === 'loading' || !formData.email || !acceptedTerms}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formState === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Suscribiendo...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Suscribirse
              </>
            )}
          </button>
        </form>

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
            Frecuencia: Semanal. Puedes cancelar tu suscripción en cualquier momento desde cualquier email que recibas.
          </p>
        </div>
      </div>
    </div>
  )
}
