import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ExternalLink } from 'lucide-react'
import { getLatestWeekEnd, getArtistsForWeek, ArtistSummary } from '../lib/reports-api'
import { Breadcrumb } from '../components/Breadcrumb'

const SAMPLE_ARTISTS: ArtistSummary[] = [
  {
    artist_id: 'katseye',
    artist_name: 'KATSEYE',
    week_end: '2025-10-06',
    cover_image_url: '/assets/image copy.png'
  },
  {
    artist_id: 'adrian-cota',
    artist_name: 'ADRIÁN COTA',
    week_end: '2025-10-07',
    cover_image_url: '/assets/image.png'
  },
  {
    artist_id: 'magna',
    artist_name: 'MAGNA',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy.png'
  },
  {
    artist_id: 'gregorio',
    artist_name: 'GREGORIO',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy.png'
  },
  {
    artist_id: 'santos-bravos',
    artist_name: 'SANTOS BRAVOS',
    week_end: '2025-10-08',
    cover_image_url: '/assets/image copy copy copy copy copy copy.png'
  }
]

export function Weeklies() {
  const [artists, setArtists] = useState<ArtistSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setArtists(SAMPLE_ARTISTS)
    setLoading(false)
  }, [])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports' }
  ]

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Weekly Reports</h1>
          <p className="text-gray-600">
            Select an artist to view their latest weekly performance report
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 border border-gray-300 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Link
                key={artist.artist_id}
                to={`/reports/weeklies/${artist.artist_id}?week=${artist.week_end}`}
                className="group bg-gray-100 border border-gray-300 rounded-2xl p-6 hover:border-gray-400 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  {artist.cover_image_url ? (
                    <img
                      src={artist.cover_image_url}
                      alt={artist.artist_name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">
                        {artist.artist_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">{artist.artist_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Week ending {artist.week_end}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                  <span className="text-sm font-medium text-gray-700">View Report</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && artists.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No reports yet</h3>
            <p className="text-gray-600">Weekly reports will appear here once generated</p>
          </div>
        )}
      </div>
    </div>
  )
}
