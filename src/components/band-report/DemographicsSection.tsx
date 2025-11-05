import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface BucketData {
  dimension: string
  bucket: string
  valor_num: number
}

interface DemographicsData {
  age_range: string
  gender: string
  followers_count: number
}

interface DemographicsSectionProps {
  buckets: BucketData[]
  entidadId: string
  semanaInicio: string
  semanaFin: string
}

const GEOGRAPHY_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#14B8A6',
  '#F97316',
  '#A855F7'
]

const AGE_ORDER = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']

function GroupedBarChart({ data }: { data: DemographicsData[] }) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const femaleData = data.filter(d => d.gender === 'female')
  const maleData = data.filter(d => d.gender === 'male')

  const totalFollowers = data.reduce((sum, d) => sum + d.followers_count, 0)

  const ageRanges = AGE_ORDER.filter(age =>
    data.some(d => d.age_range === age)
  )

  const getPercentage = (count: number) => {
    return totalFollowers > 0 ? (count / totalFollowers) * 100 : 0
  }

  const maxPercentage = Math.max(
    ...ageRanges.flatMap(age => {
      const female = femaleData.find(d => d.age_range === age)?.followers_count || 0
      const male = maleData.find(d => d.age_range === age)?.followers_count || 0
      return [getPercentage(female), getPercentage(male)]
    })
  )

  const chartHeight = 300
  const barWidth = 40

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h4 className="font-semibold text-black text-lg">Age & Gender Distribution</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EC4899]"></div>
            <span className="text-sm text-gray-600">Female</span>
            <span className="text-sm font-semibold text-gray-900">
              {((femaleData.reduce((sum, d) => sum + d.followers_count, 0) / totalFollowers) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#1E40AF]"></div>
            <span className="text-sm text-gray-600">Male</span>
            <span className="text-sm font-semibold text-gray-900">
              {((maleData.reduce((sum, d) => sum + d.followers_count, 0) / totalFollowers) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
        <div className="absolute left-0 right-0 flex items-end justify-around" style={{ height: `${chartHeight}px` }}>
          {ageRanges.map((age) => {
            const femaleItem = femaleData.find(d => d.age_range === age)
            const maleItem = maleData.find(d => d.age_range === age)

            const femaleCount = femaleItem?.followers_count || 0
            const maleCount = maleItem?.followers_count || 0

            const femalePercentage = getPercentage(femaleCount)
            const malePercentage = getPercentage(maleCount)

            const femaleHeight = maxPercentage > 0 ? (femalePercentage / maxPercentage) * chartHeight : 0
            const maleHeight = maxPercentage > 0 ? (malePercentage / maxPercentage) * chartHeight : 0

            return (
              <div key={age} className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-1.5" style={{ height: `${chartHeight}px` }}>
                  <div
                    className="relative group cursor-pointer transition-all duration-300"
                    style={{
                      width: `${barWidth}px`,
                      height: `${femaleHeight}px`,
                      backgroundColor: '#EC4899',
                      borderRadius: '4px 4px 0 0',
                      opacity: hoveredBar && hoveredBar !== `${age}-female` ? 0.3 : 1,
                      transform: hoveredBar === `${age}-female` ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                    onMouseEnter={() => setHoveredBar(`${age}-female`)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === `${age}-female` && femalePercentage > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {femalePercentage.toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div
                    className="relative group cursor-pointer transition-all duration-300"
                    style={{
                      width: `${barWidth}px`,
                      height: `${maleHeight}px`,
                      backgroundColor: '#1E40AF',
                      borderRadius: '4px 4px 0 0',
                      opacity: hoveredBar && hoveredBar !== `${age}-male` ? 0.3 : 1,
                      transform: hoveredBar === `${age}-male` ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                    onMouseEnter={() => setHoveredBar(`${age}-male`)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === `${age}-male` && malePercentage > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {malePercentage.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm font-medium text-gray-700 mt-2">{age}</div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" style={{ bottom: '40px' }}></div>
      </div>
    </div>
  )
}

function GeographyCard({ title, data }: { title: string, data: BucketData[] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const displayData = isExpanded ? data : data.slice(0, 3)
  const hasMore = data.length > 3

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6">
      <h4 className="font-semibold text-black mb-4">{title}</h4>

      <div className="space-y-2.5">
        {displayData.map((item, idx) => {
          const color = GEOGRAPHY_COLORS[idx % GEOGRAPHY_COLORS.length]

          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs sm:text-sm text-gray-700">{item.bucket}</span>
                <span className="text-xs sm:text-sm font-semibold text-black">{item.valor_num.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${item.valor_num}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 rounded-lg hover:bg-gray-50"
        >
          <span>{isExpanded ? 'Show less' : `Show ${data.length - 3} more`}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>
  )
}

export function DemographicsSection({ buckets, entidadId, semanaInicio, semanaFin }: DemographicsSectionProps) {
  const [demographicsData, setDemographicsData] = useState<DemographicsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDemographics() {
      try {
        const { data, error } = await supabase
          .from('reportes_demographics')
          .select('age_range, gender, followers_count')
          .eq('entidad_id', entidadId)
          .eq('semana_inicio', semanaInicio)
          .eq('semana_fin', semanaFin)

        if (error) throw error

        setDemographicsData(data || [])
      } catch (error) {
        console.error('Error fetching demographics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDemographics()
  }, [entidadId, semanaInicio, semanaFin])

  const countryData = buckets
    .filter(b => b.dimension === 'country')
    .sort((a, b) => b.valor_num - a.valor_num)
    .slice(0, 10)

  const cityData = buckets
    .filter(b => b.dimension === 'city')
    .sort((a, b) => b.valor_num - a.valor_num)
    .slice(0, 10)

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">Loading demographics data...</p>
      </div>
    )
  }

  if (demographicsData.length === 0 && buckets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No demographics data available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {demographicsData.length > 0 && (
        <GroupedBarChart data={demographicsData} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {countryData.length > 0 && (
          <GeographyCard
            title="Top Countries"
            data={countryData}
          />
        )}

        {cityData.length > 0 && (
          <GeographyCard
            title="Top Cities"
            data={cityData}
          />
        )}
      </div>
    </div>
  )
}
