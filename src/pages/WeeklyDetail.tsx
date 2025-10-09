import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Download, ExternalLink } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { WeeklyReport } from '../types/weekly-report'

const SAMPLE_KATSEYE: WeeklyReport = {
  artist: 'KATSEYE',
  week_start: '2025-09-29',
  week_end: '2025-10-06',
  highlights: [
    '32,652,250 Spotify Monthly Listeners (as of today)',
    'IG surpassed 7M followers (10/5)',
    'TikTok surpassed 13M followers (10/5)',
    "Roblox 'Gabriela', 'Gameboy' & 'Gnarly' emotes dropped (10/4)",
    'KATSEYE i-D October 2025 issue (10/2)',
    'YouTube surpassed 5M subscribers (10/1)',
    "'Gabriela' Dance Practice released on KE YT (9/30)"
  ],
  highlight_link: {
    label: "Watch 'Gabriela' Dance Practice",
    url: 'https://www.youtube.com/watch?v=lll3eKuBJ8w&t=50s'
  },
  billboard_charts: [
    { rank: '#29', chart: 'Billboard 200', work: 'Beautiful Chaos', weeks: 14, notes: '-' },
    { rank: '#45', chart: 'Top 200 Song Consumption', work: 'Gabriela', weeks: 15, notes: '-' },
    { rank: '#127', chart: 'Top 200 Song Consumption', work: 'Gnarly', weeks: 22, notes: '-' }
  ],
  spotify_charts: [
    { track: 'Gabriela', markets: 47, notes: 'Global #19 (+5), US #40 (+9); Italy debut #192' },
    { track: 'Gnarly', markets: 16, notes: 'Global #79 (+10), US #102 (+15); re-enters Australia #172 & Venezuela #184' },
    { track: 'Touch', markets: 10, notes: 'Global #129 (+27); US peak #154 (+25)' },
    { track: 'Gameboy / Debut', markets: 1, notes: 'Singapore chart' }
  ],
  streaming_trends: [
    {
      track: 'Beautiful Chaos',
      bullets: ['Slightly down -5% globally (US -5%).']
    },
    {
      track: 'Gabriela',
      bullets: [
        'Down -5% globally; Long-form streams slightly up +1%.',
        'Amazon LF streams up +10% (17% of global).',
        'US streams -5% (LF slightly up +1%).',
        'Top ex-US markets: Philippines (12%), Brazil (6%), Indonesia (6%).',
        'Slight LF growth in Indonesia (+4%) and Australia (+2%).'
      ]
    },
    {
      track: 'Gnarly',
      bullets: [
        'Down -6% globally; LF streams -6%.',
        'US streams -6% (LF -6%).',
        'Top ex-US: Brazil (8%), Philippines (7%), Mexico (5%), UK (5%).'
      ]
    },
    {
      track: 'Gameboy',
      bullets: [
        'Down -6% globally; US -6% (LF -5%).',
        'Top ex-US: Philippines (10%), Brazil (6%), UK (5%).'
      ]
    }
  ],
  tiktok_trends: [
    {
      track: 'Gabriela',
      top_posts: ['1,500,000 views — Yoonchae & Sophia live (France)']
    },
    {
      track: 'Gnarly',
      top_posts: [
        '1,100,000 views — Playing at the club (France)',
        '1,000,000 views — Grandma vibing (Brazil)',
        '1,000,000 views — Kylie Jenner at fashion week (posted by British Vogue, 1.5M followers)',
        '65,000 views — Dance challenge by Tati Fernandez (8M followers)'
      ],
      note: "More creators using 'Making Beats…' verse"
    }
  ],
  apple_music: [],
  shazam: []
}

function colorizeDeltas(rootSel = '.report-content') {
  const root = document.querySelector(rootSel)
  if (!root) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const texts: Text[] = []
  let n: Node | null

  while ((n = walker.nextNode())) {
    if (n.nodeValue && n.nodeValue.match(/[+-]?\d+(?:\.\d+)?%/)) {
      texts.push(n as Text)
    }
  }

  texts.forEach(t => {
    const original = t.nodeValue || ''
    const html = original.replace(/([+-]?)(\d+(?:\.\d+)?)%/g, (match, sign, num) => {
      if (sign === '+') {
        return `<span class="delta up" aria-label="up ${num} percent"><span class="arrow">↑</span>+${num}%</span>`
      }
      if (sign === '-') {
        return `<span class="delta down" aria-label="down ${num} percent"><span class="arrow">↓</span>-${num}%</span>`
      }
      return `<span class="delta flat" aria-label="${num} percent">${num}%</span>`
    })

    if (html !== original) {
      const span = document.createElement('span')
      span.innerHTML = html
      if (t.parentNode) {
        t.parentNode.replaceChild(span, t)
      }
    }
  })
}

function exportWeeklyPDF() {
  window.print()
}

export function WeeklyDetail() {
  const { artistId } = useParams<{ artistId: string }>()

  const report = artistId === 'katseye' ? SAMPLE_KATSEYE : null

  useEffect(() => {
    requestAnimationFrame(() => {
      colorizeDeltas()
    })
  }, [report])

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
    { label: report.artist }
  ]

  return (
    <div className="bg-white min-h-screen report-page">
      <div className="print:hidden border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-black">{report.artist} Weekly</h1>
              <p className="text-sm text-gray-600 mt-1">
                {report.week_start} — {report.week_end}
              </p>
            </div>

            <button
              onClick={exportWeeklyPDF}
              className="export-btn px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
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
            <h1 className="text-2xl font-bold text-black">{report.artist} Weekly</h1>
            <p className="text-sm text-gray-700 mt-1">
              {report.week_start} — {report.week_end}
            </p>
          </div>
          <img src="/assets/pinguinohybe.png" alt="HYBE" className="h-10" />
        </div>
      </div>

      <div className="report-content max-w-6xl mx-auto px-6 py-8 space-y-10">
        {report.highlights && report.highlights.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Highlights / Overall Summary
            </h2>
            <ul className="space-y-2 list-none">
              {report.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-black font-bold mt-1">•</span>
                  <span className="text-gray-900">{item}</span>
                </li>
              ))}
            </ul>
            {report.highlight_link && (
              <div className="mt-4">
                <a
                  href={report.highlight_link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  {report.highlight_link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </section>
        )}

        {report.billboard_charts && report.billboard_charts.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Billboard Charts
            </h2>
            <div className="overflow-x-auto table-wrapper">
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
                      <td className="py-3 px-4 font-medium text-black">{row.work}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.weeks}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm notes">{row.notes === '-' ? '–' : row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.spotify_charts && report.spotify_charts.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Spotify Charts
            </h2>
            <div className="overflow-x-auto table-wrapper">
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
                      <td className="py-3 px-4 text-right text-gray-700 markets">{row.markets}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm notes">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.streaming_trends && report.streaming_trends.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Streaming Trends
            </h2>
            <div className="space-y-6">
              {report.streaming_trends.map((trend, idx) => (
                <div key={idx} className="trend-block space-y-2">
                  <h3 className="text-lg font-semibold text-black">{trend.track}</h3>
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
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              TikTok Trends
            </h2>
            <div className="space-y-6">
              {report.tiktok_trends.map((trend, idx) => (
                <div key={idx} className="trend-block space-y-2">
                  <h3 className="text-lg font-semibold text-black">{trend.track}</h3>
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
                  {trend.note && (
                    <p className="text-sm text-gray-600 italic mt-2">{trend.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="print-footer"></div>
    </div>
  )
}
