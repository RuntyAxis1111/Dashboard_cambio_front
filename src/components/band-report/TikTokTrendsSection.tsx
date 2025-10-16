import { formatNumber, formatDelta, getDeltaColor, getDeltaBgColor, getMetricLabel } from '../../lib/report-utils'

interface Metric {
  metrica_clave: string
  valor: number
  valor_prev: number | null
  delta_pct: number | null
}

interface TikTokTrendsSectionProps {
  metrics: Metric[]
}

export function TikTokTrendsSection({ metrics }: TikTokTrendsSectionProps) {
  if (metrics.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No TikTok trends data available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white border border-gray-300 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">
            {getMetricLabel(metric.metrica_clave)}
          </div>
          <div className="text-2xl font-bold text-black mb-1">
            {formatNumber(metric.valor)}
          </div>
          {metric.valor_prev != null && (
            <div className="text-xs text-gray-500 mb-2">
              Prev: {formatNumber(metric.valor_prev)}
            </div>
          )}
          {metric.delta_pct != null && (
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDeltaBgColor(metric.delta_pct)} ${getDeltaColor(metric.delta_pct)}`}>
              {formatDelta(metric.delta_pct)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
