interface PRItem {
  texto: string
  url?: string | null
  categoria: string
  orden: number
}

interface PRPressSectionProps {
  items: PRItem[]
}

export function PRPressSection({ items }: PRPressSectionProps) {
  if (items.length === 0) return null

  const usPress = items.filter(item => item.categoria === 'pr_us')
  const krPress = items.filter(item => item.categoria === 'pr_kr')

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
      {usPress.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">US Press</h4>
          <ul className="space-y-2">
            {usPress.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="text-gray-400 mr-2">•</span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.texto}
                  </a>
                ) : (
                  item.texto
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {krPress.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">KR Press</h4>
          <ul className="space-y-2">
            {krPress.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="text-gray-400 mr-2">•</span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.texto}
                  </a>
                ) : (
                  item.texto
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
