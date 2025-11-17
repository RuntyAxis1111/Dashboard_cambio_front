import { Link } from 'react-router-dom'
import { TrendingUp, Calendar, Search, FileEdit } from 'lucide-react'

export function Reports() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Reports Center
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Access weekly reports, analytics summaries, and export-ready documents for all your artists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <Link
            to="/reports/weeklies"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-blue-600/30 transition-colors">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Weekly Reports</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              View and export weekly performance reports by artist, including streaming data,
              social metrics, and market insights.
            </p>
          </Link>

          <div className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-xl mb-4 sm:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Monthly Summaries</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Comprehensive monthly performance summaries with trend analysis and key insights.
            </p>
            <span className="inline-block mt-4 text-xs font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>

          <Link
            to="/reports/make"
            className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-gray-400 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600/20 rounded-xl mb-4 sm:mb-6 group-hover:bg-green-600/30 transition-colors">
              <FileEdit className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Make Your Report</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Generate custom performance reports for any artist and date range.
            </p>
          </Link>

          <div className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 sm:p-8 opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-600/20 rounded-xl mb-4 sm:mb-6">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Scouting New Artist</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Discover and analyze emerging artists with market potential and growth indicators.
            </p>
            <span className="inline-block mt-4 text-xs font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
