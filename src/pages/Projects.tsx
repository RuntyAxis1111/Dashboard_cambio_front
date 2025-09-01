import { Link } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ExternalLink } from 'lucide-react'
import { projects } from '../lib/dashboards'

const iconMap = {
  Music,
  BarChart3,
  Users,
  Megaphone
}

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  purple: 'bg-purple-600/20 text-purple-400',
  green: 'bg-green-600/20 text-green-400',
  orange: 'bg-orange-600/20 text-orange-400',
}

export function Projects() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-neutral-400">
            Overview of all projects and their available data sources
          </p>
        </div>
        
        <div className="space-y-8">
          {projects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap]
            
            return (
              <div
                key={project.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{project.name}</h2>
                    <p className="text-neutral-400">{project.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.sections.map((section) => (
                    <div key={section.id}>
                      <h3 className="text-lg font-medium text-white mb-3">
                        {section.name}
                      </h3>
                      <div className="space-y-2">
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
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                          >
                            <span className="text-neutral-300 group-hover:text-white">{dashboard.name}</span>
                            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
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
        
        {/* Special dashboards section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-600/20 text-yellow-400 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Special Dashboards</h2>
              <p className="text-neutral-400">Marketing and news analytics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Marketing</h3>
              <Link
                to="/ai/mmm"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
              >
                <span className="text-neutral-300 group-hover:text-white">MMM Results</span>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
              </Link>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-3">News & Media</h3>
              <a
                href="https://app.meltwater.com/shareable-dashboards/presentation/viewer/fe3558eb-fc9b-42cd-a3b2-acfce10aa240#slide-AF-contentStream"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
              >
                <span className="text-neutral-300 group-hover:text-white">News (Meltwater)</span>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}