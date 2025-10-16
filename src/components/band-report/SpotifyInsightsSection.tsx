interface SpotifyInsight {
  texto: string
  valor?: string | number | null
  orden: number
}

interface SpotifyInsightsSectionProps {
  insights: SpotifyInsight[]
}

export function SpotifyInsightsSection({ insights }: SpotifyInsightsSectionProps) {
  if (insights.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <ul className="space-y-2">
        {insights.map((insight, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>
              {insight.texto}
              {insight.valor && <strong className="ml-1">{insight.valor}</strong>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
