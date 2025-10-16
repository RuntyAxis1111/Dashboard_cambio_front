import { TrendingUp, TrendingDown } from 'lucide-react'

interface ChartItem {
  rank?: number
  chart?: string
  track?: string
  album?: string
  weeks_on_chart?: number
  delta?: number
  notes?: string
  markets?: number
}

interface ChartsRendererProps {
  data: {
    items?: ChartItem[]
  }
  platform?: string
}

export function ChartsRenderer({ data, platform }: ChartsRendererProps) {
  if (!data.items || data.items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No chart data available for this period
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Rank</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Chart</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Track/Album</th>
            <th className="text-center py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Weeks</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => {
            const isPositive = item.delta && item.delta > 0
            const isNegative = item.delta && item.delta < 0

            return (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-black">#{item.rank}</span>
                    {item.delta && (
                      <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                        {Math.abs(item.delta)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{item.chart || '-'}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-4 whitespace-nowrap">
                  <div className="font-medium text-black text-xs sm:text-sm">{item.track || item.album || '-'}</div>
                  {item.markets && (
                    <div className="text-xs text-gray-500 mt-1">{item.markets} markets</div>
                  )}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {item.weeks_on_chart || '-'}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {item.notes || '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
