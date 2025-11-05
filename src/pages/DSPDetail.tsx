import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { SpotifyMetricsCard } from '../components/dsp/SpotifyMetricsCard'
import { LastSongTracking } from '../components/dsp/LastSongTracking'

interface EntityInfo {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}

function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`
  } else if (diffHours < 24) {
    return `Hace ${diffHours}h`
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString('es', options)
  }
}


export function DSPDetail() {
  const { entityId } = useParams<{ entityId: string }>()
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    async function loadDSPData() {
      if (!entityId) return

      try {
        const { data: entityData, error: entityError } = await supabase
          .from('reportes_entidades')
          .select('id, nombre, slug, imagen_url')
          .eq('id', entityId)
          .single()

        if (entityError) throw entityError
        setEntity(entityData)

        const { data: statusData, error: statusError } = await supabase
          .from('dsp_status')
          .select('ultima_actualizacion')
          .eq('entidad_id', entityId)
          .maybeSingle()

        if (!statusError && statusData) {
          setLastUpdated(statusData.ultima_actualizacion)
        }

      } catch (error) {
        console.error('Error loading DSP data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDSPData()
  }, [entityId])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports', href: '/reports/weeklies' },
    { label: entity?.nombre || 'DSP Growth' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white p-6 rounded-2xl h-32 mb-6"></div>
            <div className="bg-white p-6 rounded-2xl h-96"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entity not found</h2>
            <Link to="/reports/weeklies" className="text-blue-600 hover:text-blue-700">
              Back to reports
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4 mt-6">
            <Link
              to="/reports/weeklies"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {entity.imagen_url && (
              <img
                src={entity.imagen_url}
                alt={entity.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{entity.nombre}</h1>
                {lastUpdated && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">
                      {formatLastUpdated(lastUpdated)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">DSP Live Growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">DSP Platform Breakdown</h2>
          {lastUpdated && (
            <span className="text-[11px] text-gray-400 font-normal">
              • Updated {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        <div className="space-y-6">
          {entityId && <SpotifyMetricsCard entidadId={entityId} />}
          {entityId && <LastSongTracking entidadId={entityId} />}
        </div>
      </div>
    </div>
  )
}
