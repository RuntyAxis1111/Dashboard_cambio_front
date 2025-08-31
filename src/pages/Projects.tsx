import { Link } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ExternalLink } from 'lucide-react'

const projects = [
  {
    id: 'palf',
    name: 'PALF',
    description: 'Primary artist analytics and social media performance',
    icon: Music,
    color: 'blue',
    sections: {
      social: [
        { name: 'YouTube', path: '/dashboard/palf/youtube' },
        { name: 'Instagram', path: '/dashboard/palf/instagram' },
        { name: 'TikTok', path: '/dashboard/palf/tiktok' },
        { name: 'Facebook', path: '/dashboard/palf/facebook' },
        { name: 'X (Twitter)', path: '/dashboard/palf/twitter' },
      ],
      bands: [
        { name: 'Muzsa', path: '/dashboard/palf/band/muzsa' },
        { name: 'Grupo Destino', path: '/dashboard/palf/band/grupo-destino' },
      ],
      pr: [
        { name: 'PR Panel', path: '/dashboard/palf/pr-panel' },
        { name: 'Press Releases', path: '/dashboard/palf/press-releases' },
      ]
    }
  },
  {
    id: 'stbv',
    name: 'STBV',
    description: 'Strategic brand visibility and market presence',
    icon: BarChart3,
    color: 'purple',
    sections: {
      social: [
        { name: 'YouTube', path: '/dashboard/stbv/youtube' },
        { name: 'Instagram', path: '/dashboard/stbv/instagram' },
        { name: 'TikTok', path: '/dashboard/stbv/tiktok' },
      ],
      bands: [
        { name: 'Main Brand', path: '/dashboard/stbv/band/main-brand' },
      ],
      pr: [
        { name: 'Brand Communications', path: '/dashboard/stbv/brand-communications' },
      ]
    }
  },
  {
    id: 'communities',
    name: 'Communities',
    description: 'Fan engagement and community growth metrics',
    icon: Users,
    color: 'green',
    sections: {
      social: [
        { name: 'Discord', path: '/dashboard/communities/discord' },
        { name: 'Reddit', path: '/dashboard/communities/reddit' },
        { name: 'Fan Forums', path: '/dashboard/communities/forums' },
      ],
      bands: [],
      pr: [
        { name: 'Community Guidelines', path: '/dashboard/communities/guidelines' },
      ]
    }
  }
]

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  purple: 'bg-purple-600/20 text-purple-400',
  green: 'bg-green-600/20 text-green-400',
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
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                  <project.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{project.name}</h2>
                  <p className="text-neutral-400">{project.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                    <Megaphone className="w-5 h-5" />
                    Social Media
                  </h3>
                  <div className="space-y-2">
                    {project.sections.social.map((section) => (
                      <Link
                        key={section.path}
                        to={section.path}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                      >
                        <span className="text-neutral-300 group-hover:text-white">{section.name}</span>
                        <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                      </Link>
                    ))}
                  </div>
                </div>
                
                {project.sections.bands.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Bands
                    </h3>
                    <div className="space-y-2">
                      {project.sections.bands.map((section) => (
                        <Link
                          key={section.path}
                          to={section.path}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                        >
                          <span className="text-neutral-300 group-hover:text-white">{section.name}</span>
                          <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Public Relations
                  </h3>
                  <div className="space-y-2">
                    {project.sections.pr.map((section) => (
                      <Link
                        key={section.path}
                        to={section.path}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                      >
                        <span className="text-neutral-300 group-hover:text-white">{section.name}</span>
                        <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}