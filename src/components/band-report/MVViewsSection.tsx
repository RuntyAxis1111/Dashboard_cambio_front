import { formatNumberCompact } from '../../lib/report-utils'

interface MVItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
}

interface MVViewsSectionProps {
  items: MVItem[]
}

export function MVViewsSection({ items }: MVViewsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data available yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <ul className="space-y-2">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="flex items-start text-sm">
            <span className="mr-2 text-gray-500">•</span>
            <div className="flex-1">
              {item.titulo && (
                <div className="font-medium text-black mb-1">
                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {item.titulo}
                    </a>
                  ) : (
                    item.titulo
                  )}
                </div>
              )}
              <div className="text-gray-700">{item.texto}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
