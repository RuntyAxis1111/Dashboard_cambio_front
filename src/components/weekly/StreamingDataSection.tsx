import { TrendingUp, TrendingDown } from 'lucide-react'

interface ChartEntry {
  chart_name: string
  country: string
  entity_type: 'track' | 'album'
  entity_name: string
  rank: number
  delta?: number
  weeks_on_chart?: number
}

interface PlaylistEntry {
  playlist_name: string
  position: number
  followers?: number
  country?: string
  date?: string
}

interface DSPData {
  charts: ChartEntry[]
  playlists: PlaylistEntry[]
  markets?: any[]
  active_market_count?: number
}

interface StreamingDataSectionProps {
  spotify?: DSPData
  apple?: DSPData
  amazon?: DSPData
  tidal?: DSPData
  activeFilters: string[]
}

export function StreamingDataSection({ spotify, apple, amazon, tidal, activeFilters }: StreamingDataSectionProps) {
  const platforms = [
    { id: 'spotify', label: 'Spotify', data: spotify, enabled: activeFilters.includes('spotify') },
    { id: 'apple', label: 'Apple Music', data: apple, enabled: activeFilters.includes('apple') },
    { id: 'amazon', label: 'Amazon Music', data: amazon, enabled: activeFilters.includes('amazon') },
    { id: 'tidal', label: 'Tidal', data: tidal, enabled: activeFilters.includes('tidal') }
  ].filter(platform => platform.data && platform.enabled)

  if (platforms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No streaming data available for selected platforms</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {platforms.map(platform => {
        const currentData = platform.data!
        return (
          <div key={platform.id} className="border-l-4 border-blue-600 pl-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{platform.label}</h4>

            <div className="space-y-6">
              {currentData.charts && currentData.charts.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Charts</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Chart</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Country/Global</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Track/Album</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Rank</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Change</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Weeks</th>
                        </tr>
                      </thead>
                      <tbody>
                            {currentData.charts.map((chart, index) => {
                          const isPositive = (chart.delta || 0) > 0
                          const isNegative = (chart.delta || 0) < 0
                          return (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-3">{chart.chart_name}</td>
                              <td className="py-3 px-3">{chart.country}</td>
                              <td className="py-3 px-3 font-medium">{chart.entity_name}</td>
                              <td className="py-3 px-3 text-center font-semibold">#{chart.rank}</td>
                              <td className="py-3 px-3 text-center">
                                {chart.delta !== undefined && (
                                  <span className={`inline-flex items-center gap-1 ${
                                    isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {isPositive && <TrendingUp className="w-3 h-3" />}
                                    {isNegative && <TrendingDown className="w-3 h-3" />}
                                    {isPositive ? '+' : ''}{chart.delta}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center text-gray-600">
                                {chart.weeks_on_chart || '-'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentData.playlists && currentData.playlists.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Playlist Adds</h5>
                  <div className="space-y-2">
                    {currentData.playlists.map((playlist, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{playlist.playlist_name}</div>
                          <div className="text-sm text-gray-600">
                            Position #{playlist.position}
                            {playlist.followers && ` • ${(playlist.followers / 1000000).toFixed(1)}M followers`}
                            {playlist.country && ` • ${playlist.country}`}
                          </div>
                        </div>
                        {playlist.date && (
                          <div className="text-sm text-gray-500">{playlist.date}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentData.active_market_count !== undefined && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-900">
                    Active in <span className="text-xl font-bold">{currentData.active_market_count}</span> markets
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
