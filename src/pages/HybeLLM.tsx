import { useState } from 'react'
import { Send, Database, History, Bookmark, Code, ChartBar as BarChart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function HybeLLM() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [showSQL, setShowSQL] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const conversations = [
    { id: 1, question: "What's the top performing content this month?", time: "2 hours ago" },
    { id: 2, question: "Show me engagement trends by platform", time: "Yesterday" },
    { id: 3, question: "Compare PALF vs STBV performance", time: "2 days ago" },
  ]

  const sendToWebhooks = async (userEmail: string, question: string) => {
    const webhookData = {
      email: userEmail,
      message: question,
      timestamp: new Date().toISOString(),
      source: 'hybe_llm_conversational_analytics'
    }

    const webhooks = [
      'https://runtyaxis.app.n8n.cloud/webhook/c4d010d4-6115-4f19-becd-174e6f97be0f',
      'https://runtyaxis.app.n8n.cloud/webhook-test/c4d010d4-6115-4f19-becd-174e6f97be0f'
    ]

    // Enviar a ambos webhooks en paralelo
    const webhookPromises = webhooks.map(async (webhookUrl) => {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        })
        
        if (!response.ok) {
          console.warn(`Webhook ${webhookUrl} failed with status:`, response.status)
        } else {
          console.log(`✅ Webhook ${webhookUrl} sent successfully`)
        }
      } catch (error) {
        console.error(`Error sending to webhook ${webhookUrl}:`, error)
      }
    })

    // Esperar a que todos los webhooks se envíen (sin fallar si alguno falla)
    await Promise.allSettled(webhookPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || !user?.email) return
    
    setIsSubmitting(true)
    
    try {
      // Enviar a webhooks
      await sendToWebhooks(user.email, message.trim())
      
      // Aquí puedes agregar la lógica para procesar la pregunta
      console.log('Question submitted:', message)
      
      // Limpiar el mensaje después de enviar
      setMessage('')
      
    } catch (error) {
      console.error('Error submitting question:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="h-full grid grid-cols-[1fr_300px] bg-white">
      {/* Main Chat Area */}
      <div className="flex flex-col">
        <div className="border-b border-gray-300 p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold text-black mb-2">Hybe LLM</h1>
          <p className="text-gray-600">Ask questions about your data in natural language</p>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          {/* Welcome Message */}
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium text-black">Hybe Assistant</span>
            </div>
            <p className="text-gray-700">
              Hello! I'm your data analyst. Ask me anything about your artists' performance, 
              engagement metrics, or trends. I can generate SQL queries and create visualizations for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors text-black">
                "Show me top posts this week"
              </button>
              <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors text-black">
                "Compare platform performance"
              </button>
              <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors text-black">
                "Engagement trends by country"
              </button>
            </div>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-300 p-6 bg-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your data..."
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Ask'}
            </button>
          </form>
          
          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showSQL}
                onChange={(e) => setShowSQL(e.target.checked)}
                className="rounded"
              />
              Show SQL
            </label>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors">
              <BarChart className="w-4 h-4" />
              Add Chart
            </button>
          </div>
          
          {/* User info display */}
          {user?.email && (
            <div className="mt-2 text-xs text-gray-500">
              Logged in as: {user.email}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="bg-gray-100 border-l border-gray-300 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Context
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-200 rounded-lg">
              <div className="text-sm font-medium text-black">Active Dataset</div>
              <div className="text-xs text-gray-600">social_media_metrics</div>
            </div>
            <div className="p-3 bg-gray-200 rounded-lg">
              <div className="text-sm font-medium text-black">Date Range</div>
              <div className="text-xs text-gray-600">Last 30 days</div>
            </div>
            <div className="p-3 bg-gray-200 rounded-lg">
              <div className="text-sm font-medium text-black">Filters</div>
              <div className="text-xs text-gray-600">All projects, All platforms</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="text-sm text-black truncate">{conv.question}</div>
                <div className="text-xs text-gray-600">{conv.time}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Insights
          </h3>
          <div className="text-sm text-gray-600">
            No saved insights yet
          </div>
        </div>
      </div>
    </div>
  )
}