import { NewsletterSubscriptionForm } from '../components/NewsletterSubscriptionForm'
import { Mail, Bell, TrendingUp } from 'lucide-react'

export function Subscriptions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Suscripciones
              </h1>
              <p className="text-gray-600">
                Gestiona tus preferencias de notificaciones
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Newsletters</h2>
            <NewsletterSubscriptionForm />
          </div>

          <div className="pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Próximamente</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Alertas en Tiempo Real
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Notificaciones instantáneas sobre cambios importantes en métricas
                    </p>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md mt-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-700 text-xs font-medium">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Alertas Personalizadas
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Configura alertas específicas para tus artistas favoritos
                    </p>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md mt-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-700 text-xs font-medium">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}