import { formatNumberCompact, formatDeltaNum, formatDeltaPct, getDeltaColor } from '../../lib/report-utils'

interface PlatformMetric {
  plataforma: string
  valor: number
  valor_prev: number | null
  delta_num: number | null
  delta_pct: number | null
  orden: number
}

interface PlatformGrowthSectionProps {
  metrics: PlatformMetric[]
}

const PLATFORM_LABELS: Record<string, string> = {
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
  'x': 'X',
  'weverse': 'Weverse',
  'spotify': 'Spotify',
  'total': 'Total',
}

const PLATFORM_LOGOS: Record<string, string> = {
  'instagram': '/assets/instagram.png',
  'tiktok': '/assets/tik-tok (1).png',
  'youtube': '/assets/youtube (1).png',
  'spotify': '/assets/spotify.png',
}

export function PlatformGrowthSection({ metrics }: PlatformGrowthSectionProps) {
  if (metrics.length === 0) {
    return <p className="text-gray-500">No data for this section yet</p>
  }

  const regularMetrics = metrics.filter(m => m.plataforma !== 'total')

  const sortedMetrics = [...regularMetrics].sort((a, b) => {
    const deltaA = a.delta_num || 0
    const deltaB = b.delta_num || 0
    return deltaB - deltaA
  })

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Platform</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Current</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Previous</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Growth</th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map(m => (
              <tr key={m.plataforma} className="border-t border-gray-200">
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {PLATFORM_LOGOS[m.plataforma] && (
                      <img src={PLATFORM_LOGOS[m.plataforma]} alt="" className="w-4 h-4 object-contain" />
                    )}
                    <span>{PLATFORM_LABELS[m.plataforma] || m.plataforma}</span>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black text-right font-medium whitespace-nowrap">
                  {formatNumberCompact(m.valor)}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">
                  {formatNumberCompact(m.valor_prev)}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap">
                  <span className={getDeltaColor(m.delta_pct)}>
                    {formatDeltaNum(m.delta_num)} ({formatDeltaPct(m.delta_pct)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
