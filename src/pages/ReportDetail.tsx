import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Database } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'
import { reportKindLabel, isBandReport } from '../lib/report-utils'
import { HighlightsSection } from '../components/band-report/HighlightsSection'
import { FanSentimentSection } from '../components/band-report/FanSentimentSection'
import { InstagramKPIsSection } from '../components/band-report/InstagramKPIsSection'
import { StreamingTrendsSection } from '../components/band-report/StreamingTrendsSection'
import { TikTokTrendsSection } from '../components/band-report/TikTokTrendsSection'
import { MVViewsSection } from '../components/band-report/MVViewsSection'
import { DemographicsSection } from '../components/band-report/DemographicsSection'
import { TopCountriesSection } from '../components/band-report/TopCountriesSection'
import { MembersGrowthSection } from '../components/band-report/MembersGrowthSection'
import { PlatformGrowthSection } from '../components/band-report/PlatformGrowthSection'
import { SourcesSection } from '../components/band-report/SourcesSection'
import { SpotifyInsightsSection } from '../components/band-report/SpotifyInsightsSection'
import { PRPressSection } from '../components/band-report/PRPressSection'
import { WeeklyContentSection } from '../components/band-report/WeeklyContentSection'
import { TopPostsSection } from '../components/band-report/TopPostsSection'

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

interface Section {
  seccion_clave: string
  titulo: string
  orden: number
}

interface BandReportData {
  sections: Section[]
  highlights: any[]
  fanSentiment: any[]
  instagramKPIs: any[]
  streamingTrends: any[]
  tiktokTrends: any[]
  mvItems: any[]
  demographics: any[]
  topCountries: any[]
  membersGrowth: any[]
  platformGrowth: any[]
  sources: any[]
  spotifyInsights: any[]
  prPress: any[]
  weeklyContent: any[]
  topPosts: any[]
}

export function ReportDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [entity, setEntity] = useState<EntityDetail | null>(null)
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null)
  const [bandData, setBandData] = useState<BandReportData | null>(null)
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

        if (isBandReport(entityData.tipo, entityData.subtipo)) {
          await loadBandReportData(entityData.id)
        }
      } catch (err) {
        console.error('Error loading report detail:', err)
        setError('Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    async function loadBandReportData(entidadId: string) {
      try {
        const [
          sectionsRes,
          highlightsRes,
          fanSentimentRes,
          instagramKPIsRes,
          streamingTrendsRes,
          tiktokTrendsRes,
          mvItemsRes,
          demographicsRes,
          topCountriesRes,
          membersRes,
          platformGrowthRes,
          sourcesRes,
          spotifyInsightsRes,
          prPressRes,
          weeklyContentRes,
          topPostsRes
        ] = await Promise.all([
          supabase.from('reportes_secciones').select('*').eq('entidad_id', entidadId).eq('lista', true).order('orden'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'highlight').eq('plataforma', '').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'fan_sentiment').eq('plataforma', '').order('posicion'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'instagram_kpis').eq('plataforma', 'instagram').order('orden'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'streaming_trends').order('orden'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'tiktok_trends').eq('plataforma', 'tiktok').order('orden'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).in('categoria', ['mv_total_views', 'spotify_streams']).order('posicion'),
          supabase.from('reportes_buckets').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'demographics'),
          supabase.from('reportes_buckets').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'top_countries').eq('dimension', 'country').eq('metrica_clave', 'listeners_28d').order('posicion'),
          supabase.from('reportes_metricas').select('*, participante:reportes_participantes!inner(nombre, orden)').eq('entidad_id', entidadId).eq('seccion_clave', 'members_ig_growth').eq('metrica_clave', 'ig_followers').eq('plataforma', 'instagram').order('participante(orden)'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'platform_growth').is('participante_id', null).order('orden'),
          supabase.from('reportes_fuentes').select('*').eq('entidad_id', entidadId),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'spotify_insight').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).in('categoria', ['pr_us', 'pr_kr']).order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'weekly_recap').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).in('categoria', ['top_ig', 'top_tt', 'top_yt']).order('posicion')
        ])

        const membersData = (membersRes.data || []).map((m: any) => ({
          ...m,
          participante_nombre: m.participante?.nombre || 'Unknown'
        }))

        setBandData({
          sections: sectionsRes.data || [],
          highlights: highlightsRes.data || [],
          fanSentiment: fanSentimentRes.data || [],
          instagramKPIs: instagramKPIsRes.data || [],
          streamingTrends: streamingTrendsRes.data || [],
          tiktokTrends: tiktokTrendsRes.data || [],
          mvItems: mvItemsRes.data || [],
          demographics: demographicsRes.data || [],
          topCountries: topCountriesRes.data || [],
          membersGrowth: membersData,
          platformGrowth: platformGrowthRes.data || [],
          sources: sourcesRes.data || [],
          spotifyInsights: spotifyInsightsRes.data || [],
          prPress: prPressRes.data || [],
          weeklyContent: weeklyContentRes.data || [],
          topPosts: topPostsRes.data || []
        })
      } catch (err) {
        console.error('Error loading band report data:', err)
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

  const showBandReport = isBandReport(entity.tipo, entity.subtipo)
  const sectionMap: Record<string, { component: JSX.Element | null }> = {
    'highlights': { component: bandData ? <HighlightsSection items={bandData.highlights} /> : null },
    'fan_sentiment': { component: bandData ? <FanSentimentSection items={bandData.fanSentiment} /> : null },
    'instagram_kpis': { component: bandData ? <InstagramKPIsSection metrics={bandData.instagramKPIs} /> : null },
    'streaming_trends': { component: bandData ? <StreamingTrendsSection metrics={bandData.streamingTrends} /> : null },
    'tiktok_trends': { component: bandData ? <TikTokTrendsSection metrics={bandData.tiktokTrends} /> : null },
    'mv_views': { component: bandData ? <MVViewsSection items={bandData.mvItems} /> : null },
    'demographics': { component: bandData ? <DemographicsSection buckets={bandData.demographics} /> : null },
    'top_countries': { component: bandData ? <TopCountriesSection buckets={bandData.topCountries} /> : null },
    'members_ig_growth': { component: bandData ? <MembersGrowthSection members={bandData.membersGrowth} /> : null },
    'platform_growth': { component: bandData ? <PlatformGrowthSection metrics={bandData.platformGrowth} /> : null },
    'sources': { component: bandData ? <SourcesSection sources={bandData.sources} /> : null },
    'spotify_insights': { component: bandData ? <SpotifyInsightsSection insights={bandData.spotifyInsights} /> : null },
    'pr_press': { component: bandData ? <PRPressSection items={bandData.prPress} /> : null },
    'weekly_content': { component: bandData ? <WeeklyContentSection items={bandData.weeklyContent} /> : null },
    'top_posts': { component: bandData ? <TopPostsSection posts={bandData.topPosts} /> : null }
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

          {showBandReport && bandData ? (
            <div className="space-y-8">
              {bandData.sections.length === 0 ? (
                <div className="bg-gray-50 border border-gray-300 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">No Sections Configured</h3>
                  <p className="text-gray-600">
                    This report has no sections configured in the database yet
                  </p>
                </div>
              ) : (
                bandData.sections
                  .map((section, idx) => {
                    const prevSection = bandData.sections[idx - 1]
                    const isPlatform = section.seccion_clave === 'platform_growth'
                    const isMembers = section.seccion_clave === 'members_ig_growth'
                    const prevIsPlatform = prevSection?.seccion_clave === 'platform_growth'

                    // Skip members if it comes right after platform (already rendered together)
                    if (isMembers && prevIsPlatform) {
                      return null
                    }

                    const nextSection = bandData.sections[idx + 1]
                    const nextIsMembers = nextSection?.seccion_clave === 'members_ig_growth'

                    // If this is platform and next is members, render them side by side
                    if (isPlatform && nextIsMembers) {
                      const platformData = sectionMap['platform_growth']
                      const membersData = sectionMap['members_ig_growth']

                      return (
                        <div key={`combined-platform-members`} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-black mb-4">{section.titulo}</h3>
                            {platformData?.component || <p className="text-gray-500">No data available</p>}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-black mb-4">{nextSection.titulo}</h3>
                            {membersData?.component || <p className="text-gray-500">No data available</p>}
                          </div>
                        </div>
                      )
                    }

                    // Regular single section
                    const sectionData = sectionMap[section.seccion_clave]
                    if (!sectionData?.component) return null

                    return (
                      <div key={section.seccion_clave}>
                        <h3 className="text-xl font-bold text-black mb-4">{section.titulo}</h3>
                        {sectionData.component}
                      </div>
                    )
                  })
                  .filter(Boolean)
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Report Sections Coming Soon</h3>
              <p className="text-gray-600">
                Detailed sections with KPIs, metrics, and analytics will be displayed here in the next update
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
