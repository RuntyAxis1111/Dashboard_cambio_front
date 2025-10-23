import { TrendingUp, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DSPReportCardProps {
  entityId: string
  entityName: string
  imageUrl: string | null
  totalFollowers: number
  totalListeners: number
  followersDelta7d: number
  listenersDelta7d: number
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function DSPReportCard({
  entityId,
  entityName,
  imageUrl,
  totalFollowers,
  totalListeners,
  followersDelta7d,
  listenersDelta7d
}: DSPReportCardProps) {
  return (
    <Link
      to={`/weeklies/dsp/${entityId}`}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 group"
    >
      <div className="flex items-center gap-4 mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={entityName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors flex items-center gap-2">
            {entityName}
            <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-gray-500">DSP Live Growth</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Followers</div>
          <div className="text-xl font-bold text-gray-900">{formatNumber(totalFollowers)}</div>
          {followersDelta7d !== 0 && (
            <div
              className={`text-xs font-medium mt-1 ${
                followersDelta7d > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {followersDelta7d > 0 ? '+' : ''}
              {formatNumber(followersDelta7d)} (7d)
            </div>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Monthly Listeners</div>
          <div className="text-xl font-bold text-gray-900">{formatNumber(totalListeners)}</div>
          {listenersDelta7d !== 0 && (
            <div
              className={`text-xs font-medium mt-1 ${
                listenersDelta7d > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {listenersDelta7d > 0 ? '+' : ''}
              {formatNumber(listenersDelta7d)} (7d)
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          Spotify
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
          Apple
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
          Amazon
        </div>
      </div>
    </Link>
  )
}
