import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { FileText, Calendar, User } from 'lucide-react'

interface ReportItem {
  id: string
  user_id: string
  title: string
  html_content: string
  artist_name: string | null
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

        const { data, error } = await supabase
          .from('my_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading reports:', error)
        } else {
          setReports(data || [])
        }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`/my-reports/${report.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black mb-1">
                      {report.title}
                    </h3>
                    {report.artist_name && (
                      <p className="text-sm text-gray-600">{report.artist_name}</p>
                    )}
                  </div>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-2">
                  {report.week_start && report.week_end && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {report.week_start} — {report.week_end}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span>
                      Created {new Date(report.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
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
