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
  const platformFilters = ['spotify', 'billboard']
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
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-black">{report.artist_name} Weekly</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {report.week_start} — {report.week_end}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {availableWeeks.length > 1 && (
                  <select
                    value={weekParam || report.week_end}
                    onChange={(e) => handleWeekChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-black hover:border-gray-400 transition-colors"
                  >
                    {availableWeeks.map(week => (
                      <option key={week} value={week}>Week ending {week}</option>
                    ))}
                  </select>
                )}

                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="print:block hidden">
        <div className="px-6 py-4 border-b-2 border-black mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">{report.artist_name} Weekly</h1>
              <p className="text-sm text-gray-700 mt-1">
                {report.week_start} — {report.week_end}
              </p>
            </div>
            <img src="/assets/pinguinohybe.png" alt="HYBE" className="h-10" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
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
                return null
            }
          }

          const content = renderSectionContent()
          if (!content) return null

          return (
            <section key={section.section_id} className="page-break-inside-avoid">
              <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
                {section.title || section.section_type}
              </h2>
              <div className="mt-4">
                {content}
              </div>
            </section>
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
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            margin: 1.5cm;
            size: letter;
          }
          section {
            margin-bottom: 2rem;
          }
          table {
            font-size: 10pt;
          }
        }
      `}</style>
    </div>
  )
}
