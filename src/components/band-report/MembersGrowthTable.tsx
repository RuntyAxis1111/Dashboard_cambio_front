import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface MemberGrowth {
  id: string;
  nombre: string;
  instagram_followers: number;
  instagram_growth: number;
  instagram_growth_pct: number;
  orden: number;
}

interface MembersGrowthTableProps {
  entityId: string;
}

export function MembersGrowthTable({ entityId }: MembersGrowthTableProps) {
  const [members, setMembers] = useState<MemberGrowth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('reportes_miembros_growth')
          .select('*')
          .eq('entidad_id', entityId)
          .eq('activo', true)
          .order('orden');

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error('Error fetching members growth:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [entityId]);

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-8 text-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (members.length === 0) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Member</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Current</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Past</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Growth</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-gray-200">
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black font-medium whitespace-nowrap">
                  {member.nombre}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black text-right font-medium whitespace-nowrap">
                  {formatNumber(member.instagram_followers)}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">
                  N/A
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap">
                  <span className="text-gray-500">
                    N/A
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
