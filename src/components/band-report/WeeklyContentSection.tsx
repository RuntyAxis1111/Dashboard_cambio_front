interface ContentItem {
  texto: string
  imagen_url?: string | null
  contexto?: string | null
  orden: number
}

interface WeeklyContentSectionProps {
  items: ContentItem[]
}

export function WeeklyContentSection({ items }: WeeklyContentSectionProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="space-y-2">
          {item.contexto && (
            <h4 className="text-sm font-semibold text-gray-700">{item.contexto}</h4>
          )}
          <p className="text-sm text-gray-700 leading-relaxed">{item.texto}</p>
          {item.imagen_url && (
            <img
              src={item.imagen_url}
              alt={item.contexto || 'Content image'}
              className="w-full rounded-lg border border-gray-200"
            />
          )}
        </div>
      ))}
    </div>
  )
}
