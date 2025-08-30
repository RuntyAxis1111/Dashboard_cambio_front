import { ChevronRight, Beaker, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'

const experiments = [
  {
    id: 'emotion-detection',
    title: 'Emotion Detection',
    description: 'Analyze emotional sentiment in social media content',
    status: 'In Development',
    color: 'bg-yellow-500'
  },
  {
    id: 'concert-analytics',
    title: 'Concert Analytics',
    description: 'Real-time audience engagement during live events',
    status: 'Beta',
    color: 'bg-purple-500'
  },
  {
    id: 'trend-prediction',
    title: 'Trend Prediction',
    description: 'Predict viral content and trending topics',
    status: 'Research',
    color: 'bg-blue-500'
  }
]

export function Experiments() {
  const { appId } = useParams()
  const selectedExperiment = experiments.find(exp => exp.id === appId)

  if (selectedExperiment) {
    return (
      <div className="p-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/ai" className="hover:text-foreground transition-colors">
            AI Studio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/ai/experiments" className="hover:text-foreground transition-colors">
            Experiments
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{selectedExperiment.title}</span>
        </nav>

        {/* Experiment Detail */}
        <div className="max-w-4xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${selectedExperiment.color} rounded-xl flex items-center justify-center text-white`}>
                <Beaker className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground">{selectedExperiment.title}</h1>
                <p className="text-muted-foreground">{selectedExperiment.description}</p>
              </div>
              <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
                selectedExperiment.status === 'Beta' ? 'bg-hybe-gold text-black' :
                selectedExperiment.status === 'In Development' ? 'bg-yellow-500 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {selectedExperiment.status}
              </span>
            </div>
          </div>

          {/* Experiment Interface */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center py-16 space-y-4">
              <Beaker className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground">Experiment Interface</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This experimental feature is currently in development. 
                The interface will be available soon.
              </p>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Request Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/ai" className="hover:text-foreground transition-colors">
          AI Studio
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Experiments</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Experiments</h1>
        <p className="text-muted-foreground">
          Explore cutting-edge AI features and experimental tools
        </p>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Link
            key={experiment.id}
            to={`/ai/experiments/${experiment.id}`}
            className="group block bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${experiment.color} rounded-xl flex items-center justify-center text-white`}>
                <Beaker className="w-6 h-6" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                experiment.status === 'Beta' ? 'bg-hybe-gold text-black' :
                experiment.status === 'In Development' ? 'bg-yellow-500 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {experiment.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {experiment.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {experiment.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-4">Have an Idea?</h2>
        <p className="text-muted-foreground mb-6">
          Suggest new experiments or AI features you'd like to see in the lab.
        </p>
        <Button variant="outline">
          Submit Proposal
        </Button>
      </div>
    </div>
  )
}