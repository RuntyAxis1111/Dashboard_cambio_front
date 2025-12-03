import { useState, useEffect } from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, Send, CheckCircle2, AlertCircle, Loader2, FileText, GitCompare, BarChart3, Users } from 'lucide-react'

interface Entity {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}

type ReportType = 'simple' | 'week-vs-week' | 'month-vs-month' | 'artist-vs-artist'

export function MakeReport() {
  const { user } = useAuth()
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState<ReportType>('simple')
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [compareStartDate, setCompareStartDate] = useState<string>('')
  const [compareEndDate, setCompareEndDate] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    async function loadEntities() {
      try {
        const { data, error } = await supabase
          .from('reportes_entidades')
          .select('id, nombre, slug, imagen_url')
          .eq('activo', true)
          .order('nombre')

        if (error) throw error
        setEntities(data || [])
      } catch (err) {
        console.error('Error loading entities:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEntities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isComparisonReport = reportType === 'week-vs-week' || reportType === 'month-vs-month'

    if (!selectedEntity || !startDate || !endDate) {
      setErrorMessage('Please fill in all fields')
      setSubmitStatus('error')
      return
    }

    if (isComparisonReport && (!compareStartDate || !compareEndDate)) {
      setErrorMessage('Please fill in comparison dates')
      setSubmitStatus('error')
      return
    }

    const entity = entities.find(e => e.id === selectedEntity)
    if (!entity) return

    setSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const payload: any = {
      report_type: reportType,
      entity_id: entity.id,
      entity_name: entity.nombre,
      entity_slug: entity.slug,
      start_date: startDate,
      end_date: endDate,
      requested_by: {
        user_id: user?.id,
        email: user?.email,
        name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
      },
      timestamp: new Date().toISOString()
    }

    if (isComparisonReport) {
      payload.compare_start_date = compareStartDate
      payload.compare_end_date = compareEndDate
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/report-webhook-proxy`

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setSelectedEntity('')
        setStartDate('')
        setEndDate('')
        setCompareStartDate('')
        setCompareEndDate('')
      } else {
        throw new Error(result.error || 'Failed to submit report request')
      }
    } catch (err) {
      console.error('Error submitting report request:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit report request. Please try again.')
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Make Your Report' }
  ]

  const reportTypes = [
    {
      id: 'simple' as ReportType,
      name: 'Simple Report',
      description: 'Standard performance report for a single period',
      icon: FileText,
      available: true
    },
    {
      id: 'week-vs-week' as ReportType,
      name: 'Week vs Week',
      description: 'Compare performance across different weeks',
      icon: GitCompare,
      available: true
    },
    {
      id: 'month-vs-month' as ReportType,
      name: 'Month vs Month',
      description: 'Compare performance across different months',
      icon: BarChart3,
      available: true
    },
    {
      id: 'artist-vs-artist' as ReportType,
      name: 'Artist vs Artist',
      description: 'Compare performance between different artists',
      icon: Users,
      available: false
    }
  ]

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Make Your Report</h1>
          <p className="text-gray-600">
            Select a report type, artist, and date range to generate a custom report
          </p>
        </div>

        {loading ? (
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading artists...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Select Report Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = reportType === type.id
                  const isDisabled = !type.available

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => type.available && setReportType(type.id)}
                      disabled={isDisabled}
                      className={`
                        relative text-left p-4 border-2 rounded-xl transition-all
                        ${isSelected && type.available
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0
                          ${isSelected && type.available ? 'bg-blue-100' : 'bg-gray-100'}
                        `}>
                          <Icon className={`w-5 h-5 ${isSelected && type.available ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-black mb-1">{type.name}</h3>
                          <p className="text-xs text-gray-600">{type.description}</p>
                          {isDisabled && (
                            <span className="inline-block mt-2 text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Report Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="entity" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Artist
                  </label>
                  <select
                    id="entity"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  >
                    <option value="">Choose an artist...</option>
                    {entities.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {reportType === 'week-vs-week' ? 'First Week' : reportType === 'month-vs-month' ? 'First Month' : 'Date Range'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-xs font-medium text-gray-600 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block text-xs font-medium text-gray-600 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {(reportType === 'week-vs-week' || reportType === 'month-vs-month') && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      {reportType === 'week-vs-week' ? 'Second Week' : 'Second Month'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="compareStartDate" className="block text-xs font-medium text-gray-600 mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            id="compareStartDate"
                            value={compareStartDate}
                            onChange={(e) => setCompareStartDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="compareEndDate" className="block text-xs font-medium text-gray-600 mb-2">
                          End Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            id="compareEndDate"
                            value={compareEndDate}
                            onChange={(e) => setCompareEndDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'success' && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Report request submitted successfully!</p>
                      <p className="text-sm text-green-700 mt-1">Your report is being generated and will be available soon.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Failed to submit report request</p>
                      <p className="text-sm text-red-700 mt-1">{errorMessage || 'Please try again.'}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !selectedEntity || !startDate || !endDate}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
