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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Members Instagram Growth</h3>
        <div className="text-gray-500">Loading...</div>
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
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Members Instagram Growth</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Member</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Followers</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Growth</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {member.nombre}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {formatNumber(member.instagram_followers)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${
                      member.instagram_growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {member.instagram_growth >= 0 ? '+' : ''}
                      {formatNumber(member.instagram_growth)} ({member.instagram_growth >= 0 ? '+' : ''}
                      {member.instagram_growth_pct}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
