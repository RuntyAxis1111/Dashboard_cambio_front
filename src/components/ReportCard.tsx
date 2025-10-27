import { Link } from 'react-router-dom'
import { Calendar, ExternalLink, CheckCircle, XCircle } from 'lucide-react'

interface ReportCardProps {
  artistId: string
  artistName: string
  weekEnd: string | null
  imageUrl?: string | null
  status?: string | null
}

export function ReportCard({ artistId, artistName, weekEnd, imageUrl, status }: ReportCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const isReady = status === 'ready'

  return (
    <Link
      to={`/reports/${artistId}?week=${weekEnd || ''}`}
      className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 hover:border-gray-400 transition-all duration-200 hover:scale-105 relative"
    >
      <div className="absolute top-4 right-4">
        {isReady ? (
          <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>Not Ready</span>
          </div>
        )}
      </div>
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
              <span>Week ending {formatDate(weekEnd)}</span>
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
