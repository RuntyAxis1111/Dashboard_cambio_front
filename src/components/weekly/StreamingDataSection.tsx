import { useState } from 'react'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { DSPData } from '../../lib/weeklies-mock'

interface StreamingDataSectionProps {
  spotify?: DSPData
  apple?: DSPData
  amazon?: DSPData
  tidal?: DSPData
  activeFilters: string[]
}

export function StreamingDataSection({ spotify, apple, amazon, tidal, activeFilters }: StreamingDataSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (spotify && activeFilters.includes('spotify')) return 'spotify'
    if (apple && activeFilters.includes('apple')) return 'apple'
    if (amazon && activeFilters.includes('amazon')) return 'amazon'
    if (tidal && activeFilters.includes('tidal')) return 'tidal'
    return 'spotify'
  })

  const tabs = [
    { id: 'spotify', label: 'Spotify', data: spotify, enabled: activeFilters.includes('spotify') },
    { id: 'apple', label: 'Apple Music', data: apple, enabled: activeFilters.includes('apple') },
    { id: 'amazon', label: 'Amazon Music', data: amazon, enabled: activeFilters.includes('amazon') },
    { id: 'tidal', label: 'Tidal', data: tidal, enabled: activeFilters.includes('tidal') }
  ].filter(tab => tab.data && tab.enabled)

  if (tabs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No streaming data available for selected platforms</p>
      </div>
    )
  }

  const currentData = tabs.find(t => t.id === activeTab)?.data

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-gray-300">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentData && (
        <div className="space-y-6">
          {currentData.charts && currentData.charts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Charts</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Chart</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Country</th>
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
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Playlist Adds</h4>
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
      )}
    </div>
  )
}
