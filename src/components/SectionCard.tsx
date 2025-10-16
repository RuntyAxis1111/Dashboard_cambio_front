import { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface SectionCardProps {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  color?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  purple: 'bg-purple-600/20 text-purple-400',
  green: 'bg-green-600/20 text-green-400',
  orange: 'bg-orange-600/20 text-orange-400',
}

export function SectionCard({ 
  id, 
  title, 
  description, 
  icon, 
  color = 'blue', 
  open, 
  onToggle, 
  children 
}: SectionCardProps) {
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden hover:border-gray-400 transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          {icon && (
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-colors ${colorClass}`}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-1">{title}</h3>
            {description && (
              <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
            aria-expanded={open}
            aria-controls={`section-${id}`}
            title={open ? 'Collapse section' : 'Expand section'}
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
        
        {/* Always visible content (Quick Access buttons) */}
        {children && (
          <div className="flex gap-2">
            {/* This will contain the Quick View and View All buttons */}
          </div>
        )}
      </div>
      
      {/* Collapsible Content */}
      <div
        id={`section-${id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-300 bg-gray-200">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}