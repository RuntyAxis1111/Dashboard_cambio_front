import { Beaker, ExternalLink } from 'lucide-react'

export function Experiments() {
  const experiments = [
    {
      id: 'emotion-detection',
      name: 'Emotion Detection',
      description: 'Analyze emotional sentiment in social media content and fan reactions',
      status: 'Beta',
      category: 'Content Analysis',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'concert-analytics',
      name: 'Concert Analytics',
      description: 'Real-time audience engagement and venue performance metrics',
      status: 'Alpha',
      category: 'Live Events',
      lastUpdated: '2024-01-10'
    },
    {
      id: 'trend-prediction',
      name: 'Trend Prediction',
      description: 'Forecast viral content potential and optimal posting times',
      status: 'Coming Soon',
      category: 'Forecasting',
      lastUpdated: '2024-01-05'
    }
  ]

  const statusColors = {
    'Beta': 'bg-orange-600/20 text-orange-400',
    'Alpha': 'bg-blue-600/20 text-blue-400',
    'Coming Soon': 'bg-neutral-600/20 text-neutral-400'
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Experiments</h1>
          <p className="text-neutral-400">
            Explore cutting-edge AI prototypes and experimental features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600/20 rounded-xl">
                  <Beaker className="w-6 h-6 text-green-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[experiment.status as keyof typeof statusColors]}`}>
                  {experiment.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{experiment.name}</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                {experiment.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-500">{experiment.category}</div>
                  <div className="text-xs text-neutral-600">Updated {experiment.lastUpdated}</div>
                </div>
                {experiment.status !== 'Coming Soon' && (
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
            <Beaker className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">More experiments coming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}