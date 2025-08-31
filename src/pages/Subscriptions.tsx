import { useState } from 'react'
import { Plus, Bell, Mail, Webhook, MoreHorizontal } from 'lucide-react'

export function Subscriptions() {
  const [showWizard, setShowWizard] = useState(false)
  
  const subscriptions = [
    {
      id: 1,
      project: 'PALF',
      source: 'YouTube',
      metric: 'Subscriber Growth',
      condition: 'Spike > 10%',
      frequency: 'Real-time',
      channel: 'Email',
      status: 'Active'
    },
    {
      id: 2,
      project: 'STBV',
      source: 'Instagram',
      metric: 'Engagement Rate',
      condition: 'Drop > 5%',
      frequency: 'Daily',
      channel: 'Webhook',
      status: 'Active'
    },
    {
      id: 3,
      project: 'Communities',
      source: 'Discord',
      metric: 'New Members',
      condition: 'Threshold > 1000',
      frequency: 'Weekly',
      channel: 'Email',
      status: 'Paused'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
            <p className="text-neutral-400">
              Manage alerts and notifications for key metrics and performance thresholds
            </p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Subscription
          </button>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Project • Source</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Metric</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Condition</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Frequency</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Channel</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-neutral-300"></th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{sub.project}</div>
                      <div className="text-sm text-neutral-400">{sub.source}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">{sub.metric}</td>
                    <td className="px-6 py-4 text-neutral-300">{sub.condition}</td>
                    <td className="px-6 py-4 text-neutral-300">{sub.frequency}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {sub.channel === 'Email' ? (
                          <Mail className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <Webhook className="w-4 h-4 text-neutral-400" />
                        )}
                        <span className="text-neutral-300">{sub.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'Active' 
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-neutral-600/20 text-neutral-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-neutral-700 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No subscriptions yet</h3>
            <p className="text-neutral-400 mb-6">Create your first subscription to get notified about important changes</p>
            <button 
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Create Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  )
}