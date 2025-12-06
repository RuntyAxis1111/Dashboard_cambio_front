import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Breadcrumb } from '../components/Breadcrumb'
import { Loader2, ChevronLeft } from 'lucide-react'

interface Report {
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

export function MyReportDetail() {
  const { id } = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReport() {
      try {
        if (!id) {
          setError('No report ID provided')
          setLoading(false)
          return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('my_reports')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Error loading report:', fetchError)
          setError('Failed to load report')
        } else if (!data) {
          setError('Report not found')
        } else {
          setReport(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [id])

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'My Reports', href: '/my-reports' },
    { label: report?.title || 'Report Detail' }
  ]

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-black mb-2">
              {error || 'Report not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The report you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link
              to="/my-reports"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to My Reports
            </Link>
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
          <Link
            to="/my-reports"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to My Reports
          </Link>
          <h1 className="text-3xl font-bold text-black">{report.title}</h1>
          {report.artist_name && (
            <p className="text-gray-600 mt-2">{report.artist_name}</p>
          )}
          {report.week_start && report.week_end && (
            <p className="text-sm text-gray-500 mt-1">
              {report.week_start} — {report.week_end}
            </p>
          )}
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-8"
          dangerouslySetInnerHTML={{ __html: report.html_content }}
        />
      </div>
    </div>
  )
}
