import { Link } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone } from 'lucide-react'
import { projects } from '../lib/dashboards'

const iconMap = {
  Music,
  BarChart3,
  Users,
  Megaphone
}

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
          {projects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap]
            
            return (
              <div
                key={project.id}
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{project.name}</h3>
                    <p className="text-neutral-400 text-sm">{project.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {project.sections.map((section) => (
                    <div key={section.id}>
                      <h4 className="text-sm font-medium text-neutral-300 mb-2">{section.name}</h4>
                      <div className="space-y-1">
                        {section.dashboards.map((dashboard) => (
                          <Link
                            key={dashboard.id}
                            to={
                              project.id === 'artists' 
                                ? `/dashboard/artists/${dashboard.id}`
                                : section.type === 'band'
                                ? `/dashboard/${project.id}/band/${dashboard.id}`
                                : `/dashboard/${project.id}/${dashboard.id}`
                            }
                            className="block px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            {dashboard.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}