import { useEffect, useState } from 'react'
import { Calendar, Database, TrendingUp } from 'lucide-react'
import { listWeeklyReports, ArtistSummary } from '../lib/reports-api'
import { Breadcrumb } from '../components/Breadcrumb'
import { ReportCard } from '../components/ReportCard'
import { DSPReportCard } from '../components/dsp/DSPReportCard'
import { supabase } from '../lib/supabase'

const SAMPLE_ARTISTS: ArtistSummary[] = [
  {
    artist_id: 'katseye',
    artist_name: 'KATSEYE',
    week_end: '2025-10-06',
    cover_image_url: '/assets/image copy.png'
  },
  {
    artist_id: 'adrian-cota',
    artist_name: 'ADRIÁN COTA',
    week_end: '2025-10-07',
    cover_image_url: '/assets/image.png'
  },
  {
    artist_id: 'magna',
    artist_name: 'MAGNA',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy.png'
  },
  {
    artist_id: 'gregorio',
    artist_name: 'GREGORIO',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy.png'
  },
  {
    artist_id: 'santos-bravos',
    artist_name: 'SANTOS BRAVOS',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy copy copy copy.png'
  },
  {
    artist_id: 'destino',
    artist_name: 'DESTINO',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy copy copy copy copy copy.png'
  },
  {
    artist_id: 'musza',
    artist_name: 'MUSZA',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy copy copy copy copy copy copy.png'
  },
  {
    artist_id: 'low-clika',
    artist_name: 'LOW CLIKA',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy copy copy copy copy copy copy copy.png'
  }
]

interface LiveReport {
  entidad_id: string
  nombre: string
  slug: string
  tipo: string
  imagen_url: string | null
  semana_inicio: string | null
  semana_fin: string | null
  status: string | null
}

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
  const [artists, setArtists] = useState<ArtistSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [liveReports, setLiveReports] = useState<LiveReport[]>([])
  const [loadingLive, setLoadingLive] = useState(true)
  const [dspEntities, setDspEntities] = useState<DSPEntitySummary[]>([])
  const [loadingDsp, setLoadingDsp] = useState(true)

  useEffect(() => {
    async function loadReports() {
      const reports = await listWeeklyReports(SAMPLE_ARTISTS)
      setArtists(reports)
      setLoading(false)
    }
    loadReports()
  }, [])

  useEffect(() => {
    async function loadLiveReports() {
      try {
        const { data, error } = await supabase
          .from('reportes_v_ultimos')
          .select('entidad_id, nombre, slug, tipo, imagen_url, semana_inicio, semana_fin, status')
          .order('nombre', { ascending: true })

        if (error) throw error
        setLiveReports(data || [])
      } catch (error) {
        console.error('Error loading live reports:', error)
        setLiveReports([])
      } finally {
        setLoadingLive(false)
      }
    }
    loadLiveReports()
  }, [])

  useEffect(() => {
    async function loadDspEntities() {
      try {
        const { data: entitiesData, error: entitiesError } = await supabase
          .from('reportes_entidades')
          .select('id, nombre, slug, imagen_url')
          .eq('activo', true)

        if (entitiesError) throw entitiesError

        const { data: latestData, error: latestError } = await supabase
          .from('v_dsp_latest')
          .select('entity_id, dsp, followers_total, monthly_listeners')

        if (latestError) throw latestError

        const { data: delta7dData, error: delta7dError } = await supabase
          .from('v_dsp_delta_7d')
          .select('entity_id, dsp, followers_delta_7d, listeners_delta_7d')

        if (delta7dError) throw delta7dError

        const entityMap = new Map<string, DSPEntitySummary>()

        entitiesData?.forEach((entity) => {
          const spotifyLatest = latestData?.find(
            (d) => d.entity_id === entity.id && d.dsp === 'spotify'
          )
          const spotifyDelta = delta7dData?.find(
            (d) => d.entity_id === entity.id && d.dsp === 'spotify'
          )

          if (spotifyLatest) {
            entityMap.set(entity.id, {
              entity_id: entity.id,
              entity_name: entity.nombre,
              entity_slug: entity.slug,
              imagen_url: entity.imagen_url,
              total_followers: spotifyLatest.followers_total || 0,
              total_listeners: spotifyLatest.monthly_listeners || 0,
              followers_delta_7d: spotifyDelta?.followers_delta_7d || 0,
              listeners_delta_7d: spotifyDelta?.listeners_delta_7d || 0,
              last_update: new Date().toISOString()
            })
          }
        })

        const dspSummaries = Array.from(entityMap.values()).sort((a, b) =>
          a.entity_name.localeCompare(b.entity_name)
        )

        setDspEntities(dspSummaries)
      } catch (error) {
        console.error('Error loading DSP entities:', error)
        setDspEntities([])
      } finally {
        setLoadingDsp(false)
      }
    }
    loadDspEntities()
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
              <div key={i} className="bg-gray-100 border border-gray-300 rounded-2xl p-6 animate-pulse">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ReportCard
                key={artist.artist_id}
                artistId={`weeklies/${artist.artist_id}`}
                artistName={artist.artist_name}
                weekEnd={artist.week_end}
                imageUrl={artist.cover_image_url}
              />
            ))}
          </div>
        )}

        <div className="relative my-8 border-t border-gray-200">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Live from database</span>
          </div>
        </div>

        {loadingLive ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 border border-gray-300 rounded-2xl p-6 animate-pulse" style={{ minHeight: '140px' }}>
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
        ) : liveReports.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-8 text-center" style={{ minHeight: '140px' }}>
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No live reports yet</h3>
            <p className="text-gray-600">When we create a report in the database, it will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveReports.map((report) => (
              <ReportCard
                key={report.entidad_id}
                artistId={report.slug}
                artistName={report.nombre}
                weekEnd={report.semana_fin}
                imageUrl={report.imagen_url}
              />
            ))}
          </div>
        )}

        {!loading && artists.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No reports yet</h3>
            <p className="text-gray-600">Weekly reports will appear here once generated</p>
          </div>
        )}

        <div className="relative my-8 border-t border-gray-200">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">DSP Live Growth</span>
          </div>
        </div>

        {loadingDsp ? (
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
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No DSP data yet</h3>
            <p className="text-gray-600">DSP metrics will appear here once n8n starts collecting data</p>
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
