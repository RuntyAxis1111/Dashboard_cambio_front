interface SpotifyInsight {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
}

interface SpotifyInsightsSectionProps {
  items: SpotifyInsight[]
}

export function SpotifyInsightsSection({ items }: SpotifyInsightsSectionProps) {
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
      <div className="flex items-center gap-2 mb-4">
        <img src="/assets/spotify.png" alt="Spotify" className="w-5 h-5 object-contain" />
        <h4 className="font-semibold text-black">Spotify Insights</h4>
      </div>
      <ul className="space-y-2">
        {sortedItems.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
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
