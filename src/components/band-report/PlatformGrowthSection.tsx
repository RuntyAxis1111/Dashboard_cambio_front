import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { formatNumberCompact, formatDeltaNum, formatDeltaPct, getDeltaColor } from '../../lib/report-utils'
import { supabase } from '../../lib/supabase'

interface PlatformMetric {
  plataforma: string
  valor: number
  valor_prev: number | null
  delta_num: number | null
  delta_pct: number | null
  orden: number
}

interface PlatformGrowthSectionProps {
  metrics: PlatformMetric[]
  entidadId?: string
  onUpdate?: () => void
}

const PLATFORM_LABELS: Record<string, string> = {
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
  'x': 'X',
  'weverse': 'Weverse',
  'spotify': 'Spotify',
  'total': 'Total',
}

const PLATFORM_LOGOS: Record<string, string> = {
  'instagram': '/assets/instagram.png',
  'tiktok': '/assets/tik-tok (1).png',
  'youtube': '/assets/youtube (1).png',
  'spotify': '/assets/spotify.png',
  'weverse': '/assets/Weverse_logo.png',
}

export function PlatformGrowthSection({ metrics, entidadId, onUpdate }: PlatformGrowthSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMetrics, setEditedMetrics] = useState<PlatformMetric[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    const metricsWithWeverse = JSON.parse(JSON.stringify(metrics))

    const hasWeverse = metricsWithWeverse.some((m: PlatformMetric) => m.plataforma === 'weverse')
    if (!hasWeverse) {
      const maxOrden = Math.max(...metricsWithWeverse.map((m: PlatformMetric) => m.orden), 0)
      metricsWithWeverse.push({
        plataforma: 'weverse',
        valor: 0,
        valor_prev: 0,
        delta_num: 0,
        delta_pct: 0,
        orden: maxOrden + 1
      })
    }

    setEditedMetrics(metricsWithWeverse)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedMetrics([])
  }

  const handleSave = async () => {
    if (!entidadId) return

    setIsSaving(true)
    try {
      const { data: existingMetrics } = await supabase
        .from('reportes_metricas')
        .select('id, plataforma')
        .eq('entidad_id', entidadId)
        .eq('seccion_clave', 'social_growth')
        .eq('metrica_clave', 'seguidores')

      for (const metric of editedMetrics) {
        if (metric.valor > 0 || (metric.valor_prev && metric.valor_prev > 0)) {
          const existingMetric = existingMetrics?.find(m => m.plataforma === metric.plataforma)

          if (existingMetric) {
            const { error } = await supabase
              .from('reportes_metricas')
              .update({
                valor: metric.valor,
                valor_prev: metric.valor_prev,
                delta_num: metric.delta_num,
                delta_pct: metric.delta_pct,
                orden: metric.orden,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingMetric.id)

            if (error) throw error
          } else {
            const { error } = await supabase
              .from('reportes_metricas')
              .insert({
                entidad_id: entidadId,
                seccion_clave: 'social_growth',
                metrica_clave: 'seguidores',
                plataforma: metric.plataforma,
                unidad: 'count',
                valor: metric.valor,
                valor_prev: metric.valor_prev,
                delta_num: metric.delta_num,
                delta_pct: metric.delta_pct,
                orden: metric.orden
              })

            if (error) throw error
          }
        }
      }

      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving platform metrics:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleValueChange = (plataforma: string, field: keyof PlatformMetric, value: string) => {
    setEditedMetrics(prev => prev.map(m => {
      if (m.plataforma === plataforma) {
        const numValue = value === '' ? 0 : parseFloat(value)
        const updated = { ...m, [field]: numValue }

        if (field === 'valor' || field === 'valor_prev') {
          const current = field === 'valor' ? numValue : updated.valor
          const previous = field === 'valor_prev' ? numValue : (updated.valor_prev || 0)

          if (previous > 0) {
            updated.delta_num = current - previous
            updated.delta_pct = ((current - previous) / previous) * 100
          }
        }

        return updated
      }
      return m
    }))
  }

  if (metrics.length === 0) {
    return <p className="text-gray-500">No data for this section yet</p>
  }

  const displayMetrics = isEditing ? editedMetrics : metrics
  let regularMetrics = displayMetrics.filter(m => m.plataforma !== 'total')

  if (!isEditing) {
    regularMetrics = regularMetrics.filter(m => {
      if (m.plataforma === 'weverse') {
        const currentValue = typeof m.valor === 'string' ? parseFloat(m.valor) : m.valor
        const prevValue = m.valor_prev ? (typeof m.valor_prev === 'string' ? parseFloat(m.valor_prev) : m.valor_prev) : 0
        return currentValue > 0 || prevValue > 0
      }
      return true
    })
  }

  const sortedMetrics = [...regularMetrics].sort((a, b) => {
    const deltaA = a.delta_num || 0
    const deltaB = b.delta_num || 0
    return deltaB - deltaA
  })

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      {entidadId && !isEditing && (
        <div className="px-4 py-2 border-b border-gray-300 flex justify-end">
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 print:hidden"
          >
            <Edit2 className="w-4 h-4" />
            Edit Metrics
          </button>
        </div>
      )}

      {isEditing && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-300 flex justify-between items-center">
          <span className="text-sm text-blue-900 font-medium">Editing mode - modify values below</span>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Platform</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Current</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Previous</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Growth</th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map(m => (
              <tr key={m.plataforma} className="border-t border-gray-200">
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {PLATFORM_LOGOS[m.plataforma] && (
                      <img src={PLATFORM_LOGOS[m.plataforma]} alt="" className="w-4 h-4 object-contain" />
                    )}
                    <span>{PLATFORM_LABELS[m.plataforma] || m.plataforma}</span>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black text-right font-medium whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={m.valor}
                      onChange={(e) => handleValueChange(m.plataforma, 'valor', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                      disabled={isSaving}
                    />
                  ) : (
                    formatNumberCompact(m.valor)
                  )}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={m.valor_prev || 0}
                      onChange={(e) => handleValueChange(m.plataforma, 'valor_prev', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                      disabled={isSaving}
                    />
                  ) : (
                    formatNumberCompact(m.valor_prev)
                  )}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap">
                  <span className={getDeltaColor(m.delta_pct)}>
                    {formatDeltaNum(m.delta_num)} ({formatDeltaPct(m.delta_pct)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
