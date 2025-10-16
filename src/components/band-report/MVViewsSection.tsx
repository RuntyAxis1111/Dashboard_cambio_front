import { formatNumberCompact } from '../../lib/report-utils'

interface MVItem {
  texto: string
  titulo?: string | null
  valor?: number | null
  posicion: number
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

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <ul className="space-y-2">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-700">
            <span className="mr-2 text-gray-500">•</span>
            <span className="flex-1">{item.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
