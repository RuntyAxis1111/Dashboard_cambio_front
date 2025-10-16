import { TrendingUp, TrendingDown } from 'lucide-react'

interface WeeklyKPI {
  label: string
  value: string | number
  unit?: string
  delta?: string
  trend?: 'up' | 'down' | 'neutral'
}

interface KPIHeaderProps {
  kpis: WeeklyKPI[]
  loading?: boolean
}

export function KPIHeader({ kpis, loading }: KPIHeaderProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-100 border border-gray-300 rounded-xl p-4 sm:p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-3 w-2/3"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {kpis.map((kpi, index) => {
        const isPositive = kpi.trend === 'up'
        const isNegative = kpi.trend === 'down'
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{kpi.label}</div>
            <div className="text-lg sm:text-2xl font-bold text-black mb-2">
              {kpi.value}
              {kpi.unit && <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">{kpi.unit}</span>}
            </div>
            {kpi.delta && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {(isPositive || isNegative) && <TrendIcon className="w-4 h-4" />}
                <span>{kpi.delta}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
