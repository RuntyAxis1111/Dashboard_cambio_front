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
    ...ageRanges.map(age => {
      const female = femaleData.find(d => d.age_range === age)?.followers_count || 0
      const male = maleData.find(d => d.age_range === age)?.followers_count || 0
      return Math.max(getPercentage(female), getPercentage(male))
    })
  )

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-black text-lg">Age & Gender Distribution</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
            <span className="text-sm text-gray-600">Female</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-sm text-gray-600">Male</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {ageRanges.map((age) => {
          const femaleItem = femaleData.find(d => d.age_range === age)
          const maleItem = maleData.find(d => d.age_range === age)

          const femaleCount = femaleItem?.followers_count || 0
          const maleCount = maleItem?.followers_count || 0

          const femalePercentage = getPercentage(femaleCount)
          const malePercentage = getPercentage(maleCount)

          const femaleWidth = maxPercentage > 0 ? (femalePercentage / maxPercentage) * 100 : 0
          const maleWidth = maxPercentage > 0 ? (malePercentage / maxPercentage) * 100 : 0

          return (
            <div key={age} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-20">{age}</span>
                <div className="flex-1 ml-4">
                  <div className="space-y-1.5">
                    <div
                      className="relative group"
                      onMouseEnter={() => setHoveredBar(`${age}-female`)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div
                        className="h-7 rounded-md transition-all duration-500 ease-out relative"
                        style={{
                          width: `${femaleWidth}%`,
                          backgroundColor: '#EC4899',
                          opacity: hoveredBar && hoveredBar !== `${age}-female` ? 0.4 : 1
                        }}
                      >
                        {hoveredBar === `${age}-female` && femalePercentage > 0 && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-semibold">
                            {femalePercentage.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      {!hoveredBar && femalePercentage >= 5 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-medium">
                          {femalePercentage.toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div
                      className="relative group"
                      onMouseEnter={() => setHoveredBar(`${age}-male`)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div
                        className="h-7 rounded-md transition-all duration-500 ease-out relative"
                        style={{
                          width: `${maleWidth}%`,
                          backgroundColor: '#3B82F6',
                          opacity: hoveredBar && hoveredBar !== `${age}-male` ? 0.4 : 1
                        }}
                      >
                        {hoveredBar === `${age}-male` && malePercentage > 0 && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-semibold">
                            {malePercentage.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      {!hoveredBar && malePercentage >= 5 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-medium">
                          {malePercentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#EC4899]">
              {((femaleData.reduce((sum, d) => sum + d.followers_count, 0) / totalFollowers) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Female Audience</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#3B82F6]">
              {((maleData.reduce((sum, d) => sum + d.followers_count, 0) / totalFollowers) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Male Audience</div>
          </div>
        </div>
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
