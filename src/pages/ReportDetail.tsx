import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Database } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'

interface EntityDetail {
  id: string
  tipo: string
  subtipo?: string | null
  nombre: string
  slug: string
  imagen_url: string | null
}

interface ReportStatus {
  semana_inicio: string | null
  semana_fin: string | null
  status: string | null
}

function reportKindLabel(tipo?: string | null, subtipo?: string | null): string {
  const norm = (s?: string | null) => (s ?? '').toLowerCase()
  const t = norm(tipo)
  const st = norm(subtipo)

  if (st === 'banda')   return 'Band Report'
  if (st === 'solista') return 'Solo Artist Report'
  if (st === 'duo')     return 'Duo Report'

  if (t === 'show')   return 'Show Report'
  if (t === 'artist') return 'Artist Report'

  return 'Report'
}

export function ReportDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [entity, setEntity] = useState<EntityDetail | null>(null)
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReportDetail() {
      if (!slug) {
        setError('No slug provided')
        setLoading(false)
        return
      }

      try {
        const { data: entityData, error: entityError } = await supabase
          .from('reportes_entidades')
          .select('id, tipo, subtipo, nombre, slug, imagen_url')
          .eq('slug', slug)
          .maybeSingle()

        if (entityError) throw entityError
        if (!entityData) {
          setError('Entity not found')
          setLoading(false)
          return
        }

        setEntity(entityData)

        const { data: statusData, error: statusError } = await supabase
          .from('reportes_estado')
          .select('semana_inicio, semana_fin, status')
          .eq('entidad_id', entityData.id)
          .maybeSingle()

        if (statusError) throw statusError
        setReportStatus(statusData || { semana_inicio: null, semana_fin: null, status: null })
      } catch (err) {
        console.error('Error loading report detail:', err)
        setError('Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    loadReportDetail()
  }, [slug])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports', href: '/reports/weeklies' },
    { label: entity?.nombre || 'Loading...' }
  ]

  if (loading) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !entity) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8">
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Report not found</h3>
              <p className="text-gray-600">{error || 'The requested report does not exist'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            {entity.imagen_url ? (
              <img
                src={entity.imagen_url}
                alt={entity.nombre}
                className="w-20 h-20 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {entity.nombre.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-black">{entity.nombre}</h1>
              <p className="text-gray-600">{reportKindLabel(entity.tipo, entity.subtipo)}</p>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Current Week
            </h2>
            <div className="space-y-2">
              {reportStatus?.semana_inicio && reportStatus?.semana_fin ? (
                <>
                  <p className="text-gray-700">
                    <span className="font-medium">Week:</span> {reportStatus.semana_inicio} → {reportStatus.semana_fin}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      reportStatus.status === 'ready'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {reportStatus.status || 'N/A'}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No week data available</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">Report Sections Coming Soon</h3>
            <p className="text-gray-600">
              Detailed sections with KPIs, metrics, and analytics will be displayed here in the next update
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
