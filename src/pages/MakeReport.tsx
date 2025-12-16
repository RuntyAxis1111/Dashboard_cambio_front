import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, Send, AlertCircle, Loader2, FileText, X, ExternalLink, Info } from 'lucide-react'

interface Entity {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}

function calculateDaysDiff(start: string, end: string): number {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days - 1)
  return date.toISOString().split('T')[0]
}

function formatDateRange(start: string, end: string): string {
  if (!start || !end) return ''
  const startDate = new Date(start)
  const endDate = new Date(end)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`
}

export function MakeReport() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [firstStartDate, setFirstStartDate] = useState<string>('')
  const [firstEndDate, setFirstEndDate] = useState<string>('')
  const [secondStartDate, setSecondStartDate] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const firstPeriodDays = useMemo(() => {
    return calculateDaysDiff(firstStartDate, firstEndDate)
  }, [firstStartDate, firstEndDate])

  const secondEndDate = useMemo(() => {
    if (!secondStartDate || firstPeriodDays <= 0) return ''
    return addDays(secondStartDate, firstPeriodDays)
  }, [secondStartDate, firstPeriodDays])

  const isFirstPeriodComplete = firstStartDate && firstEndDate && firstPeriodDays > 0

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

    if (!selectedEntity || !firstStartDate || !firstEndDate || !secondStartDate || !secondEndDate) {
      setErrorMessage('Please fill in all fields')
      setSubmitStatus('error')
      return
    }

    const entity = entities.find(e => e.id === selectedEntity)
    if (!entity) return

    setSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const payload = {
      report_type: 'custom',
      entity_id: entity.id,
      entity_name: entity.nombre,
      entity_slug: entity.slug,
      start_date: firstStartDate,
      end_date: firstEndDate,
      compare_start_date: secondStartDate,
      compare_end_date: secondEndDate,
      requested_by: {
        user_id: user?.id,
        email: user?.email,
        name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
      },
      timestamp: new Date().toISOString()
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error('Configuration error: VITE_SUPABASE_URL is not defined. Please refresh the page.')
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

      let result
      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Invalid response from server')
      }

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setShowSuccessModal(true)
        setSelectedEntity('')
        setFirstStartDate('')
        setFirstEndDate('')
        setSecondStartDate('')
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
    { label: 'Report Builder' }
  ]

  const isFormValid = selectedEntity && firstStartDate && firstEndDate && secondStartDate && secondEndDate

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Report Builder</h1>
          <p className="text-gray-600">
            Create your report freely by comparing two time periods
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
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">Create Your Report Freely</h2>
                  <p className="text-sm text-gray-600">Compare two time periods of equal duration for any artist</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Report Details</h2>
              <div className="space-y-6">
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

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">First Period (Previous)</h3>
                    {firstPeriodDays > 0 && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {firstPeriodDays} day{firstPeriodDays !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstStartDate" className="block text-xs font-medium text-gray-600 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="firstStartDate"
                          value={firstStartDate}
                          onChange={(e) => setFirstStartDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="firstEndDate" className="block text-xs font-medium text-gray-600 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="firstEndDate"
                          value={firstEndDate}
                          onChange={(e) => setFirstEndDate(e.target.value)}
                          min={firstStartDate}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={submitting || !firstStartDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Second Period (Current)</h3>
                    {secondEndDate && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {firstPeriodDays} day{firstPeriodDays !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {!isFirstPeriodComplete ? (
                    <div className="flex items-center gap-2 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                      <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        First, select the first period dates to define the comparison duration.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          Select a start date. The end date will be automatically set to match the {firstPeriodDays}-day duration.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="secondStartDate" className="block text-xs font-medium text-gray-600 mb-2">
                            Start Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="date"
                              id="secondStartDate"
                              value={secondStartDate}
                              onChange={(e) => setSecondStartDate(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                              disabled={submitting}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="secondEndDate" className="block text-xs font-medium text-gray-600 mb-2">
                            End Date (Auto-calculated)
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="date"
                              id="secondEndDate"
                              value={secondEndDate}
                              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 cursor-not-allowed"
                              disabled
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isFormValid && (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">First Period</p>
                        <p className="font-medium text-gray-900">{formatDateRange(firstStartDate, firstEndDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Second Period</p>
                        <p className="font-medium text-gray-900">{formatDateRange(secondStartDate, secondEndDate)}</p>
                      </div>
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
                  disabled={submitting || !isFormValid}
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

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Report Submitted</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-700 text-center">
                Your report will be ready in <span className="font-semibold">2-4 minutes</span> in the "My Reports" section.
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                We recommend closing this tab and coming back in a few moments while it loads.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/reports/my-reports')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Go to My Reports
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
