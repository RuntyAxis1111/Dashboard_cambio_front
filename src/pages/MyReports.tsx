import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { FileText, Calendar, User, ChevronRight } from 'lucide-react'

interface ReportItem {
  id: string
  user_id: string
  title: string
  html_content: string
  artist_name: string | null
  artist_image: string | null
  week_start: string | null
  week_end: string | null
  created_at: string
  updated_at: string
}

export function MyReports() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function loadMyReports() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        if (!user) {
          setLoading(false)
          return
        }

        const { data: myReports, error } = await supabase
          .from('my_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading reports:', error)
          setReports([])
          return
        }

        if (!myReports || myReports.length === 0) {
          setReports([])
          return
        }

        const artistNames = [...new Set(myReports.map(r => r.artist_name).filter(Boolean))]

        let artistImages: Record<string, string> = {}
        if (artistNames.length > 0) {
          const { data: artistData } = await supabase
            .from('reportes_entidades')
            .select('nombre, imagen_url')
            .in('nombre', artistNames)

          if (artistData) {
            artistImages = Object.fromEntries(
              artistData.map(a => [a.nombre, a.imagen_url])
            )
          }
        }

        const enrichedReports = myReports.map(report => ({
          ...report,
          artist_image: report.artist_name ? artistImages[report.artist_name] || null : null
        }))

        setReports(enrichedReports)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMyReports()
  }, [])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'My Reports' }
  ]

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-black mb-2">Not Authenticated</h2>
            <p className="text-gray-600">Please log in to view your reports.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black">My Reports</h1>
          <p className="text-gray-600 mt-2">
            Reports you have created ({reports.length})
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600">
              You haven't created any reports yet. Create your first report to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`/my-reports/${report.id}`}
                className="group block bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {report.artist_image ? (
                      <img
                        src={report.artist_image}
                        alt={report.artist_name || 'Artist'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-black group-hover:text-gray-700 transition-colors truncate">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1">
                      {report.artist_name && (
                        <span className="text-sm text-gray-600 font-medium">
                          {report.artist_name}
                        </span>
                      )}

                      {report.week_start && report.week_end && (
                        <>
                          {report.artist_name && (
                            <span className="text-gray-300">•</span>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            <span className="truncate">
                              {report.week_start} — {report.week_end}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <User className="w-3 h-3 mr-1" />
                      <span>
                        Created {new Date(report.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
