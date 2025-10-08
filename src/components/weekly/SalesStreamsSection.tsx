import { TrendingUp, TrendingDown } from 'lucide-react'
import { SalesEntry } from '../../lib/weeklies-mock'

interface SalesStreamsSectionProps {
  sales: SalesEntry[]
}

export function SalesStreamsSection({ sales }: SalesStreamsSectionProps) {
  if (!sales || sales.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sales data available for this week</p>
      </div>
    )
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2 px-3 font-medium text-gray-700">Release</th>
            <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
            <th className="text-right py-2 px-3 font-medium text-gray-700">TW Units</th>
            <th className="text-right py-2 px-3 font-medium text-gray-700">TW Change</th>
            <th className="text-right py-2 px-3 font-medium text-gray-700">RTD Units</th>
            <th className="text-right py-2 px-3 font-medium text-gray-700">RTD Change</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((entry, index) => {
            const twPositive = entry.tw_change >= 0
            const rtdPositive = entry.rtd_change >= 0

            return (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium">{entry.release_name}</td>
                <td className="py-3 px-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                    {entry.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-semibold">{formatNumber(entry.tw_units)}</td>
                <td className="py-3 px-3 text-right">
                  <span className={`inline-flex items-center gap-1 ${
                    twPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {twPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {twPositive ? '+' : ''}{entry.tw_change}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-semibold">{formatNumber(entry.rtd_units)}</td>
                <td className="py-3 px-3 text-right">
                  <span className={`inline-flex items-center gap-1 ${
                    rtdPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rtdPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {rtdPositive ? '+' : ''}{entry.rtd_change}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
