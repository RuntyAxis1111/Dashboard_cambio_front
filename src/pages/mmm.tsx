import { useState } from 'react'
import { ChevronRight, Play, Save, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function MMM() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const scenarios = [
    { id: 'baseline', name: 'Baseline 2024', lastRun: '2024-01-15' },
    { id: 'q1-boost', name: 'Q1 Budget Boost', lastRun: '2024-01-10' },
    { id: 'summer-campaign', name: 'Summer Campaign', lastRun: '2024-01-08' }
  ]

  return (
    <div className="h-full flex">
      {/* Left Panel - Scenarios */}
      <div className="w-80 bg-card border-r border-border p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/ai" className="hover:text-foreground transition-colors">
            AI Studio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">MMM</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Marketing Mix Modeling</h1>
          <p className="text-sm text-muted-foreground">
            Optimize media spend and measure channel effectiveness
          </p>
        </div>

        {/* New Scenario Button */}
        <Button className="w-full">
          <Play className="w-4 h-4 mr-2" />
          New Scenario
        </Button>

        {/* Saved Scenarios */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Saved Scenarios</h3>
          <div className="space-y-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedScenario === scenario.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-medium text-sm">{scenario.name}</div>
                <div className="text-xs opacity-60">Last run: {scenario.lastRun}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6">
        {selectedScenario ? (
          <>
            {/* Scenario Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {scenarios.find(s => s.id === selectedScenario)?.name}
                </h2>
                <p className="text-muted-foreground">Configure inputs and run simulation</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* MMM Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Media Investment</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">YouTube</label>
                        <input 
                          type="number" 
                          placeholder="$50,000"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Instagram</label>
                        <input 
                          type="number" 
                          placeholder="$30,000"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">TikTok</label>
                        <input 
                          type="number" 
                          placeholder="$25,000"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Facebook</label>
                        <input 
                          type="number" 
                          placeholder="$20,000"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Time Window</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">End Date</label>
                      <input 
                        type="date" 
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Run Simulation
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Channel Contribution</h3>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will appear here after simulation</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">ROI Analysis</h3>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">ROI metrics will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Select a Scenario</h2>
              <p className="text-muted-foreground">
                Choose a saved scenario or create a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}