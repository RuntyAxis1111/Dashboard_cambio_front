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

          <div className="mt-6 sm:mt-8 h-48 sm:h-64 flex items-end justify-around gap-2 sm:gap-4 px-2">
            {genderData.map((item, idx) => {
              const color = GENDER_COLORS[item.bucket] || '#9CA3AF'

              return (
                <div key={idx} className="flex-1 flex flex-col items-center max-w-[120px]">
                  <div className="text-xs sm:text-sm font-bold text-black mb-1 sm:mb-2">
                    {item.valor_num.toFixed(1)}%
                  </div>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 ease-out shadow-md"
                    style={{
                      height: `${item.valor_num}%`,
                      backgroundColor: color,
                      minHeight: '24px'
                    }}
                  />
                  <div className="text-[10px] sm:text-xs text-gray-600 mt-2 text-center capitalize font-medium leading-tight">
                    {item.bucket}
                  </div>
                </div>
              )
            })}
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

          <div className="mt-6 sm:mt-8 h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
            {ageData.map((item, idx) => {
              const color = AGE_COLORS[idx % AGE_COLORS.length]

              return (
                <div key={idx} className="flex-1 flex flex-col items-center min-w-0">
                  <div className="text-[10px] sm:text-xs font-bold text-black mb-1 sm:mb-2 whitespace-nowrap">
                    {item.valor_num.toFixed(1)}%
                  </div>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 ease-out shadow-md"
                    style={{
                      height: `${item.valor_num}%`,
                      backgroundColor: color,
                      minHeight: '16px'
                    }}
                  />
                  <div className="text-[9px] sm:text-[10px] text-gray-600 mt-1.5 sm:mt-2 text-center font-medium leading-tight break-words w-full px-0.5">
                    {item.bucket}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
