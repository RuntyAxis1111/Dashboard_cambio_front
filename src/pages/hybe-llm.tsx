import { useState } from 'react'
import { ChevronRight, Send, Database, History, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function HybeLLM() {
  const [message, setMessage] = useState('')
  const [showSQL, setShowSQL] = useState(false)

  const chatHistory = [
    {
      id: 1,
      type: 'user',
      content: 'Show me top performing posts for Daddy Yankee last month'
    },
    {
      id: 2,
      type: 'assistant',
      content: 'Here are the top performing posts for Daddy Yankee in December 2024:',
      sql: 'SELECT post_id, content, engagement_rate, reach FROM posts WHERE artist_id = "daddy-yankee" AND date >= "2024-12-01" ORDER BY engagement_rate DESC LIMIT 10',
      hasChart: true
    }
  ]

  const savedInsights = [
    { id: 1, title: 'Top Posts Analysis', date: '2024-01-15' },
    { id: 2, title: 'Engagement Trends', date: '2024-01-14' },
    { id: 3, title: 'Audience Demographics', date: '2024-01-13' }
  ]

  return (
    <div className="h-full flex">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/ai" className="hover:text-foreground transition-colors">
              AI Studio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Hybe LLM</span>
          </nav>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Hybe LLM Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions about your data in natural language
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-sql"
                checked={showSQL}
                onChange={(e) => setShowSQL(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="show-sql" className="text-sm text-foreground">
                Show SQL
              </label>
            </div>
            <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              Sandbox Dataset
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl space-y-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border'
              } rounded-xl p-4`}>
                <p className="text-sm">{message.content}</p>
                
                {message.sql && showSQL && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Generated SQL:</div>
                    <code className="text-xs text-foreground font-mono">{message.sql}</code>
                  </div>
                )}
                
                {message.hasChart && (
                  <div className="bg-muted rounded-lg p-4 h-48 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Chart visualization would appear here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your data... (e.g., 'Show engagement trends for BTS')"
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  // Handle send message
                  setMessage('')
                }
              }}
            />
            <Button size="lg" disabled={!message.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Context & History */}
      <div className="w-80 bg-card border-l border-border p-6 space-y-6">
        {/* Active Dataset */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4" />
            Active Dataset
          </h3>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium text-foreground">HYBE LATAM Analytics</div>
            <div className="text-xs text-muted-foreground">Last updated: 2 hours ago</div>
          </div>
        </div>

        {/* Query History */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {chatHistory.filter(m => m.type === 'user').map((query) => (
              <button
                key={query.id}
                className="w-full text-left p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {query.content}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Insights
          </h3>
          <div className="space-y-2">
            {savedInsights.map((insight) => (
              <div key={insight.id} className="p-2 border border-border rounded-md">
                <div className="text-xs font-medium text-foreground">{insight.title}</div>
                <div className="text-xs text-muted-foreground">{insight.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}