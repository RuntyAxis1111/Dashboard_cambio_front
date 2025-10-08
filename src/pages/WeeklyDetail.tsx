import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Download, ChevronDown, X } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { KPIHeader } from '../components/weekly/KPIHeader'
import { AccordionSection } from '../components/weekly/AccordionSection'
import { HighlightsSection } from '../components/weekly/HighlightsSection'
import { StreamingDataSection } from '../components/weekly/StreamingDataSection'
import { StreamingTrendsSection } from '../components/weekly/StreamingTrendsSection'
import { TikTokSection } from '../components/weekly/TikTokSection'
import { SalesStreamsSection } from '../components/weekly/SalesStreamsSection'
import { MVViewsSection } from '../components/weekly/MVViewsSection'
import { ImageHighlightsSection } from '../components/weekly/ImageHighlightsSection'
import { FanSentimentSection } from '../components/weekly/FanSentimentSection'
import { getWeeklyReport, getAvailableWeeks, mockArtistsSummary } from '../lib/weeklies-mock'

export function WeeklyDetail() {
  const { artistId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const weekParam = searchParams.get('week')

  const [loading, setLoading] = useState(true)
  const [platformFilters, setPlatformFilters] = useState(['spotify', 'apple', 'amazon', 'tidal'])
  const [allExpanded, setAllExpanded] = useState(true)

  const artist = mockArtistsSummary.find(a => a.artist_id === artistId)
  const availableWeeks = getAvailableWeeks(artistId!)
  const currentWeek = weekParam || availableWeeks[0]
  const report = getWeeklyReport(artistId!, currentWeek)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }, [artistId, currentWeek])

  const handleWeekChange = (week: string) => {
    setSearchParams({ week })
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
    { label: artist?.artist_name || artistId! }
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="print:hidden">
        <div className="border-b border-gray-300 bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mt-6">
              <div>
                <h1 className="text-3xl font-bold text-black">{report.artist}</h1>
                <p className="text-gray-600 mt-1">
                  Week: {report.week_start} → {report.week_end}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={currentWeek}
                  onChange={(e) => handleWeekChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black hover:border-gray-400 transition-colors"
                >
                  {availableWeeks.map(week => (
                    <option key={week} value={week}>Week ending {week}</option>
                  ))}
                </select>

                <button
                  onClick={() => setAllExpanded(!allExpanded)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${allExpanded ? 'rotate-180' : ''}`} />
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </button>

                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-medium text-gray-700">Filter DSPs:</span>
              {['spotify', 'apple', 'amazon', 'tidal'].map(platform => (
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
                  {platform === 'apple' && 'Apple Music'}
                  {platform === 'amazon' && 'Amazon Music'}
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
              <h1 className="text-2xl font-bold text-black">{report.artist}</h1>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Report Period: {report.week_start} → {report.week_end}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <KPIHeader kpis={report.kpis} loading={loading} />

        {report.sections
          .sort((a, b) => a.order_index - b.order_index)
          .map((section, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">{section.title}</h3>
              </div>
              <div className="p-6">
              {section.section_type === 'highlights' && (
                <HighlightsSection items={section.payload.items} />
              )}

              {section.section_type === 'streaming_data' && (
                <StreamingDataSection
                  spotify={section.payload.spotify}
                  apple={section.payload.apple}
                  amazon={section.payload.amazon}
                  tidal={section.payload.tidal}
                  activeFilters={platformFilters}
                />
              )}

              {section.section_type === 'streaming_trends' && (
                <StreamingTrendsSection trends={section.payload.trends} />
              )}

              {section.section_type === 'tiktok' && (
                <TikTokSection
                  metrics={section.payload.metrics}
                  top_posts={section.payload.top_posts}
                />
              )}

              {section.section_type === 'sales_streams' && (
                <SalesStreamsSection sales={section.payload.sales} />
              )}

              {section.section_type === 'mv_views' && (
                <MVViewsSection videos={section.payload.videos} />
              )}

              {section.section_type === 'image_highlights' && (
                <ImageHighlightsSection images={section.payload.images} />
              )}

              {section.section_type === 'fan_sentiment' && (
                <FanSentimentSection items={section.payload.items} />
              )}
              </div>
            </div>
          ))}
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
