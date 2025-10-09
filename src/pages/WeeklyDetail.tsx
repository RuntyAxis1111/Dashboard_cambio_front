import { useParams } from 'react-router-dom'
import { Download, ExternalLink } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { WeeklyReport } from '../types/weekly-report'

const SAMPLE_KATSEYE: WeeklyReport = {
  artist_id: 'katseye',
  artist_name: 'KATSEYE',
  week_start: '2025-09-29',
  week_end: '2025-10-06',
  highlights: {
    items: [
      "32,652,250 Spotify Monthly Listeners (as of today)",
      "IG surpassed 7M followers (10/5)",
      "TikTok surpassed 13M followers (10/5)",
      "Roblox 'Gabriela', 'Gameboy' & 'Gnarly' emotes dropped (10/4)",
      "KATSEYE i-D October 2025 issue (10/2)",
      "YouTube surpassed 5M subscribers (10/1)",
      "'Gabriela' Dance Practice released on KE YT (9/30)"
    ],
    video_link: 'https://www.youtube.com/watch?v=dummy-gabriela-dance-practice'
  },
  billboard_charts: [
    { rank: '#29', chart: 'Billboard 200', track: 'Beautiful Chaos', weeks: '14', notes: '-' },
    { rank: '#45', chart: 'Top 200 Song Consumption', track: 'Gabriela', weeks: '15', notes: '-' },
    { rank: '#127', chart: 'Top 200 Song Consumption', track: 'Gnarly', weeks: '22', notes: '-' }
  ],
  spotify_charts: [
    { rank: '#', chart: '-', track: 'Gabriela', weeks: '-', markets: 47, notes: 'Global #19 (+5), US #40 (+9); Italy debut #192' },
    { rank: '#', chart: '-', track: 'Gnarly', weeks: '-', markets: 16, notes: 'Global #79 (+10), US #102 (+15); re-enters Australia #172 & Venezuela #184' },
    { rank: '#', chart: '-', track: 'Touch', weeks: '-', markets: 10, notes: 'Global #129 (+27); US peak #154 (+25)' },
    { rank: '#', chart: '-', track: 'Gameboy / Debut', weeks: '-', markets: 1, notes: 'Singapore chart' }
  ],
  streaming_trends: [
    {
      title: 'Beautiful Chaos',
      bullets: ['Slightly down -5% globally (US -5%).']
    },
    {
      title: 'Gabriela',
      bullets: [
        'Down -5% globally; Long-form streams slightly up +1%.',
        'Amazon LF streams up +10% (17% of global).',
        'US streams -5% (LF slightly up +1%).',
        'Top ex-US markets: Philippines (12%), Brazil (8%), Indonesia (6%).',
        'Slight LF growth in Indonesia (+4%) and Australia (+2%).'
      ]
    },
    {
      title: 'Gnarly',
      bullets: [
        'Down -6% globally; LF streams -6%.',
        'US streams -6% (LF -6%).',
        'Top ex-US: Brazil (8%), Philippines (7%), Mexico (5%), UK (5%).'
      ]
    },
    {
      title: 'Gameboy',
      bullets: ['Down -6% globally; US -6% (LF -5%).']
    }
  ],
  tiktok_trends: [
    { topic: 'Gabriela', top_posts: ['1,500,000 views'] },
    {
      topic: 'Gnarly',
      top_posts: ['1,100,000 views', '1,000,000 views', '1,000,000 views', '65,000 views'],
      notes: "More creators using 'Making Beats…' verse"
    }
  ]
}

export function WeeklyDetail() {
  const { artistId } = useParams<{ artistId: string }>()

  const report = artistId === 'katseye' ? SAMPLE_KATSEYE : null

  const handleExportPDF = () => {
    window.print()
  }

  if (!report) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-black mb-2">Report Not Found</h2>
          <p className="text-gray-600">No report available for {artistId}</p>
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
      <div className="print:hidden border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-black">{report.artist_name} Weekly</h1>
              <p className="text-sm text-gray-600 mt-1">
                {report.week_start} — {report.week_end}
              </p>
            </div>

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

      <div className="print:block hidden border-b-2 border-black mb-8">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{report.artist_name} Weekly</h1>
            <p className="text-sm text-gray-700 mt-1">
              {report.week_start} — {report.week_end}
            </p>
          </div>
          <img src="/assets/pinguinohybe.png" alt="HYBE" className="h-10" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {report.highlights && report.highlights.items.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Highlights / Overall Summary
            </h2>
            <ul className="space-y-2 list-none">
              {report.highlights.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-black font-bold mt-1">•</span>
                  <span className="text-gray-900">{item}</span>
                </li>
              ))}
            </ul>
            {report.highlights.video_link && (
              <div className="mt-4">
                <a
                  href={report.highlights.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Watch the full video
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </section>
        )}

        {report.billboard_charts && report.billboard_charts.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Billboard Charts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Chart
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Track/Album
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Weeks
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.billboard_charts.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-semibold text-black">{row.rank}</td>
                      <td className="py-3 px-4 text-gray-700">{row.chart}</td>
                      <td className="py-3 px-4 font-medium text-black">{row.track}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.weeks}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{row.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.spotify_charts && report.spotify_charts.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Spotify Charts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Track
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Markets
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.spotify_charts.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black">{row.track}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.markets || '-'}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{row.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.streaming_trends && report.streaming_trends.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Streaming Trends
            </h2>
            <div className="space-y-6">
              {report.streaming_trends.map((trend, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">{trend.title}</h3>
                  <ul className="space-y-1 list-none pl-4">
                    {trend.bullets.map((bullet, bidx) => (
                      <li key={bidx} className="flex items-start gap-2">
                        <span className="text-gray-600 mt-1">◦</span>
                        <span className="text-gray-800">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {report.tiktok_trends && report.tiktok_trends.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              TikTok Trends
            </h2>
            <div className="space-y-6">
              {report.tiktok_trends.map((trend, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">{trend.topic}</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Posts:</p>
                    <ul className="space-y-1 list-none pl-4">
                      {trend.top_posts.map((post, pidx) => (
                        <li key={pidx} className="flex items-start gap-2">
                          <span className="text-gray-600 mt-1">•</span>
                          <span className="text-gray-800">{post}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {trend.notes && (
                    <p className="text-sm text-gray-600 italic mt-2">{trend.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
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
          h2 {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
