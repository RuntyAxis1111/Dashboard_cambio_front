import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { TrendingUp, Eye, Radio, FileText, ChevronDown } from 'lucide-react'

interface PRItem {
  posicion: number
  titulo: string | null
  texto: string
  link_url?: string | null
  url?: string | null
  categoria?: string
}

interface MeltwaterData {
  reach: number
  avarage: number
  views: number
  total_menciones: number
  pais_top1: string | null
  pais_top2: string | null
  pais_top3: string | null
  pais_top4: string | null
  pais_top5: string | null
  ciudad_top1: string | null
  ciudad_top2: string | null
  ciudad_top3: string | null
  ciudad_top4: string | null
  ciudad_top5: string | null
}

interface PRPressSectionProps {
  items: PRItem[]
  entidadId: string
}

const countryEmojis: Record<string, string> = {
  'South Korea': '🇰🇷',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'United States': '🇺🇸',
  'Japan': '🇯🇵',
  'Chile': '🇨🇱',
  'Argentina': '🇦🇷',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Philippines': '🇵🇭',
  'Thailand': '🇹🇭',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Taiwan': '🇹🇼',
  'China': '🇨🇳',
  'Vietnam': '🇻🇳',
  'India': '🇮🇳',
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function PRPressSection({ items, entidadId }: PRPressSectionProps) {
  const [meltwaterData, setMeltwaterData] = useState<MeltwaterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllCountries, setShowAllCountries] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)

  useEffect(() => {
    async function fetchMeltwaterData() {
      try {
        const { data, error } = await supabase
          .from('reportes_meltwater_data')
          .select('*')
          .eq('entidad_id', entidadId)
          .maybeSingle()

        if (error) throw error
        setMeltwaterData(data)
      } catch (error) {
        console.error('Error fetching Meltwater data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeltwaterData()
  }, [entidadId])

  const sortedItems = items.length > 0
    ? [...items]
        .filter(item => (item.titulo && item.titulo.trim()) || (item.texto && item.texto.trim()))
        .sort((a, b) => a.posicion - b.posicion)
    : []
  const usPress = sortedItems.filter(item => item.categoria === 'pr_us')
  const krPress = sortedItems.filter(item => item.categoria === 'pr_kr')
  const generalPress = sortedItems.filter(item => !item.categoria || (item.categoria !== 'pr_us' && item.categoria !== 'pr_kr'))

  const allCountries = meltwaterData ? [
    meltwaterData.pais_top1,
    meltwaterData.pais_top2,
    meltwaterData.pais_top3,
    meltwaterData.pais_top4,
    meltwaterData.pais_top5,
  ].filter(Boolean) as string[] : []

  const allCities = meltwaterData ? [
    meltwaterData.ciudad_top1,
    meltwaterData.ciudad_top2,
    meltwaterData.ciudad_top3,
    meltwaterData.ciudad_top4,
    meltwaterData.ciudad_top5,
  ].filter(Boolean) as string[] : []

  const displayedCountries = showAllCountries ? allCountries : allCountries.slice(0, 2)
  const displayedCities = showAllCities ? allCities : allCities.slice(0, 2)

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
      {meltwaterData && !loading && (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Reach</span>
                <Radio className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-xl font-bold text-black">
                {formatNumber(meltwaterData.reach)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Avg. Engagement</span>
                <TrendingUp className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-xl font-bold text-black">
                {formatNumber(meltwaterData.avarage)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Views</span>
                <Eye className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-xl font-bold text-black">
                {formatNumber(meltwaterData.views)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Mentions</span>
                <FileText className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-xl font-bold text-black">
                {meltwaterData.total_menciones}
              </div>
            </div>
          </div>

          {(allCountries.length > 0 || allCities.length > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {allCountries.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowAllCountries(!showAllCountries)}
                  >
                    <span className="text-sm font-semibold text-black">Top Countries</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAllCountries ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {displayedCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-lg">{countryEmojis[country] || '🌍'}</span>
                        <span className="text-sm text-gray-700">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allCities.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowAllCities(!showAllCities)}
                  >
                    <span className="text-sm font-semibold text-black">Top Cities</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAllCities ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {displayedCities.map((city, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-lg">🏙️</span>
                        <span className="text-sm text-gray-700">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {sortedItems.length > 0 && (
        <>
          <h4 className="text-base font-semibold text-black">Most Relevant News</h4>

          <div className="space-y-6">
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
        </>
      )}
    </div>
  )
}
