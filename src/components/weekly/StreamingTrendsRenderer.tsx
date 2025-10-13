import { TrendingUp, TrendingDown, Globe } from 'lucide-react'

interface TrendItem {
  track?: string
  global_streams?: number
  global_change?: number
  us_streams?: number
  us_change?: number
  markets?: { country: string; streams?: number; change?: number }[]
  notes?: string
}

interface StreamingTrendsRendererProps {
  data: {
    items?: TrendItem[]
    summary?: string
  }
}

export function StreamingTrendsRenderer({ data }: StreamingTrendsRendererProps) {
  if (!data.items || data.items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No streaming trends data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.summary && (
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
          {data.summary}
        </p>
      )}

      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-black mb-4">{item.track}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {item.global_streams != null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Global Streams</span>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {item.global_streams.toLocaleString()}
                  </div>
                  {item.global_change != null && (
                    <div className={`text-sm font-medium mt-1 ${item.global_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.global_change > 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                      {item.global_change > 0 ? '+' : ''}{item.global_change}%
                    </div>
                  )}
                </div>
              )}

              {item.us_streams != null && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">US Streams</div>
                  <div className="text-2xl font-bold text-black">
                    {item.us_streams.toLocaleString()}
                  </div>
                  {item.us_change != null && (
                    <div className={`text-sm font-medium mt-1 ${item.us_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.us_change > 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                      {item.us_change > 0 ? '+' : ''}{item.us_change}%
                    </div>
                  )}
                </div>
              )}
            </div>

            {item.markets && item.markets.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Top Markets</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {item.markets.map((market, idx) => (
                    <div key={idx} className="bg-gray-100 rounded px-3 py-2 text-sm">
                      <div className="font-medium text-black">{market.country}</div>
                      {market.change != null && (
                        <div className={`text-xs ${market.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {market.change > 0 ? '+' : ''}{market.change}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.notes && (
              <div className="mt-4 text-sm text-gray-600 italic">
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
