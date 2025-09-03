import { useState } from 'react'
import { Bell } from 'lucide-react'

export function Subscriptions() {

  return (
    <div className="p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Subscriptions</h1>
          <p className="text-gray-600">
            Gestiona alertas y notificaciones para métricas clave
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
              Sistema de alertas y notificaciones para métricas clave y umbrales de rendimiento. 
              Estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}