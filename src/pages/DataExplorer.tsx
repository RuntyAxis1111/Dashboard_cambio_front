import { useState } from 'react'
import { Search, Database, Table, FileText, Download } from 'lucide-react'

export function DataExplorer() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const datasets = [
    {
      id: 'social_media_metrics',
      name: 'Social Media Metrics',
      description: 'Comprehensive social media performance data across all platforms',
      tables: 12,
      lastUpdated: '2 hours ago',
      owner: 'Data Team',
      category: 'Social Media'
    },
    {
      id: 'streaming_analytics',
      name: 'Streaming Analytics',
      description: 'Music streaming data from Spotify, Apple Music, and other platforms',
      tables: 8,
      lastUpdated: '4 hours ago',
      owner: 'Analytics Team',
      category: 'Music'
    },
    {
      id: 'fan_engagement',
      name: 'Fan Engagement',
      description: 'Community interactions, comments, and fan behavior patterns',
      tables: 15,
      lastUpdated: '1 day ago',
      owner: 'Community Team',
      category: 'Engagement'
    },
    {
      id: 'marketing_spend',
      name: 'Marketing Spend',
      description: 'Advertising costs and campaign performance across channels',
      tables: 6,
      lastUpdated: '3 hours ago',
      owner: 'Marketing Team',
      category: 'Marketing'
    }
  ]

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Data Explorer</h1>
          <p className="text-gray-600">
            Browse datasets, explore schemas, and discover available data sources
          </p>
        </div>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-gray-100 border border-gray-300 rounded-2xl p-6 hover:border-gray-400 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-lg">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">{dataset.name}</h3>
                    <span className="text-xs text-gray-600">{dataset.category}</span>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {dataset.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Table className="w-3 h-3" />
                    {dataset.tables} tables
                  </div>
                  <div>Updated {dataset.lastUpdated}</div>
                </div>
                <div>by {dataset.owner}</div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-black">
                  View Schema
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
                  <FileText className="w-3 h-3" />
                  Query
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No datasets found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}