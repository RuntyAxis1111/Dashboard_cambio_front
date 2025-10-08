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
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chart</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Track/Album</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Weeks</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => {
            const isPositive = item.delta && item.delta > 0
            const isNegative = item.delta && item.delta < 0

            return (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-black">#{item.rank}</span>
                    {item.delta && (
                      <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                        {Math.abs(item.delta)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.chart || '-'}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-black">{item.track || item.album || '-'}</div>
                  {item.markets && (
                    <div className="text-xs text-gray-500 mt-1">{item.markets} markets</div>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  {item.weeks_on_chart || '-'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
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
