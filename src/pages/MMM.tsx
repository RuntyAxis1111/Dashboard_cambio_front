import { useState } from 'react'
import { Play, Save, Download, Share } from 'lucide-react'

export function MMM() {
  const [selectedScenario, setSelectedScenario] = useState('baseline')
  
  const scenarios = [
    { id: 'baseline', name: 'Baseline 2024', date: '2024-01-15' },
    { id: 'q2-boost', name: 'Q2 Boost Campaign', date: '2024-02-01' },
    { id: 'holiday', name: 'Holiday Strategy', date: '2024-03-10' },
  ]

  return (
    <div className="h-full grid grid-cols-[300px_1fr]">
      {/* Left Panel - Scenarios */}
      <div className="bg-neutral-900 border-r border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Scenarios</h2>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
            New Scenario
          </button>
        </div>
        
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedScenario === scenario.id
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <div className="font-medium">{scenario.name}</div>
              <div className="text-xs text-neutral-500">{scenario.date}</div>
            </button>
          ))}
        </div>
        
        {/* MMM Results iframe */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-neutral-300 mb-3">Current Results</h3>
          <div className="h-64 bg-neutral-800 rounded-lg overflow-hidden">
            <iframe
              src="/mmm/results"
              title="MMM Results"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden">
        <div className="border-b border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Marketing Mix Modeling</h1>
              <p className="text-neutral-400 mt-1">Optimize media spend allocation and attribution</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors">
                <Play className="w-4 h-4" />
                Run Simulation
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Media Spend Allocation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">YouTube Ads</label>
                  <input type="number" placeholder="50000" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Instagram Ads</label>
                  <input type="number" placeholder="30000" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">TikTok Ads</label>
                  <input type="number" placeholder="25000" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Facebook Ads</label>
                  <input type="number" placeholder="20000" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Model Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Time Window</label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white">
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Market</label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white">
                    <option>All Markets</option>
                    <option>Mexico</option>
                    <option>Colombia</option>
                    <option>Argentina</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Channel Contribution</h3>
              <div className="h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500">Chart placeholder - Run simulation to see results</span>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">ROI Analysis</h3>
              <div className="h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500">Chart placeholder - Run simulation to see results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}