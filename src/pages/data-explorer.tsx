import { useState } from 'react'
import { Search, Database, Table, Calendar, User, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/button'

const datasets = [
  {
    id: 'social-media-posts',
    name: 'Social Media Posts',
    description: 'All posts across platforms with engagement metrics',
    owner: 'Data Team',
    lastUpdated: '2 hours ago',
    rows: '2.3M',
    columns: 45,
    tags: ['social', 'engagement', 'content']
  },
  {
    id: 'artist-metrics',
    name: 'Artist Performance Metrics',
    description: 'Aggregated performance data for all artists',
    owner: 'Analytics Team',
    lastUpdated: '1 hour ago',
    rows: '156K',
    columns: 32,
    tags: ['artists', 'performance', 'kpis']
  },
  {
    id: 'community-engagement',
    name: 'Community Engagement',
    description: 'Fan community interaction and sentiment data',
    owner: 'Community Team',
    lastUpdated: '30 minutes ago',
    rows: '890K',
    columns: 28,
    tags: ['community', 'sentiment', 'engagement']
  },
  {
    id: 'marketing-spend',
    name: 'Marketing Spend',
    description: 'Media investment and campaign performance data',
    owner: 'Marketing Team',
    lastUpdated: '4 hours ago',
    rows: '45K',
    columns: 18,
    tags: ['marketing', 'spend', 'campaigns']
  }
]

export function DataExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Data Explorer</h1>
          <p className="text-muted-foreground">
            Browse datasets, explore schemas, and understand your data catalog
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search datasets..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDatasets.map((dataset) => (
          <div
            key={dataset.id}
            className={`bg-card border rounded-xl p-6 transition-all duration-200 cursor-pointer ${
              selectedDataset === dataset.id 
                ? 'border-primary shadow-lg' 
                : 'border-border hover:shadow-md hover:scale-105'
            }`}
            onClick={() => setSelectedDataset(selectedDataset === dataset.id ? null : dataset.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">{dataset.name}</h3>
                  <p className="text-sm text-muted-foreground">{dataset.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Table className="w-4 h-4" />
                <span>{dataset.rows} rows, {dataset.columns} columns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{dataset.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {dataset.lastUpdated}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {dataset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Expanded Content */}
            {selectedDataset === dataset.id && (
              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Sample Query</h4>
                  <div className="bg-muted rounded-lg p-3">
                    <code className="text-xs text-foreground font-mono">
                      SELECT * FROM {dataset.id.replace('-', '_')} WHERE date >= '2024-01-01' LIMIT 100
                    </code>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm">
                    Open in Hybe LLM
                  </Button>
                  <Button variant="outline" size="sm">
                    View Schema
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDatasets.length === 0 && (
        <div className="text-center py-16 space-y-6">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Database className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Datasets Found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all available datasets.
            </p>
          </div>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}