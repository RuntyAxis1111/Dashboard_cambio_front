import { Link } from 'react-router-dom'
import { TrendingUp, MessageSquare, Beaker } from 'lucide-react'

export function AIStudio() {
  const tools = [
    {
      name: 'AI Emotion Detection',
      title: 'AI Emotion Detection',
      description: 'Real-time emotion analysis using advanced computer vision and machine learning models.',
      icon: Beaker,
      href: '/ai/emotion-detection',
      color: 'green',
      status: 'Available'
    },
    {
      name: 'MMM',
      title: 'Marketing Mix Modeling',
      description: 'Optimize your media spend allocation across channels with advanced attribution modeling and scenario planning.',
      icon: TrendingUp,
      href: '/ai/mmm',
      color: 'blue',
      status: 'Preview'
    },
    {
      name: 'Hybe LLM',
      title: 'Conversational Analytics',
      description: 'Ask questions about your data in natural language. Get insights, generate SQL queries, and create visualizations.',
      icon: MessageSquare,
      href: '/ai/llm',
      color: 'purple',
      status: 'Preview'
    },
  ]

  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30',
    purple: 'bg-purple-600/20 text-purple-400 group-hover:bg-purple-600/30',
    green: 'bg-green-600/20 text-green-400 group-hover:bg-green-600/30',
  }

  return (
    <div className="p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">AI Studio</h1>
          <p className="text-gray-600">
            Model. Simulate. Ask the data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.href}
              className="group bg-gray-100 border border-gray-300 rounded-2xl p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-xl transition-colors bg-${tool.color}-200`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tool.status === 'Available' 
                    ? 'bg-green-200 text-green-700'
                    : tool.status === 'Beta'
                    ? 'bg-orange-200 text-orange-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-black mb-3">{tool.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}