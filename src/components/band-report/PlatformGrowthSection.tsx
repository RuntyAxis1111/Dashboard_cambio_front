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

function formatNumber(num: number | null | undefined): string {
  if (num == null) return 'N/A'
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

function formatDelta(delta: number | null | undefined): { text: string; color: string } {
  if (delta == null) return { text: 'N/A', color: 'text-gray-500' }

  const sign = delta > 0 ? '+' : ''
  const color = delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500'
  const text = `${sign}${delta.toFixed(1)}%`

  return { text, color }
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
          {regularMetrics.map(m => {
            const delta = formatDelta(m.delta_pct)
            return (
              <tr key={m.plataforma} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-black">
                  {PLATFORM_LABELS[m.plataforma] || m.plataforma}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {formatNumber(m.valor_prev)}
                </td>
                <td className="px-4 py-3 text-sm text-black text-right font-medium">
                  {formatNumber(m.valor)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`inline-flex items-center gap-1 ${delta.color}`}>
                    {formatNumber(m.delta_num)} ({delta.text})
                  </span>
                </td>
              </tr>
            )
          })}
          {totalMetric && (
            <tr className="border-t-2 border-gray-300 bg-gray-100">
              <td className="px-4 py-3 text-sm text-black font-bold">
                {PLATFORM_LABELS[totalMetric.plataforma] || totalMetric.plataforma}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right font-medium">
                {formatNumber(totalMetric.valor_prev)}
              </td>
              <td className="px-4 py-3 text-sm text-black text-right font-bold">
                {formatNumber(totalMetric.valor)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                <span className={`inline-flex items-center gap-1 ${formatDelta(totalMetric.delta_pct).color}`}>
                  {formatNumber(totalMetric.delta_num)} ({formatDelta(totalMetric.delta_pct).text})
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
