import { NewsletterSubscriptionForm } from '../components/NewsletterSubscriptionForm'
import { Mail, Bell, TrendingUp } from 'lucide-react'

export function Subscriptions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mantente Actualizado
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe insights exclusivos sobre la industria musical
          </p>
        </div>

        <div className="mb-12">
          <NewsletterSubscriptionForm />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Análisis en Tiempo Real
                </h3>
                <p className="text-gray-600 text-sm">
                  Recibe actualizaciones sobre las métricas más importantes de la industria musical y análisis de tendencias emergentes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Alertas Personalizadas
                </h3>
                <p className="text-gray-600 text-sm">
                  Sistema de notificaciones para eventos importantes próximamente disponible
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-lg mt-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-700 text-xs font-medium">Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}