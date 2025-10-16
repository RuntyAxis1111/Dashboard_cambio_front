interface ContentItem {
  posicion: number
  plataforma: string
  titulo: string | null
  texto: string
  imagen_url?: string | null
}

interface WeeklyContentSectionProps {
  items: ContentItem[]
}

const PLATFORM_LABELS: Record<string, string> = {
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
}

export function WeeklyContentSection({ items }: WeeklyContentSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.plataforma !== b.plataforma) {
      return a.plataforma.localeCompare(b.plataforma)
    }
    return a.posicion - b.posicion
  })

  const groupedByPlatform = sortedItems.reduce((acc, item) => {
    if (!acc[item.plataforma]) {
      acc[item.plataforma] = []
    }
    acc[item.plataforma].push(item)
    return acc
  }, {} as Record<string, ContentItem[]>)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
      {Object.entries(groupedByPlatform).map(([platform, platformItems]) => (
        <div key={platform}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {PLATFORM_LABELS[platform] || platform}
          </h4>
          <ul className="space-y-3">
            {platformItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <div className="flex-1">
                  {item.titulo && (
                    <div className="font-medium text-black mb-1">{item.titulo}</div>
                  )}
                  <div className="text-gray-700">{item.texto}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
