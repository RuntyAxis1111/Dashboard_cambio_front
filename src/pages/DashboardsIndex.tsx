import { Link, useNavigate } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ChevronDown, ExternalLink, Hash } from 'lucide-react'
import { useState } from 'react'
import { projects } from '../lib/dashboards'
import { SectionCard } from '../components/SectionCard'

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
  // Controlled state for all section cards - multi-open mode
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  
  // Flag to easily switch to accordion mode (only one open at a time)
  const accordionMode = false
  const navigate = useNavigate()

  const handleToggle = (projectId: string) => {
    setOpenMap(prev => {
      if (accordionMode) {
        // Accordion mode: close all others, toggle current
        const newMap: Record<string, boolean> = {}
        Object.keys(prev).forEach(key => {
          newMap[key] = false
        })
        newMap[projectId] = !prev[projectId]
        return newMap
      } else {
        // Multi-open mode: just toggle current
        return {
          ...prev,
          [projectId]: !prev[projectId]
        }
      }
    })
  }

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Dashboards</h1>
          <p className="text-gray-600">
            Access analytics and performance metrics for all your projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap]
            const isOpen = openMap[project.id] || false
            
            return (
              <SectionCard
                key={project.id}
                id={project.id}
                title={project.name}
                description={project.description}
                icon={<IconComponent className="w-6 h-6" />}
                color={project.color}
                open={isOpen}
                onToggle={() => handleToggle(project.id)}
              >
                {/* Quick Access buttons - always visible */}
                <div className="flex gap-2 mb-4">
                  <Link
                    to={`/dashboard/${project.id}/${project.sections[0]?.dashboards[0]?.id || ''}`}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black"
                  >
                    Quick View
                  </Link>
                  <Link
                    to="/projects"
                    className="px-3 py-1.5 border border-gray-300 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors text-black"
                  >
                    View All
                  </Link>
                </div>
                
                {/* Collapsible content - sections and dashboards */}
                <div className="space-y-4">
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
              </SectionCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}