import { formatNumber } from '../../lib/report-utils'

interface BucketData {
  bucket: string
  valor_num: number
  posicion: number
}

interface TopCountriesSectionProps {
  buckets: BucketData[]
}

export function TopCountriesSection({ buckets }: TopCountriesSectionProps) {
  if (buckets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No top countries data available yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">#</th>
              <th className="text-left py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">Country</th>
              <th className="text-right py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">Listeners</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200 last:border-0">
                <td className="py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{item.posicion}</td>
                <td className="py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">{item.bucket}</td>
                <td className="py-2 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm text-right font-semibold text-black whitespace-nowrap">
                  {formatNumber(item.valor_num)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
