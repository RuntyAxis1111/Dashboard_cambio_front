import { formatNumber, formatDelta, getDeltaColor, getMetricLabel } from '../../lib/report-utils'

interface Metric {
  metrica_clave: string
  valor: number
  valor_prev: number | null
  delta_pct: number | null
  plataforma: string
}

interface StreamingTrendsSectionProps {
  metrics: Metric[]
}

export function StreamingTrendsSection({ metrics }: StreamingTrendsSectionProps) {
  if (metrics.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No streaming trends data available yet</p>
      </div>
    )
  }

  const youtubeMetrics = metrics.filter(m => m.plataforma === 'youtube' || m.metrica_clave.startsWith('yt_'))
  const spotifyMetrics = metrics.filter(m => m.plataforma === 'spotify' || m.metrica_clave.startsWith('sp_'))

  return (
    <div className="space-y-6">
      {youtubeMetrics.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h4 className="font-semibold text-black mb-4">YouTube</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Metric</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">This Week</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Previous</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Δ%</th>
                </tr>
              </thead>
              <tbody>
                {youtubeMetrics.map((metric, idx) => (
                  <tr key={idx} className="border-b border-gray-200 last:border-0">
                    <td className="py-2 px-3 text-sm text-gray-700">{getMetricLabel(metric.metrica_clave)}</td>
                    <td className="py-2 px-3 text-sm text-right font-medium text-black">{formatNumber(metric.valor)}</td>
                    <td className="py-2 px-3 text-sm text-right text-gray-600">{formatNumber(metric.valor_prev)}</td>
                    <td className={`py-2 px-3 text-sm text-right font-medium ${getDeltaColor(metric.delta_pct)}`}>
                      {formatDelta(metric.delta_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {spotifyMetrics.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h4 className="font-semibold text-black mb-4">Spotify</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Metric</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">This Week</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Previous</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Δ%</th>
                </tr>
              </thead>
              <tbody>
                {spotifyMetrics.map((metric, idx) => (
                  <tr key={idx} className="border-b border-gray-200 last:border-0">
                    <td className="py-2 px-3 text-sm text-gray-700">{getMetricLabel(metric.metrica_clave)}</td>
                    <td className="py-2 px-3 text-sm text-right font-medium text-black">{formatNumber(metric.valor)}</td>
                    <td className="py-2 px-3 text-sm text-right text-gray-600">{formatNumber(metric.valor_prev)}</td>
                    <td className={`py-2 px-3 text-sm text-right font-medium ${getDeltaColor(metric.delta_pct)}`}>
                      {formatDelta(metric.delta_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
