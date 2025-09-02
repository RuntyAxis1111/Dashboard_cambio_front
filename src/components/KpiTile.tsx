import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiTileProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

export function KpiTile({ title, value, change, trend }: KpiTileProps) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`flex items-center gap-1 ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">{change}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-black mb-3">{value}</div>
      <div className="h-8 bg-gray-200 rounded overflow-hidden">
        <div className={`h-full w-3/4 ${
          trend === 'up' ? 'bg-green-600/30' : 'bg-red-600/30'
        }`} />
      </div>
    </div>
  )
}