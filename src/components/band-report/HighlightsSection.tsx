interface HighlightItem {
  titulo: string
  texto: string
  posicion: number
}

interface HighlightsSectionProps {
  items: HighlightItem[]
}

export function HighlightsSection({ items }: HighlightsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No highlights data available yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-gray-600 font-medium">•</span>
            <div>
              {item.titulo && <span className="font-semibold text-black">{item.titulo}: </span>}
              <span className="text-gray-700">{item.texto}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
