import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Database, Download, FileText } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'
import { reportKindLabel, isBandReport } from '../lib/report-utils'
import { formatDateShort } from '../lib/format-utils'
import { CustomizeReportMenu } from '../components/CustomizeReportMenu'
import { useReportPreferences } from '../hooks/useReportPreferences'
import { HighlightsSection } from '../components/band-report/HighlightsSection'
import { FanSentimentSection } from '../components/band-report/FanSentimentSection'
import { InstagramKPIsSection } from '../components/band-report/InstagramKPIsSection'
import { StreamingTrendsSection } from '../components/band-report/StreamingTrendsSection'
import { TikTokTrendsSection } from '../components/band-report/TikTokTrendsSection'
import { MVViewsSection } from '../components/band-report/MVViewsSection'
import { DemographicsSection } from '../components/band-report/DemographicsSection'
import { MembersGrowthSection } from '../components/band-report/MembersGrowthSection'
import { PlatformGrowthSection } from '../components/band-report/PlatformGrowthSection'
import { SourcesSection } from '../components/band-report/SourcesSection'
import { PRPressSection } from '../components/band-report/PRPressSection'
import { WeeklyContentSection } from '../components/band-report/WeeklyContentSection'
import { TopPostsSection } from '../components/band-report/TopPostsSection'
import { SpotifyMetricsCard } from '../components/dsp/SpotifyMetricsCard'
import { LastSongTracking, TrackVersionSelector, useLastSongTracking } from '../components/dsp/LastSongTracking'
import { getSampleForArtist } from './WeeklyDetail'

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
  semana_pasada_inicio: string | null
  semana_pasada_fin: string | null
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
  instagramKPIs: any[]
  streamingTrends: any[]
  tiktokTrends: any[]
  mvItems: any[]
  demographics: any[]
  membersGrowth: any[]
  platformGrowth: any[]
  sources: any[]
  prPress: any[]
  weeklyContent: any[]
  topPosts: any[]
  sentiment: any[]
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

function exportReportPDF() {
  document.body.classList.add('print-mode')
  window.scrollTo(0, 0)
  window.print()
  window.onafterprint = () => {
    document.body.classList.remove('print-mode')
  }
}

export function ReportDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [entity, setEntity] = useState<EntityDetail | null>(null)
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null)
  const [bandData, setBandData] = useState<BandReportData | null>(null)
  const [dspLastUpdated, setDspLastUpdated] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)

  const { hiddenSections, toggleSection, resetToDefault, isSectionVisible } = useReportPreferences(entity?.id || '')
  const { data: trackData } = useLastSongTracking(entity?.id || '')

  console.log('TrackData length:', trackData?.length, 'Track data:', trackData)

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
          console.log('[ReportDetail] Entity not found in DB, checking mock data for slug:', slug)
          const mockData = getSampleForArtist(slug)
          if (mockData) {
            console.log('[ReportDetail] Found mock data, redirecting to /reports/weeklies/' + slug)
            navigate(`/reports/weeklies/${slug}`, { replace: true })
            return
          }
          setError('Entity not found')
          setLoading(false)
          return
        }

        setEntity(entityData)

        const { data: statusData, error: statusError } = await supabase
          .from('reportes_estado')
          .select('semana_inicio, semana_fin, semana_pasada_inicio, semana_pasada_fin, status')
          .eq('entidad_id', entityData.id)
          .maybeSingle()

        if (statusError) throw statusError
        setReportStatus(statusData || { semana_inicio: null, semana_fin: null, semana_pasada_inicio: null, semana_pasada_fin: null, status: null })

        const { data: dspStatusData, error: dspStatusError } = await supabase
          .from('dsp_status')
          .select('ultima_actualizacion')
          .eq('entidad_id', entityData.id)
          .maybeSingle()

        if (!dspStatusError && dspStatusData) {
          setDspLastUpdated(dspStatusData.ultima_actualizacion)
        }

        const isBand = isBandReport(entityData.tipo, entityData.subtipo)
        console.log('[ReportDetail] Entity loaded:', {
          slug: entityData.slug,
          tipo: entityData.tipo,
          subtipo: entityData.subtipo,
          isBandReport: isBand
        })
        if (isBand) {
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
          instagramKPIsRes,
          streamingTrendsRes,
          tiktokTrendsRes,
          mvItemsRes,
          demographicsRes,
          membersRes,
          platformGrowthRes,
          sourcesRes,
          prPressRes,
          weeklyContentRes,
          topPostsRes,
          sentimentRes
        ] = await Promise.all([
          supabase.from('reportes_secciones').select('*').eq('entidad_id', entidadId).eq('lista', true).order('orden'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'highlight').order('posicion'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'instagram_kpis').eq('plataforma', 'instagram').order('orden'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'streaming_trends').order('orden'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'tiktok_trends').eq('plataforma', 'tiktok').order('orden'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'mv_totales').order('posicion'),
          supabase.from('reportes_buckets').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'demographics'),
          supabase.from('reportes_metricas').select('*, participante:reportes_participantes!inner(nombre, orden)').eq('entidad_id', entidadId).eq('seccion_clave', 'members_growth').eq('metrica_clave', 'ig_followers').eq('plataforma', 'instagram').order('participante(orden)'),
          supabase.from('reportes_metricas').select('*').eq('entidad_id', entidadId).eq('seccion_clave', 'social_growth').is('participante_id', null).order('orden'),
          supabase.from('reportes_fuentes').select('*').eq('entidad_id', entidadId),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'pr').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'weekly_recap').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).eq('categoria', 'top_posts').order('posicion'),
          supabase.from('reportes_items').select('*').eq('entidad_id', entidadId).in('categoria', ['sentiment', 'fan_sentiment']).order('posicion')
        ])

        const membersData = (membersRes.data || []).map((m: any) => ({
          ...m,
          participante_nombre: m.participante?.nombre || 'Unknown'
        }))

        const bandReportData = {
          sections: sectionsRes.data || [],
          highlights: highlightsRes.data || [],
          instagramKPIs: instagramKPIsRes.data || [],
          streamingTrends: streamingTrendsRes.data || [],
          tiktokTrends: tiktokTrendsRes.data || [],
          mvItems: mvItemsRes.data || [],
          demographics: demographicsRes.data || [],
          membersGrowth: membersData,
          platformGrowth: platformGrowthRes.data || [],
          sources: sourcesRes.data || [],
          prPress: prPressRes.data || [],
          weeklyContent: weeklyContentRes.data || [],
          topPosts: topPostsRes.data || [],
          sentiment: sentimentRes.data || []
        }
        console.log('[ReportDetail] Band Report Data Loaded:', {
          entidadId,
          sectionsCount: bandReportData.sections.length,
          sections: bandReportData.sections,
          highlightsCount: bandReportData.highlights.length,
          mvItemsCount: bandReportData.mvItems.length,
          prPressCount: bandReportData.prPress.length,
          weeklyContentCount: bandReportData.weeklyContent.length,
          topPostsCount: bandReportData.topPosts.length,
          sentimentCount: bandReportData.sentiment.length
        })
        setBandData(bandReportData)
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

  const handleReportUpdate = () => {
    window.location.reload()
  }

  const showBandReport = isBandReport(entity.tipo, entity.subtipo)
  console.log('[ReportDetail] Render state:', {
    showBandReport,
    hasBandData: !!bandData,
    sectionsCount: bandData?.sections?.length || 0,
    entitySlug: entity.slug
  })
  const sectionMap: Record<string, { component: JSX.Element | null; extraHeaderContent?: JSX.Element }> = {
    'highlights': { component: bandData ? <HighlightsSection items={bandData.highlights} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null },
    'fan_sentiment': { component: bandData ? <FanSentimentSection items={bandData.sentiment} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null },
    'instagram_kpis': { component: bandData ? <InstagramKPIsSection metrics={bandData.instagramKPIs} /> : null },
    'streaming_trends': { component: bandData ? <StreamingTrendsSection metrics={bandData.streamingTrends} /> : null },
    'tiktok_trends': { component: bandData ? <TikTokTrendsSection metrics={bandData.tiktokTrends} /> : null },
    'mv_totales': { component: bandData ? <MVViewsSection items={bandData.mvItems} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null },
    'demographics': { component: bandData && reportStatus ? <DemographicsSection buckets={bandData.demographics} entidadId={entity.id} semanaInicio={reportStatus.semana_inicio || ''} semanaFin={reportStatus.semana_fin || ''} /> : null },
    'ig_members': { component: bandData ? <MembersGrowthSection members={bandData.membersGrowth} entityId={entity.id} /> : null },
    'members_growth': { component: bandData ? <MembersGrowthSection members={bandData.membersGrowth} entityId={entity.id} /> : null },
    'social_growth': { component: bandData ? <PlatformGrowthSection metrics={bandData.platformGrowth} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null },
    'sources': { component: bandData ? <SourcesSection sources={bandData.sources} /> : null },
    'dsp_platform_breakdown': { component: <SpotifyMetricsCard entidadId={entity.id} /> },
    'dsp_last_song_tracking': {
      component: <LastSongTracking entidadId={entity.id} selectedTrackIndex={selectedTrackIndex} />,
      extraHeaderContent: (trackData?.length || 0) > 1 ? (
        <TrackVersionSelector
          trackCount={trackData?.length || 0}
          selectedIndex={selectedTrackIndex}
          onSelectIndex={setSelectedTrackIndex}
        />
      ) : undefined
    },
    'pr_press': { component: bandData ? <PRPressSection items={bandData.prPress} entidadId={entity.id} /> : null },
    'weekly_content': { component: bandData ? <WeeklyContentSection items={bandData.weeklyContent} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null },
    'top_posts': { component: bandData ? <TopPostsSection posts={bandData.topPosts} entidadId={entity.id} onUpdate={handleReportUpdate} /> : null }
  }

  return (
    <div className="bg-white min-h-screen report-page">
      <div className="print:hidden border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              {entity.imagen_url ? (
                <img
                  src={entity.imagen_url}
                  alt={entity.nombre}
                  className="w-16 h-16 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {entity.nombre.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-black">{entity.nombre}</h1>
                <p className="text-sm text-gray-600">{reportKindLabel(entity.tipo, entity.subtipo)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CustomizeReportMenu
                entidadId={entity.id}
                hiddenSections={hiddenSections}
                onToggleSection={toggleSection}
                onResetToDefault={resetToDefault}
              />
              <Link
                to="/reports/my-reports"
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                My Reports
              </Link>
              <button
                onClick={exportReportPDF}
                className="export-btn px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="print-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-black">{entity.nombre} Report</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {reportStatus?.semana_inicio && reportStatus?.semana_fin
                ? `${reportStatus.semana_inicio} to ${reportStatus.semana_fin}`
                : 'Live Data'} · Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <img
            src="/assets/pinguinohybe.png"
            alt="HYBE"
            className="h-8"
          />
        </div>
      </div>

      <div className="report-content max-w-7xl mx-auto px-8 py-8">
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 mb-6 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Current Week
                </h2>
                <div className="space-y-1">
                  {reportStatus?.semana_inicio && reportStatus?.semana_fin ? (
                    <>
                      <p className="text-gray-700">
                        {formatDateShort(reportStatus.semana_inicio)} → {formatDateShort(reportStatus.semana_fin)}
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
                    <p className="text-gray-500 text-sm">No data available</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Past Week
                </h2>
                <div className="space-y-1">
                  {reportStatus?.semana_pasada_inicio && reportStatus?.semana_pasada_fin ? (
                    <p className="text-gray-700">
                      {formatDateShort(reportStatus.semana_pasada_inicio)} → {formatDateShort(reportStatus.semana_pasada_fin)}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showBandReport && bandData ? (
            <div className="space-y-8">
              {bandData.sections.length > 0 && (
                bandData.sections
                  .filter(section => {
                    const isVisible = isSectionVisible(section.seccion_clave)
                    console.log('[ReportDetail] Section filter:', section.seccion_clave, 'visible:', isVisible)
                    return isVisible
                  })
                  .map((section, idx) => {
                    console.log('[ReportDetail] Rendering section:', section.seccion_clave, 'has component:', !!sectionMap[section.seccion_clave])
                    const allVisibleSections = bandData.sections.filter(s => isSectionVisible(s.seccion_clave))
                    const prevSection = allVisibleSections[idx - 1]
                    const isPlatform = section.seccion_clave === 'social_growth' || section.seccion_clave === 'platform_growth'
                    const isMembers = section.seccion_clave === 'members_growth' || section.seccion_clave === 'ig_members'
                    const prevIsPlatform = prevSection?.seccion_clave === 'social_growth' || prevSection?.seccion_clave === 'platform_growth'

                    // Skip members if it comes right after platform (already rendered together)
                    if (isMembers && prevIsPlatform) {
                      return null
                    }

                    const nextSection = allVisibleSections[idx + 1]
                    const nextIsMembers = nextSection?.seccion_clave === 'members_growth' || nextSection?.seccion_clave === 'ig_members'

                    // If this is platform and next is members, render them side by side
                    if (isPlatform && nextIsMembers) {
                      const platformData = sectionMap[section.seccion_clave]
                      const membersData = sectionMap[nextSection.seccion_clave]

                      return (
                        <div key={`combined-platform-members`} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                              {section.titulo}
                            </h3>
                            {platformData?.component || <p className="text-gray-500">No data available</p>}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                              {nextSection.titulo}
                              <img
                                src="/assets/artificial-intelligence.png"
                                alt="AI"
                                className="w-5 h-5 object-contain"
                              />
                            </h3>
                            {membersData?.component || <p className="text-gray-500">No data available</p>}
                          </div>
                        </div>
                      )
                    }

                    // Regular single section
                    const sectionData = sectionMap[section.seccion_clave]
                    if (!sectionData?.component) return null

                    // Don't show AI icon for Social Platform Weekly Social Growth
                    const showAIIcon = section.seccion_clave !== 'social_growth' && section.seccion_clave !== 'platform_growth'

                    // Determine platform logo
                    let platformLogo: string | null = null
                    if (section.seccion_clave === 'demographics') {
                      platformLogo = '/assets/instagram.png'
                    } else if (section.seccion_clave === 'spotify_insights') {
                      platformLogo = '/assets/spotify.png'
                    } else if (section.seccion_clave === 'mv_totales') {
                      platformLogo = '/assets/youtube (1).png'
                    } else if (section.seccion_clave === 'dsp_platform_breakdown' || section.seccion_clave === 'dsp_last_song_tracking') {
                      platformLogo = '/assets/spotify.png'
                    }

                    // Override title for mv_totales
                    const displayTitle = section.seccion_clave === 'mv_totales' ? 'Youtube Performance' : section.titulo

                    // Sources section should show AI icon
                    const forceShowAI = section.seccion_clave === 'sources'

                    return (
                      <div key={section.seccion_clave}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-black flex items-center gap-2">
                              {displayTitle}
                              {platformLogo && (
                                <img
                                  src={platformLogo}
                                  alt="Platform"
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            {(showAIIcon || forceShowAI) && (
                              <img
                                src="/assets/artificial-intelligence.png"
                                alt="AI"
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            {section.seccion_clave === 'dsp_platform_breakdown' && dspLastUpdated && (
                              <span className="text-[11px] text-gray-400 font-normal">
                                • Updated {formatLastUpdated(dspLastUpdated)}
                              </span>
                            )}
                          </h3>
                          {sectionData.extraHeaderContent && (
                            <div className="ml-3">{sectionData.extraHeaderContent}</div>
                          )}
                          </div>
                        </div>
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
  )
}
