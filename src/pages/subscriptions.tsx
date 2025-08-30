import { useState } from 'react'
import { Bell, Plus, Edit, Trash2, Mail, Webhook } from 'lucide-react'
import { Button } from '../components/ui/button'

const subscriptions = [
  {
    id: 1,
    name: 'PALF YouTube Spike Alert',
    project: 'PALF',
    source: 'YouTube',
    metric: 'Views',
    condition: 'Increase > 50%',
    frequency: 'Real-time',
    channel: 'Email',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Daddy Yankee Engagement Drop',
    project: 'Artists',
    source: 'Instagram',
    metric: 'Engagement Rate',
    condition: 'Decrease > 20%',
    frequency: 'Daily',
    channel: 'Webhook',
    status: 'Active'
  },
  {
    id: 3,
    name: 'STBV Weekly Summary',
    project: 'STBV',
    source: 'All Platforms',
    metric: 'Summary Report',
    condition: 'Weekly',
    frequency: 'Weekly',
    channel: 'Email',
    status: 'Paused'
  }
]

export function Subscriptions() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage alerts and notifications for your projects
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Subscription
        </Button>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Name</th>
                <th className="text-left p-4 font-semibold text-foreground">Project</th>
                <th className="text-left p-4 font-semibold text-foreground">Condition</th>
                <th className="text-left p-4 font-semibold text-foreground">Frequency</th>
                <th className="text-left p-4 font-semibold text-foreground">Channel</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{sub.name}</div>
                    <div className="text-sm text-muted-foreground">{sub.source} - {sub.metric}</div>
                  </td>
                  <td className="p-4 text-foreground">{sub.project}</td>
                  <td className="p-4 text-foreground">{sub.condition}</td>
                  <td className="p-4 text-foreground">{sub.frequency}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {sub.channel === 'Email' ? (
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Webhook className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-foreground">{sub.channel}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'Active' 
                        ? 'bg-hybe-green text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State for new users */}
      {subscriptions.length === 0 && (
        <div className="text-center py-16 space-y-6">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Subscriptions Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create your first subscription to get notified about important changes in your data.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Subscription
          </Button>
        </div>
      )}
    </div>
  )
}