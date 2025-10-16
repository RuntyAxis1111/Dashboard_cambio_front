interface BucketData {
  dimension: string
  bucket: string
  valor_num: number
}

interface DemographicsSectionProps {
  buckets: BucketData[]
}

export function DemographicsSection({ buckets }: DemographicsSectionProps) {
  if (buckets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No demographics data available yet</p>
      </div>
    )
  }

  const genderData = buckets.filter(b => b.dimension === 'gender')
  const ageData = buckets.filter(b => b.dimension === 'age')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {genderData.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h4 className="font-semibold text-black mb-4">Gender Distribution</h4>
          <div className="space-y-3">
            {genderData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{item.bucket}</span>
                <span className="font-semibold text-black">{item.valor_num.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ageData.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h4 className="font-semibold text-black mb-4">Age Distribution</h4>
          <div className="grid grid-cols-2 gap-3">
            {ageData.map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">{item.bucket}</div>
                <div className="text-lg font-semibold text-black">{item.valor_num.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
