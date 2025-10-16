interface HighlightItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
}

interface HighlightsSectionProps {
  items: HighlightItem[]
}

export function HighlightsSection({ items }: HighlightsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No data available yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <ul className="space-y-3">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-gray-600 font-medium">•</span>
            <div>
              {item.titulo && (
                <>
                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-black hover:text-blue-600"
                    >
                      {item.titulo}
                    </a>
                  ) : (
                    <span className="font-semibold text-black">{item.titulo}</span>
                  )}
                  <span>: </span>
                </>
              )}
              <span className="text-gray-700">{item.texto}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
