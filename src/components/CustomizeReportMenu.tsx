import { useState, useEffect } from 'react'
import { Eye, EyeOff, RotateCcw, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Section {
  key: string
  label: string
  order: number
}

interface CustomizeReportMenuProps {
  entidadId: string
  hiddenSections: string[]
  onToggleSection: (sectionKey: string) => void
  onResetToDefault: () => void
}

export function CustomizeReportMenu({
  entidadId,
  hiddenSections,
  onToggleSection,
  onResetToDefault
}: CustomizeReportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSections() {
      try {
        const { data, error } = await supabase
          .from('reportes_secciones')
          .select('seccion_clave, titulo, orden')
          .eq('entidad_id', entidadId)
          .order('orden', { ascending: true })

        if (error) {
          console.error('Error loading sections:', error)
          return
        }

        if (data) {
          const sectionList = data.map(item => ({
            key: item.seccion_clave,
            label: item.titulo,
            order: item.orden
          }))
          setSections(sectionList)
        }
      } catch (err) {
        console.error('Error fetching sections:', err)
      } finally {
        setLoading(false)
      }
    }

    if (entidadId) {
      loadSections()
    }
  }, [entidadId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.customize-menu-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const visibleCount = sections.length - hiddenSections.length
  const hasHiddenSections = hiddenSections.length > 0

  return (
    <div className="relative customize-menu-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
        title="Customize report sections"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Customize View</span>
        {hasHiddenSections && (
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            {visibleCount}/{sections.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Customize Report Sections</h3>
            <p className="text-xs text-gray-500 mt-1">
              Toggle sections to show or hide in your report
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                Loading sections...
              </div>
            ) : sections.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No sections available
              </div>
            ) : (
              <div className="py-2">
                {sections.map((section) => {
                  const isVisible = !hiddenSections.includes(section.key)
                  return (
                    <button
                      key={section.key}
                      onClick={() => onToggleSection(section.key)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isVisible
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {isVisible && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {section.label}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isVisible ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {hasHiddenSections && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  onResetToDefault()
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
            </div>
          )}

          <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
            <p className="text-xs text-blue-600 text-center">
              {visibleCount} of {sections.length} sections visible
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
