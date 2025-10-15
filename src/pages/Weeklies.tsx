import { useEffect, useState } from 'react'
import { Calendar, Database } from 'lucide-react'
import { listWeeklyReports, ArtistSummary } from '../lib/reports-api'
import { Breadcrumb } from '../components/Breadcrumb'
import { ReportCard } from '../components/ReportCard'
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

export function Weeklies() {
  const [artists, setArtists] = useState<ArtistSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [liveReports, setLiveReports] = useState<LiveReport[]>([])
  const [loadingLive, setLoadingLive] = useState(true)

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
      </div>
    </div>
  )
}
