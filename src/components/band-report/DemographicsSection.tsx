interface BucketData {
  dimension: string
  bucket: string
  valor_num: number
}

interface DemographicsSectionProps {
  buckets: BucketData[]
}

const GENDER_COLORS: Record<string, string> = {
  'Female': '#EC4899',
  'Male': '#3B82F6',
  'Not Specified': '#9CA3AF',
  'Not specified': '#9CA3AF'
}

const AGE_COLORS = [
  '#8B5CF6',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#6366F1'
]

export function DemographicsSection({ buckets }: DemographicsSectionProps) {
  if (buckets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No demographics data available yet</p>
      </div>
    )
  }

  const genderData = buckets.filter(b => b.dimension === 'gender').sort((a, b) => b.valor_num - a.valor_num)
  const ageData = buckets.filter(b => b.dimension === 'age').sort((a, b) => b.valor_num - a.valor_num)

  const maxGenderValue = Math.max(...genderData.map(d => d.valor_num), 1)
  const maxAgeValue = Math.max(...ageData.map(d => d.valor_num), 1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {genderData.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6">
          <h4 className="font-semibold text-black mb-4 sm:mb-6">Gender Distribution</h4>

          <div className="space-y-3 sm:space-y-4">
            {genderData.map((item, idx) => {
              const color = GENDER_COLORS[item.bucket] || '#9CA3AF'

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm text-gray-700 capitalize">{item.bucket}</span>
                    <span className="text-xs sm:text-sm font-semibold text-black">{item.valor_num.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
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

          <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4" style={{ height: '280px' }}>
            <div className="h-full flex items-end justify-around gap-4 sm:gap-8">
              {genderData.map((item, idx) => {
                const color = GENDER_COLORS[item.bucket] || '#9CA3AF'
                const heightPx = (item.valor_num / maxGenderValue) * 200

                return (
                  <div key={idx} className="flex flex-col items-center gap-2" style={{ width: '100px' }}>
                    <div className="text-sm font-bold text-black">
                      {item.valor_num.toFixed(1)}%
                    </div>
                    <div
                      className="w-full rounded-t-xl transition-all duration-700 ease-out shadow-lg relative"
                      style={{
                        height: `${heightPx}px`,
                        backgroundColor: color
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-xl" />
                    </div>
                    <div className="text-xs text-gray-700 font-semibold mt-1 capitalize">
                      {item.bucket}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {ageData.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6">
          <h4 className="font-semibold text-black mb-4 sm:mb-6">Age Distribution</h4>

          <div className="space-y-2.5 sm:space-y-3">
            {ageData.map((item, idx) => {
              const color = AGE_COLORS[idx % AGE_COLORS.length]

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

          <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 overflow-x-auto" style={{ height: '280px' }}>
            <div className="h-full flex items-end justify-center gap-2 sm:gap-3 min-w-max px-2">
              {ageData.map((item, idx) => {
                const color = AGE_COLORS[idx % AGE_COLORS.length]
                const heightPx = (item.valor_num / maxAgeValue) * 200

                return (
                  <div key={idx} className="flex flex-col items-center gap-2" style={{ width: '70px' }}>
                    <div className="text-xs font-bold text-black">
                      {item.valor_num.toFixed(1)}%
                    </div>
                    <div
                      className="w-full rounded-t-xl transition-all duration-700 ease-out shadow-lg relative"
                      style={{
                        height: `${heightPx}px`,
                        backgroundColor: color
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-xl" />
                    </div>
                    <div className="text-[10px] text-gray-700 font-semibold mt-1 text-center leading-tight">
                      {item.bucket}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
