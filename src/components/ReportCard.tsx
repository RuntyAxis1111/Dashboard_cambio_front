import { Link } from 'react-router-dom'
import { Calendar, ExternalLink } from 'lucide-react'

interface ReportCardProps {
  artistId: string
  artistName: string
  weekEnd: string | null
  imageUrl?: string | null
}

export function ReportCard({ artistId, artistName, weekEnd, imageUrl }: ReportCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Link
      to={`/reports/${artistId}?week=${weekEnd || ''}`}
      className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 hover:border-gray-400 transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center gap-4 mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={artistName}
            className="w-16 h-16 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">
              {getInitials(artistName)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black">{artistName}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <Calendar className="w-3 h-3" />
            {weekEnd ? (
              <span>Week ending {weekEnd}</span>
            ) : (
              <span className="text-gray-400">No week loaded</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
        <span className="text-sm font-medium text-gray-700">View Report</span>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
      </div>
    </Link>
  )
}
