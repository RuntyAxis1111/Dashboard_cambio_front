import { formatNumberCompact, formatDeltaNum, formatDeltaPct, getDeltaColor, getDeltaBgColor } from '../../lib/report-utils'

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
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Member</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Previous</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Current</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Growth</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              <td className="px-4 py-3 text-sm text-black font-medium">
                {member.participante_nombre}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                {formatNumberCompact(member.valor_prev)}
              </td>
              <td className="px-4 py-3 text-sm text-black text-right font-medium">
                {formatNumberCompact(member.valor)}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={getDeltaColor(member.delta_pct)}>
                  {formatDeltaNum(member.delta_num)} ({formatDeltaPct(member.delta_pct)})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
