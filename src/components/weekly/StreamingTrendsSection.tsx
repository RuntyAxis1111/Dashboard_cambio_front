import { TrendingUp, TrendingDown } from 'lucide-react'
import { TrendEntry } from '../../lib/weeklies-mock'

interface StreamingTrendsSectionProps {
  trends: TrendEntry[]
}

export function StreamingTrendsSection({ trends }: StreamingTrendsSectionProps) {
  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No trend data available for this week</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trends.map((trend, index) => {
        const globalPositive = trend.global_change >= 0
        const usPositive = trend.us_change >= 0

        return (
          <div key={index} className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{trend.track_name}</h4>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Global</span>
                <span className={`flex items-center gap-1 font-medium ${
                  globalPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {globalPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {globalPositive ? '+' : ''}{trend.global_change}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">US</span>
                <span className={`flex items-center gap-1 font-medium ${
                  usPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {usPositive ? '+' : ''}{trend.us_change}%
                </span>
              </div>
            </div>

            {trend.top_markets && trend.top_markets.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">Top Markets</div>
                <div className="space-y-1">
                  {trend.top_markets.map((market, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{market.country}</span>
                      <span className={`font-medium ${
                        market.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {market.change >= 0 ? '+' : ''}{market.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
