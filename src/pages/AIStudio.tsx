import { Link } from 'react-router-dom'
import { TrendingUp, MessageSquare, Beaker } from 'lucide-react'

export function AIStudio() {
  const tools = [
    {
      name: 'MMM',
      title: 'Marketing Mix Modeling',
      description: 'Optimize your media spend allocation across channels with advanced attribution modeling and scenario planning.',
      icon: TrendingUp,
      href: '/ai/mmm',
      color: 'blue',
      status: 'Available'
    },
    {
      name: 'Hybe LLM',
      title: 'Conversational Analytics',
      description: 'Ask questions about your data in natural language. Get insights, generate SQL queries, and create visualizations.',
      icon: MessageSquare,
      href: '/ai/llm',
      color: 'purple',
      status: 'Available'
    },
    {
      name: 'Experiments',
      title: 'AI Experiments',
      description: 'Explore cutting-edge AI prototypes and experimental features for advanced analytics and insights.',
      icon: Beaker,
      href: '/ai/experiments',
      color: 'green',
      status: 'Beta'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30',
    purple: 'bg-purple-600/20 text-purple-400 group-hover:bg-purple-600/30',
    green: 'bg-green-600/20 text-green-400 group-hover:bg-green-600/30',
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Studio</h1>
          <p className="text-neutral-400">
            Model. Simulate. Ask the data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.href}
              className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-xl transition-colors ${colorClasses[tool.color as keyof typeof colorClasses]}`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tool.status === 'Beta' 
                    ? 'bg-orange-600/20 text-orange-400' 
                    : 'bg-green-600/20 text-green-400'
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">{tool.title}</h3>
              <p className="text-neutral-400 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}