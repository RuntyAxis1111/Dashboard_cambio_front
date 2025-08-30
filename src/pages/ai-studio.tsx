import { Link } from 'react-router-dom'
import { Brain, TrendingUp, MessageSquare, Beaker, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

const aiTools = [
  {
    id: 'mmm',
    title: 'Marketing Mix Modeling',
    description: 'Optimize media spend allocation and measure channel effectiveness',
    href: '/ai/mmm',
    icon: TrendingUp,
    color: 'bg-blue-500',
    status: 'Ready'
  },
  {
    id: 'llm',
    title: 'Hybe LLM Assistant',
    description: 'Conversational analytics with natural language to SQL',
    href: '/ai/llm',
    icon: MessageSquare,
    color: 'bg-purple-500',
    status: 'Beta'
  },
  {
    id: 'experiments',
    title: 'Experiments',
    description: 'Prototype AI features and experimental tools',
    href: '/ai/experiments',
    icon: Beaker,
    color: 'bg-green-500',
    status: 'Labs'
  }
]

export function AIStudio() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">AI Studio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Model. Simulate. Ask the data. Unlock insights with AI-powered analytics tools.
        </p>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {aiTools.map((tool) => (
          <div
            key={tool.id}
            className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                tool.status === 'Ready' ? 'bg-hybe-green text-white' :
                tool.status === 'Beta' ? 'bg-hybe-gold text-black' :
                'bg-muted text-muted-foreground'
              }`}>
                {tool.status}
              </span>
            </div>

            {/* Icon */}
            <div className={`w-16 h-16 ${tool.color} rounded-xl flex items-center justify-center text-white mb-6`}>
              <tool.icon className="w-8 h-8" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <Button asChild className="w-full group">
                <Link to={tool.href}>
                  Launch Tool
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">More AI Tools Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're continuously developing new AI capabilities to enhance your analytics workflow.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/subscriptions">
                Get Notified
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}