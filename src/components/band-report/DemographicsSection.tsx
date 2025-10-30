import { useState } from 'react'

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

function PieChart({ data, colors }: { data: BucketData[], colors: string[] }) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  const total = data.reduce((sum, item) => sum + item.valor_num, 0)
  let currentAngle = -90

  const slices = data.map((item, idx) => {
    const percentage = item.valor_num
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    return {
      ...item,
      color: colors[idx % colors.length],
      startAngle,
      endAngle,
      percentage
    }
  })

  const size = 280
  const center = size / 2
  const radius = size / 2 - 20

  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    }
  }

  const createArc = (startAngle: number, endAngle: number, outerRadius: number) => {
    const start = polarToCartesian(startAngle, outerRadius)
    const end = polarToCartesian(endAngle, outerRadius)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      'Z'
    ].join(' ')
  }

  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="relative w-full max-w-[280px] aspect-square">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="transform transition-transform duration-300">
          {slices.map((slice, idx) => {
            const isHovered = hoveredSlice === idx
            const sliceRadius = isHovered ? radius + 8 : radius

            return (
              <g key={idx}>
                <path
                  d={createArc(slice.startAngle, slice.endAngle, sliceRadius)}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="3"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                    opacity: hoveredSlice !== null && !isHovered ? 0.6 : 1
                  }}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </g>
            )
          })}
          <circle
            cx={center}
            cy={center}
            r={radius * 0.5}
            fill="white"
            className="pointer-events-none"
          />
        </svg>

        {hoveredSlice !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 text-center">
              <div className="text-sm font-medium text-gray-700">{slices[hoveredSlice].bucket}</div>
              <div className="text-2xl font-bold text-black">{slices[hoveredSlice].percentage.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getAgeRangeStart(bucket: string): number {
  if (bucket === '65+') return 65
  const match = bucket.match(/^(\d+)/)
  return match ? parseInt(match[1]) : 0
}

export function DemographicsSection({ buckets }: DemographicsSectionProps) {
  if (buckets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No demographics data available yet</p>
      </div>
    )
  }

  const genderData = buckets.filter(b => b.dimension === 'gender').sort((a, b) => b.valor_num - a.valor_num)
  const ageData = buckets.filter(b => b.dimension === 'age').sort((a, b) => getAgeRangeStart(a.bucket) - getAgeRangeStart(b.bucket))

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

          <PieChart
            data={genderData.map(item => ({ ...item, bucket: item.bucket }))}
            colors={genderData.map(item => GENDER_COLORS[item.bucket] || '#9CA3AF')}
          />
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

          <PieChart data={ageData} colors={AGE_COLORS} />
        </div>
      )}
    </div>
  )
}
