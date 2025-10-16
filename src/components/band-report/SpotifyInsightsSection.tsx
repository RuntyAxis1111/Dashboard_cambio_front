interface SpotifyInsight {
  posicion: number
  titulo: string | null
  texto: string
  valor?: string | number | null
}

interface SpotifyInsightsSectionProps {
  items: SpotifyInsight[]
}

export function SpotifyInsightsSection({ items }: SpotifyInsightsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <ul className="space-y-2">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>{item.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
