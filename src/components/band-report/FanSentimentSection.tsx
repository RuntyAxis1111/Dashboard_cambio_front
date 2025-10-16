interface SentimentItem {
  titulo: string
  texto: string
  por_que_importa: string | null
}

interface FanSentimentSectionProps {
  items: SentimentItem[]
}

export function FanSentimentSection({ items }: FanSentimentSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No fan sentiment data available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white border border-gray-300 rounded-2xl p-6">
          {item.titulo && (
            <h4 className="font-semibold text-black mb-2">{item.titulo}</h4>
          )}
          <p className="text-gray-700 mb-3">{item.texto}</p>
          {item.por_que_importa && (
            <div className="bg-gray-50 border-l-4 border-gray-400 pl-4 py-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Why it matters:</span> {item.por_que_importa}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
