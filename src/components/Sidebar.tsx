import { useState } from 'react'
import { Plus, Bell, Mail, Webhook, MoreHorizontal } from 'lucide-react'

export function Subscriptions() {
  const [subscriptions] = useState([
    {
      id: 1,
      project: 'PALF',
      source: 'YouTube',
      metric: 'Subscriber Growth',
      condition: 'Spike > 10%',
      frequency: 'Real-time',
      status: 'active'
    },
    {
      id: 2,
      project: 'STBV',
      source: 'Instagram',
      metric: 'Engagement Rate',
      condition: 'Drop > 5%',
      frequency: 'Daily',
      status: 'active'
    },
    {
      id: 3,
      project: 'Communities',
      source: 'Discord',
      metric: 'New Members',
      condition: 'Threshold > 1000',
      frequency: 'Weekly',
      status: 'paused'
    }
  ])

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Subscriptions</h1>
            <p className="text-gray-600">
              Manage alerts and notifications for key metrics and performance thresholds
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Create Subscription
          </button>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b border-gray-300">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Project • Source</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Metric</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Condition</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Frequency</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-200 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{sub.project}</div>
                        <div className="text-sm text-gray-600">{sub.source}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black">{sub.metric}</td>
                    <td className="px-6 py-4 text-black">{sub.condition}</td>
                    <td className="px-6 py-4 text-black">{sub.frequency}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === 'active' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-gray-300 rounded transition-colors">
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