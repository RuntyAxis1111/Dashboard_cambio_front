import { useState } from 'react'
import { Plus, Bell, Mail, Webhook, MoreHorizontal } from 'lucide-react'

export function Subscriptions() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Subscriptions</h1>
          <p className="text-gray-600">
            Gestiona alertas y notificaciones para métricas clave
          </p>
        </div>
        
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-black">Push Notifications</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get instant alerts for critical metrics and threshold breaches
            </p>
            <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black">
              Configure
            </button>
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-black">Email Alerts</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Receive detailed reports and summaries via email
            </p>
            <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black">
              Setup
            </button>
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
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