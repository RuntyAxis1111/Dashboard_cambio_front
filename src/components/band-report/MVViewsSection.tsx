import { formatNumberCompact } from '../../lib/report-utils'

interface MVItem {
  texto: string
  valor?: number | null
  orden: number
}

interface MVViewsSectionProps {
  items: MVItem[]
}

export function MVViewsSection({ items }: MVViewsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No MV data available yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.orden - b.orden)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-3">
      {sortedItems.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
          <div className="text-sm text-gray-700 font-medium">
            {item.texto}
          </div>
          {item.valor != null && (
            <div className="text-sm text-black font-semibold">
              {formatNumberCompact(item.valor)} {item.texto.toLowerCase().includes('stream') ? 'streams' : 'views'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
