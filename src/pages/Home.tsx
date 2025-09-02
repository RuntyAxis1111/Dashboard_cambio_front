import { Link } from 'react-router-dom'
import { BarChart3, Brain, Bell } from 'lucide-react'

export function Home() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            From dashboards to decisions.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to HYBE LATAM Data & AI Lab. Your central hub for analytics, 
            AI-powered insights, and data-driven decision making.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link 
            to="/dashboards"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-xl mb-6 group-hover:bg-blue-600/30 transition-colors">
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Open Dashboards</h3>
            <p className="text-gray-600 leading-relaxed">
              Access real-time analytics for all your artists across social media platforms, 
              streaming services, and engagement metrics.
            </p>
          </Link>
          
          <Link 
            to="/ai"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-xl mb-6 group-hover:bg-purple-600/30 transition-colors">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Open AI Studio</h3>
            <p className="text-gray-600 leading-relaxed">
              Leverage advanced AI tools for marketing mix modeling, conversational analytics, 
              and experimental insights.
            </p>
          </Link>
          
          <Link 
            to="/subscriptions"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-xl mb-6 group-hover:bg-green-600/30 transition-colors">
              <Bell className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Create Subscription</h3>
            <p className="text-gray-600 leading-relaxed">
              Set up intelligent alerts and notifications for key metrics, 
              anomalies, and performance thresholds.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}