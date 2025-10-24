import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { SpotifyMetricsCard } from '../components/dsp/SpotifyMetricsCard'

interface EntityInfo {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}


export function DSPDetail() {
  const { entityId } = useParams<{ entityId: string }>()
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [loading, setLoading] = useState(true)

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

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{entity.nombre}</h1>
              <p className="text-gray-600">DSP Live Growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Breakdown</h2>

        <div className="mb-8">
          {entityId && <SpotifyMetricsCard entidadId={entityId} />}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Release</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex gap-6">
            <img
              src="https://i.scdn.co/image/ab67616d0000b273ef0d089353c2d4f000822fb7"
              alt="Gabriela"
              className="w-48 h-48 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gabriela</h3>
              <p className="text-gray-600 mb-4">Released Sep 30, 2025</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/assets/spotify.png" alt="Spotify" className="w-5 h-5 object-contain" />
                    <span className="text-sm font-medium text-gray-600">Spotify</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">1.5M</div>
                  <div className="text-sm text-green-600 font-medium">+50.0K daily</div>
                  <div className="text-xs text-gray-500 mt-2">45 playlists · #15 country rank</div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/assets/applemusicicon.png" alt="Apple Music" className="w-5 h-5 object-contain" />
                    <span className="text-sm font-medium text-gray-600">Apple Music</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">800.0K</div>
                  <div className="text-sm text-green-600 font-medium">+25.0K daily</div>
                  <div className="text-xs text-gray-500 mt-2">30 playlists · #20 country rank</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/assets/amazonmusiciconnew.png" alt="Amazon Music" className="w-5 h-5 object-contain" />
                    <span className="text-sm font-medium text-gray-600">Amazon Music</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">400.0K</div>
                  <div className="text-sm text-green-600 font-medium">+15.0K daily</div>
                  <div className="text-xs text-gray-500 mt-2">20 playlists · #25 country rank</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Streams:</span>
                    <span className="ml-2 text-xl font-bold text-gray-900">2.7M</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Playlists:</span>
                    <span className="ml-2 text-xl font-bold text-gray-900">95</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Active Platforms:</span>
                    <span className="ml-2 text-xl font-bold text-gray-900">3</span>
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
