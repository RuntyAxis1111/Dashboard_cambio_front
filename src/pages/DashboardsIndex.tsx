import { Link } from 'react-router-dom'
import { BarChart3, Users, Music, Megaphone } from 'lucide-react'

const projects = [
  {
    id: 'palf',
    name: 'PALF',
    description: 'Primary artist analytics and social media performance',
    icon: Music,
    color: 'blue',
    sections: [
      { name: 'YouTube', path: '/dashboard/palf/youtube' },
      { name: 'Instagram', path: '/dashboard/palf/instagram' },
      { name: 'TikTok', path: '/dashboard/palf/tiktok' },
      { name: 'Facebook', path: '/dashboard/palf/facebook' },
      { name: 'X (Twitter)', path: '/dashboard/palf/twitter' },
    ]
  },
  {
    id: 'stbv',
    name: 'STBV',
    description: 'Strategic brand visibility and market presence',
    icon: BarChart3,
    color: 'purple',
    sections: [
      { name: 'YouTube', path: '/dashboard/stbv/youtube' },
      { name: 'Instagram', path: '/dashboard/stbv/instagram' },
      { name: 'TikTok', path: '/dashboard/stbv/tiktok' },
    ]
  },
  {
    id: 'communities',
    name: 'Communities',
    description: 'Fan engagement and community growth metrics',
    icon: Users,
    color: 'green',
    sections: [
      { name: 'Discord', path: '/dashboard/communities/discord' },
      { name: 'Reddit', path: '/dashboard/communities/reddit' },
      { name: 'Fan Forums', path: '/dashboard/communities/forums' },
    ]
  },
  {
    id: 'artists',
    name: 'Artists',
    description: 'Individual artist performance and band analytics',
    icon: Megaphone,
    color: 'orange',
    sections: [
      { name: 'Grupo Destino', path: '/dashboard/artists/band/grupo-destino' },
      { name: 'Muzsa', path: '/dashboard/artists/band/muzsa' },
      { name: 'Jugada Maestra', path: '/dashboard/artists/band/jugada-maestra' },
    ]
  }
]

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30',
  purple: 'bg-purple-600/20 text-purple-400 group-hover:bg-purple-600/30',
  green: 'bg-green-600/20 text-green-400 group-hover:bg-green-600/30',
  orange: 'bg-orange-600/20 text-orange-400 group-hover:bg-orange-600/30',
}

export function DashboardsIndex() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboards</h1>
          <p className="text-neutral-400">
            Access analytics and performance metrics for all your projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                  <project.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-neutral-400 text-sm">{project.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Available Dashboards</h4>
                {project.sections.map((section) => (
                  <Link
                    key={section.path}
                    to={section.path}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    {section.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}