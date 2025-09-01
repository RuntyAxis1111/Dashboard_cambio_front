import { Link, useState } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ExternalLink, ChevronDown, Search } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  // Filter projects and dashboards based on search
  const filteredProjects = projects.map(project => ({
    ...project,
    sections: project.sections.map(section => ({
      ...section,
      dashboards: section.dashboards.filter(dashboard =>
        searchTerm === '' ||
        dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.dashboards.length > 0)
  })).filter(project => project.sections.length > 0)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-neutral-400">
              Overview of all projects and their available data sources
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects or dashboards..."
              className="bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 w-80"
            />
          </div>
        </div>
        
        <div className="space-y-8">
          {filteredProjects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap]
            const isExpanded = expandedProjects.includes(project.id)
            
            return (
              <div
                key={project.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
              >
                {/* Project Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses[project.color as keyof typeof colorClasses]}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-white">{project.name}</h2>
                        <p className="text-neutral-400">{project.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="mt-4 flex gap-6 text-sm text-neutral-500">
                    <div>
                      <span className="font-medium text-neutral-300">
                        {project.sections.reduce((acc, section) => acc + section.dashboards.length, 0)}
                      </span> dashboards
                    </div>
                    <div>
                      <span className="font-medium text-neutral-300">{project.sections.length}</span> sections
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-neutral-800 bg-neutral-800/20">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {project.sections.map((section) => (
                        <div key={section.id}>
                          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                            {section.type === 'social' && <Hash className="w-4 h-4 text-neutral-500" />}
                            {section.type === 'band' && <Music className="w-4 h-4 text-neutral-500" />}
                            {section.type === 'artist' && <Megaphone className="w-4 h-4 text-neutral-500" />}
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
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-700 transition-colors group"
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
                )}
              </div>
            )
          })}
        </div>
        
        {/* Search Results Empty State */}
        {searchTerm && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
            <p className="text-neutral-400">Try searching for a different project or dashboard name</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* Special Dashboards Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
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
            </div>
      </div>
    </div>
  )
}