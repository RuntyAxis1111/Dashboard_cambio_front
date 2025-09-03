import { useState } from 'react'
import { Plus, Bell, Mail, Webhook, MoreHorizontal } from 'lucide-react'

export function Subscriptions() {

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Subscriptions</h1>
          <p className="text-gray-600">
            Gestiona alertas y notificaciones para métricas clave y umbrales de rendimiento
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">Subscriptions</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg mb-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-800 font-medium">En desarrollo</span>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Sistema de alertas inteligentes y notificaciones para métricas clave. 
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </div>
                <Webhook className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-black">Webhooks</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Integrate with external systems and automation tools
            </p>
            <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black">
              Integrate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}