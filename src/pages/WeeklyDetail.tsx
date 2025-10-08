import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Download, X } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { SummaryHighlightsRenderer } from '../components/weekly/SummaryHighlightsRenderer'
import { ChartsRenderer } from '../components/weekly/ChartsRenderer'
import { StreamingTrendsRenderer } from '../components/weekly/StreamingTrendsRenderer'
import { TikTokTrendsRenderer } from '../components/weekly/TikTokTrendsRenderer'
import {
  getWeeklyReport,
  getAvailableWeeks,
  getReportSections,
  getReportMedia,
  WeeklyReport,
  ReportSection,
  ReportMedia
} from '../lib/reports-api'

export function WeeklyDetail() {
  const { artistId } = useParams<{ artistId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const weekParam = searchParams.get('week')

  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [sections, setSections] = useState<ReportSection[]>([])
  const [media, setMedia] = useState<ReportMedia[]>([])
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([])
  const [platformFilters, setPlatformFilters] = useState(['spotify', 'apple_music', 'billboard', 'shazam', 'amazon_music', 'tidal'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!artistId) {
        console.log('❌ No artistId provided')
        return
      }

      console.log('🔍 Fetching data for:', { artistId, weekParam })
      setLoading(true)

      const reportData = await getWeeklyReport(artistId, weekParam || undefined)
      console.log('📊 Report data:', reportData)

      if (!reportData) {
        console.log('❌ No report data found')
        setLoading(false)
        return
      }

      setReport(reportData)

      const [sectionsData, mediaData, weeksData] = await Promise.all([
        getReportSections(reportData.report_id),
        getReportMedia(reportData.report_id),
        getAvailableWeeks(artistId)
      ])

      console.log('📋 Sections:', sectionsData.length, 'items')
      console.log('🖼️ Media:', mediaData.length, 'items')
      console.log('📅 Available weeks:', weeksData)

      setSections(sectionsData)
      setMedia(mediaData)
      setAvailableWeeks(weeksData)
      setLoading(false)
    }

    fetchData()
  }, [artistId, weekParam])

  const handleWeekChange = (newWeekEnd: string) => {
    navigate(`/reports/weeklies/${artistId}?week=${newWeekEnd}`)
  }

  const togglePlatform = (platform: string) => {
    setPlatformFilters(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-black mb-2">Report Not Found</h2>
          <p className="text-gray-600">No report available for this artist and week</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports', href: '/reports/weeklies' },
    { label: report.artist_name }
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="print:hidden">
        <div className="border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mt-6">
              <div>
                <h1 className="text-3xl font-bold text-black">{report.artist_name}</h1>
                <p className="text-gray-600 mt-1">
                  Week: {report.week_start} → {report.week_end}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={weekParam || report.week_end}
                  onChange={(e) => handleWeekChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black hover:border-gray-400 transition-colors"
                >
                  {availableWeeks.map(week => (
                    <option key={week} value={week}>Week ending {week}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filter Platforms:</span>
              {['spotify', 'apple_music', 'billboard', 'shazam', 'amazon_music', 'tidal'].map(platform => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    platformFilters.includes(platform)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {platform === 'spotify' && 'Spotify'}
                  {platform === 'apple_music' && 'Apple Music'}
                  {platform === 'billboard' && 'Billboard'}
                  {platform === 'shazam' && 'Shazam'}
                  {platform === 'amazon_music' && 'Amazon Music'}
                  {platform === 'tidal' && 'Tidal'}
                  {!platformFilters.includes(platform) && <X className="w-3 h-3 ml-1 inline" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="print:block hidden">
        <div className="p-8 border-b border-gray-300 bg-gray-50">
          <div className="flex items-center gap-4 mb-4">
            <img src="/assets/pinguinohybe.png" alt="HYBE" className="w-12 h-12" />
            <div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Weekly Performance Report</div>
              <h1 className="text-2xl font-bold text-black">{report.artist_name}</h1>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Report Period: {report.week_start} → {report.week_end}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {sections.map((section) => {
          const shouldShow = !section.platform || platformFilters.includes(section.platform)
          if (!shouldShow) return null

          const renderSectionContent = () => {
            switch (section.section_type) {
              case 'summary_highlights':
                return <SummaryHighlightsRenderer data={section.payload_json} />

              case 'charts':
                return <ChartsRenderer data={section.payload_json} platform={section.platform || undefined} />

              case 'streaming_trends':
                return <StreamingTrendsRenderer data={section.payload_json} />

              case 'tiktok_trends':
                return <TikTokTrendsRenderer data={section.payload_json} />

              default:
                return (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded overflow-x-auto">
                      {JSON.stringify(section.payload_json, null, 2)}
                    </pre>
                  </div>
                )
            }
          }

          return (
            <div key={section.section_id} className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-bold text-black">{section.title || section.section_type}</h3>
                {section.platform && (
                  <span className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                    {section.platform}
                  </span>
                )}
              </div>
              <div className="p-6">
                {renderSectionContent()}

                {media.filter(m => m.section_id === section.section_id).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Media Attachments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {media
                        .filter(m => m.section_id === section.section_id)
                        .map(m => (
                          <div key={m.media_id} className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                            {m.media_type === 'image' ? (
                              <img src={m.url} alt={m.title || 'Media'} className="w-full h-auto rounded" />
                            ) : (
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                {m.title || m.url}
                              </a>
                            )}
                            {m.title && m.media_type !== 'image' && (
                              <p className="text-sm text-gray-900 mt-2">{m.title}</p>
                            )}
                            {m.provider && (
                              <p className="text-xs text-gray-500 mt-1">{m.provider}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {sections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sections available for this report</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
