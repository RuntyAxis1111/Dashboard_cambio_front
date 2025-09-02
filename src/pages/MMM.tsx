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
    <div className="h-full grid grid-cols-[300px_1fr] bg-white">
      {/* Left Panel - Scenarios */}
      <div className="bg-gray-100 border-r border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Scenarios</h2>
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
                  ? 'bg-gray-200 text-black'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{scenario.name}</div>
              <div className="text-xs text-gray-500">{scenario.date}</div>
            </button>
          ))}
        </div>
        
        {/* MMM Results iframe */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-black mb-3">Current Results</h3>
          <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
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
        <div className="border-b border-gray-300 p-6 bg-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-black">Marketing Mix Modeling</h1>
              <p className="text-gray-600 mt-1">Optimize media spend allocation and attribution</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors">
                <Play className="w-4 h-4" />
                Run Simulation
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg transition-colors text-black">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg transition-colors text-black">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Media Spend Allocation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">YouTube Ads</label>
                  <input type="number" placeholder="50000" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Instagram Ads</label>
                  <input type="number" placeholder="30000" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">TikTok Ads</label>
                  <input type="number" placeholder="25000" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Facebook Ads</label>
                  <input type="number" placeholder="20000" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Model Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Time Window</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black">
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Market</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black">
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
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Channel Contribution</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">Chart placeholder - Run simulation to see results</span>
              </div>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-black mb-4">ROI Analysis</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">Chart placeholder - Run simulation to see results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}