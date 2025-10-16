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

export function PlatformGrowthSection({ metrics }: PlatformGrowthSectionProps) {
  if (metrics.length === 0) {
    return <p className="text-gray-500">No data for this section yet</p>
  }

  const sortedMetrics = [...metrics].sort((a, b) => a.orden - b.orden)
  const totalMetric = sortedMetrics.find(m => m.plataforma === 'total')
  const regularMetrics = sortedMetrics.filter(m => m.plataforma !== 'total')

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Platform</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Previous</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Current</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Growth</th>
          </tr>
        </thead>
        <tbody>
          {regularMetrics.map(m => (
            <tr key={m.plataforma} className="border-t border-gray-200">
              <td className="px-4 py-3 text-sm text-black">
                {PLATFORM_LABELS[m.plataforma] || m.plataforma}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                {formatNumberCompact(m.valor_prev)}
              </td>
              <td className="px-4 py-3 text-sm text-black text-right font-medium">
                {formatNumberCompact(m.valor)}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={getDeltaColor(m.delta_pct)}>
                  {formatDeltaNum(m.delta_num)} ({formatDeltaPct(m.delta_pct)})
                </span>
              </td>
            </tr>
          ))}
          {totalMetric && (
            <tr className="border-t-2 border-gray-300 bg-gray-100">
              <td className="px-4 py-3 text-sm text-black font-bold">
                {PLATFORM_LABELS[totalMetric.plataforma] || totalMetric.plataforma}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right font-medium">
                {formatNumberCompact(totalMetric.valor_prev)}
              </td>
              <td className="px-4 py-3 text-sm text-black text-right font-bold">
                {formatNumberCompact(totalMetric.valor)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                <span className={getDeltaColor(totalMetric.delta_pct)}>
                  {formatDeltaNum(totalMetric.delta_num)} ({formatDeltaPct(totalMetric.delta_pct)})
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
