import { formatNumber, formatDelta, getDeltaColor, getDeltaBgColor, getMetricLabel } from '../../lib/report-utils'

interface Metric {
  metrica_clave: string
  unidad: string | null
  valor: number
  valor_prev: number | null
  delta_pct: number | null
}

interface InstagramKPIsSectionProps {
  metrics: Metric[]
}

export function InstagramKPIsSection({ metrics }: InstagramKPIsSectionProps) {
  if (metrics.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No Instagram KPIs available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white border border-gray-300 rounded-2xl p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            {getMetricLabel(metric.metrica_clave)}
          </h4>
          <div className="text-3xl font-bold text-black mb-2">
            {formatNumber(metric.valor)}
            {metric.unidad && <span className="text-lg text-gray-600 ml-1">{metric.unidad}</span>}
          </div>
          {metric.delta_pct != null && (
            <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${getDeltaBgColor(metric.delta_pct)} ${getDeltaColor(metric.delta_pct)}`}>
              {formatDelta(metric.delta_pct)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
