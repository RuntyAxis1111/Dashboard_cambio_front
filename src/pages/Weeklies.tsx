import { useEffect, useState } from 'react'
import { Database } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { DSPReportCard } from '../components/dsp/DSPReportCard'
import { supabase } from '../lib/supabase'

interface DSPEntitySummary {
  entity_id: string
  entity_name: string
  entity_slug: string
  imagen_url: string | null
  total_followers: number
  total_listeners: number
  followers_delta_7d: number
  listeners_delta_7d: number
  last_update: string
}

export function Weeklies() {
  const [dspEntities, setDspEntities] = useState<DSPEntitySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLiveReports() {
      try {
        // Get entities with weekly reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('v_weekly_reports_summary')
          .select('entidad_id, nombre, slug, tipo, imagen_url, semana_inicio, semana_fin, status')

        if (reportsError) throw reportsError

        // Get DSP metrics for these entities
        const { data: dspData, error: dspError } = await supabase
          .from('v_dsp_latest')
          .select('entidad_id, entidad_nombre, platform, metric, valor, week_diff')
          .eq('platform', 'spotify')
          .in('metric', ['followers', 'listeners'])

        if (dspError) throw dspError

        // Combine both datasets
        const entityMap = new Map<string, DSPEntitySummary>()

        reportsData?.forEach((report) => {
          const followers = dspData?.find(
            (d) => d.entidad_id === report.entidad_id && d.metric === 'followers'
          )
          const listeners = dspData?.find(
            (d) => d.entidad_id === report.entidad_id && d.metric === 'listeners'
          )

          entityMap.set(report.entidad_id, {
            entity_id: report.entidad_id,
            entity_name: report.nombre,
            entity_slug: report.slug,
            imagen_url: report.imagen_url,
            total_followers: followers?.valor || 0,
            total_listeners: listeners?.valor || 0,
            followers_delta_7d: followers?.week_diff || 0,
            listeners_delta_7d: listeners?.week_diff || 0,
            last_update: new Date().toISOString()
          })
        })

        const entities = Array.from(entityMap.values())
        setDspEntities(entities)
      } catch (error) {
        console.error('Error loading live reports:', error)
        setDspEntities([])
      } finally {
        setLoading(false)
      }
    }
    loadLiveReports()
  }, [])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports' }
  ]

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Weekly Reports</h1>
          <p className="text-gray-600">
            Select an artist to view their latest weekly performance report
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 border border-gray-300 rounded-2xl p-6 animate-pulse" style={{ minHeight: '180px' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dspEntities.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-8 text-center" style={{ minHeight: '180px' }}>
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No reports yet</h3>
            <p className="text-gray-600">Reports will appear here once created in the database</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dspEntities.map((entity) => (
              <DSPReportCard
                key={entity.entity_id}
                entityId={entity.entity_id}
                entityName={entity.entity_name}
                imageUrl={entity.imagen_url}
                totalFollowers={entity.total_followers}
                totalListeners={entity.total_listeners}
                followersDelta7d={entity.followers_delta_7d}
                listenersDelta7d={entity.listeners_delta_7d}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
