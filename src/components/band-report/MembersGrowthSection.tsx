import { formatNumber, formatDelta, getDeltaColor, getDeltaBgColor } from '../../lib/report-utils'

interface MemberMetric {
  participante_nombre: string
  valor: number
  valor_prev: number | null
  delta_num: number | null
  delta_pct: number | null
}

interface MembersGrowthSectionProps {
  members: MemberMetric[]
}

export function MembersGrowthSection({ members }: MembersGrowthSectionProps) {
  if (members.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Member</th>
              <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Previous</th>
              <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Current</th>
              <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Growth</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={idx} className="border-b border-gray-200 last:border-0">
                <td className="py-2 px-3 text-sm text-gray-700 font-medium">{member.participante_nombre}</td>
                <td className="py-2 px-3 text-sm text-right text-gray-600">{formatNumber(member.valor_prev)}</td>
                <td className="py-2 px-3 text-sm text-right font-semibold text-black">{formatNumber(member.valor)}</td>
                <td className="py-2 px-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-700">
                      {member.delta_num != null ? `+${formatNumber(member.delta_num)}` : 'N/A'}
                    </span>
                    {member.delta_pct != null && (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDeltaBgColor(member.delta_pct)} ${getDeltaColor(member.delta_pct)}`}>
                        {formatDelta(member.delta_pct)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
