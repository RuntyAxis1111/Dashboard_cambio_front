import { Link } from 'react-router-dom'
import { BarChart3, Brain, Bell, FileText } from 'lucide-react'

export function Home() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            From dashboards to decisions.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Welcome to HYBE LATAM Data & AI Lab. Your central hub for analytics,
            AI-powered insights, and data-driven decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <Link
            to="/reports"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-emerald-600/30 transition-colors">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">View Reports</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Access weekly performance reports, analytics summaries, and detailed insights for all your artists.
            </p>
          </Link>

          <Link
            to="/dashboards"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-blue-600/30 transition-colors">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Open Dashboards</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Access real-time analytics for all your artists across social media platforms,
              streaming services, and engagement metrics.
            </p>
          </Link>

          <Link
            to="/ai"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-purple-600/30 transition-colors">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Open AI Studio</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Leverage advanced AI tools for marketing mix modeling, conversational analytics,
              and experimental insights.
            </p>
          </Link>

          <Link
            to="/subscriptions"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-amber-600/30 transition-colors">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Create Subscription</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Set up intelligent alerts and notifications for key metrics,
              anomalies, and performance thresholds.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}