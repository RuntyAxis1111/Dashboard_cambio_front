import { useState } from 'react'
import { Send, Database, History, Bookmark, Code, BarChart } from 'lucide-react'

export function HybeLLM() {
  const [message, setMessage] = useState('')
  const [showSQL, setShowSQL] = useState(false)
  
  const conversations = [
    { id: 1, question: "What's the top performing content this month?", time: "2 hours ago" },
    { id: 2, question: "Show me engagement trends by platform", time: "Yesterday" },
    { id: 3, question: "Compare PALF vs STBV performance", time: "2 days ago" },
  ]

  return (
    <div className="h-full grid grid-cols-[1fr_300px]">
      {/* Main Chat Area */}
      <div className="flex flex-col">
        <div className="border-b border-neutral-800 p-6">
          <h1 className="text-2xl font-semibold text-white mb-2">Hybe LLM</h1>
          <p className="text-neutral-400">Ask questions about your data in natural language</p>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          {/* Welcome Message */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium text-white">Hybe Assistant</span>
            </div>
            <p className="text-neutral-300">
              Hello! I'm your data analyst. Ask me anything about your artists' performance, 
              engagement metrics, or trends. I can generate SQL queries and create visualizations for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">
                "Show me top posts this week"
              </button>
              <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">
                "Compare platform performance"
              </button>
              <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">
                "Engagement trends by country"
              </button>
            </div>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="border-t border-neutral-800 p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your data..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Ask
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input
                type="checkbox"
                checked={showSQL}
                onChange={(e) => setShowSQL(e.target.checked)}
                className="rounded"
              />
              Show SQL
            </label>
            <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors">
              <BarChart className="w-4 h-4" />
              Add Chart
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="bg-neutral-900 border-l border-neutral-800 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Context
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-neutral-800 rounded-lg">
              <div className="text-sm font-medium text-white">Active Dataset</div>
              <div className="text-xs text-neutral-400">social_media_metrics</div>
            </div>
            <div className="p-3 bg-neutral-800 rounded-lg">
              <div className="text-sm font-medium text-white">Date Range</div>
              <div className="text-xs text-neutral-400">Last 30 days</div>
            </div>
            <div className="p-3 bg-neutral-800 rounded-lg">
              <div className="text-sm font-medium text-white">Filters</div>
              <div className="text-xs text-neutral-400">All projects, All platforms</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left p-3 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <div className="text-sm text-white truncate">{conv.question}</div>
                <div className="text-xs text-neutral-500">{conv.time}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Insights
          </h3>
          <div className="text-sm text-neutral-500">
            No saved insights yet
          </div>
        </div>
      </div>
    </div>
  )
}