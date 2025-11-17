import { useState, useEffect } from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import { supabase } from '../lib/supabase'
import { Calendar, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface Entity {
  id: string
  nombre: string
  slug: string
  imagen_url: string | null
}

export function MakeReport() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
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

    if (!selectedEntity || !startDate || !endDate) {
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
      entity_id: entity.id,
      entity_name: entity.nombre,
      entity_slug: entity.slug,
      start_date: startDate,
      end_date: endDate,
      timestamp: new Date().toISOString()
    }

    try {
      const testWebhook = 'https://runtyaxis.app.n8n.cloud/webhook-test/1461e877-1770-4fd8-a9f0-0321161c51a1'
      const prodWebhook = 'https://runtyaxis.app.n8n.cloud/webhook/1461e877-1770-4fd8-a9f0-0321161c51a1'

      const [testResponse, prodResponse] = await Promise.all([
        fetch(testWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        fetch(prodWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      ])

      if (testResponse.ok && prodResponse.ok) {
        setSubmitStatus('success')
        setSelectedEntity('')
        setStartDate('')
        setEndDate('')
      } else {
        throw new Error('Webhook request failed')
      }
    } catch (err) {
      console.error('Error submitting report request:', err)
      setErrorMessage('Failed to submit report request. Please try again.')
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Make Your Report' }
  ]

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Make Your Report</h1>
          <p className="text-gray-600">
            Select an artist and date range to generate a custom report
          </p>
        </div>

        {loading ? (
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading artists...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-2xl p-8">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
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
        )}
      </div>
    </div>
  )
}
