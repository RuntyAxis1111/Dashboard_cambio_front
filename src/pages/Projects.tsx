import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ExternalLink, ChevronDown, Search, Hash } from 'lucide-react'
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDropdownToggle = (projectId: string) => {
    setOpenDropdown(openDropdown === projectId ? null : projectId)
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Projects</h1>
          <p className="text-gray-600">
            Overview of all projects and their available data sources
          </p>
        </div>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects or dashboards..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap]
            const isOpen = openDropdown === project.id
            
            return (
              <div
                key={project.id}
                className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-all duration-200"
              >
                {/* Project Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-black mb-1">{project.name}</h3>
                        <button className="text-gray-500 hover:text-black">
                          <span className="text-sm">Expand</span>
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{project.sections.reduce((acc, section) => acc + section.dashboards.length, 0)} dashboards</span>
                        <span>{project.sections.length} sections</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDropdownToggle(project.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Quick Access */}
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/${project.id}/${project.sections[0]?.dashboards[0]?.id || ''}`}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black"
                    >
                      Quick View
                    </Link>
                    <Link
                      to="/dashboards"
                      className="px-3 py-1.5 border border-gray-300 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors text-black"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                
                {/* Dropdown Content */}
                {isOpen && (
                  <div className="border-t border-gray-300 bg-gray-200">
                    <div className="p-4 space-y-4">
                      {project.sections.map((section) => (
                        <div key={section.id}>
                          <h4 className="text-sm font-medium text-black mb-2 flex items-center gap-2">
                            {section.type === 'social' && <Hash className="w-3 h-3" />}
                            {section.type === 'band' && <Music className="w-3 h-3" />}
                            {section.type === 'artist' && <Megaphone className="w-3 h-3" />}
                            {section.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-1">
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
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-black hover:bg-gray-300 transition-colors group"
                              >
                                <span>{dashboard.name}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}