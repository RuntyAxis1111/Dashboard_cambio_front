interface PRItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
  url?: string | null
  categoria?: string
}

interface PRPressSectionProps {
  items: PRItem[]
}

export function PRPressSection({ items }: PRPressSectionProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center">No data for this section yet</p>
      </div>
    )
  }

  const sortedItems = [...items].sort((a, b) => a.posicion - b.posicion)
  const usPress = sortedItems.filter(item => item.categoria === 'pr_us')
  const krPress = sortedItems.filter(item => item.categoria === 'pr_kr')
  const generalPress = sortedItems.filter(item => !item.categoria || (item.categoria !== 'pr_us' && item.categoria !== 'pr_kr'))

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
      {generalPress.length > 0 && (
        <ul className="space-y-3">
          {generalPress.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm">
              <span className="mr-2 text-gray-500">•</span>
              <div className="flex-1">
                {item.titulo && (
                  <div className="font-medium text-black mb-1">
                    {(item.link_url || item.url) ? (
                      <a
                        href={item.link_url || item.url || ''}
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
      )}

      {usPress.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">US Press</h4>
          <ul className="space-y-2">
            {usPress.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <div className="flex-1">
                  {item.titulo && (
                    <div className="font-medium text-black mb-1">
                      {(item.link_url || item.url) ? (
                        <a
                          href={item.link_url || item.url || ''}
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
      )}

      {krPress.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">KR Press</h4>
          <ul className="space-y-2">
            {krPress.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <div className="flex-1">
                  {item.titulo && (
                    <div className="font-medium text-black mb-1">
                      {(item.link_url || item.url) ? (
                        <a
                          href={item.link_url || item.url || ''}
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
      )}
    </div>
  )
}
