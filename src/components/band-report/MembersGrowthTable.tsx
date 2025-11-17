import { useEffect, useState } from 'react'
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface MemberGrowth {
  id: string
  nombre: string
  instagram_followers: number
  instagram_growth: number
  instagram_growth_pct: number
  orden: number
}

interface MembersGrowthTableProps {
  entityId: string
}

export function MembersGrowthTable({ entityId }: MembersGrowthTableProps) {
  const [members, setMembers] = useState<MemberGrowth[]>([])
  const [editedMembers, setEditedMembers] = useState<MemberGrowth[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('reportes_miembros_growth')
        .select('*')
        .eq('entidad_id', entityId)
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error fetching members growth:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [entityId])

  const handleEdit = () => {
    setEditedMembers(members.map(m => ({ ...m })))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedMembers([])
  }

  const handleAddMember = () => {
    const newMember: MemberGrowth = {
      id: `temp-${Date.now()}`,
      nombre: '',
      instagram_followers: 0,
      instagram_growth: 0,
      instagram_growth_pct: 0,
      orden: editedMembers.length
    }
    setEditedMembers([...editedMembers, newMember])
  }

  const handleDeleteMember = (memberId: string) => {
    setEditedMembers(editedMembers.filter(m => m.id !== memberId))
  }

  const handleMemberChange = (memberId: string, field: keyof MemberGrowth, value: string | number) => {
    setEditedMembers(prev => prev.map(member =>
      member.id === memberId ? { ...member, [field]: value } : member
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const existingIds = members.map(m => m.id)
      const toDelete = existingIds.filter(id => !editedMembers.find(m => m.id === id))

      if (toDelete.length > 0) {
        await supabase
          .from('reportes_miembros_growth')
          .delete()
          .in('id', toDelete)
      }

      const toUpdate = editedMembers.filter(m => !m.id.startsWith('temp-') && m.nombre.trim() !== '')
      const toInsert = editedMembers.filter(m => m.id.startsWith('temp-') && m.nombre.trim() !== '')

      for (const member of toUpdate) {
        const prevFollowers = member.instagram_followers - member.instagram_growth
        const growthPct = prevFollowers > 0 ? (member.instagram_growth / prevFollowers) * 100 : 0

        await supabase
          .from('reportes_miembros_growth')
          .update({
            nombre: member.nombre,
            instagram_followers: member.instagram_followers,
            instagram_growth: member.instagram_growth,
            instagram_growth_pct: growthPct,
            orden: member.orden
          })
          .eq('id', member.id)
      }

      for (const member of toInsert) {
        const prevFollowers = member.instagram_followers - member.instagram_growth
        const growthPct = prevFollowers > 0 ? (member.instagram_growth / prevFollowers) * 100 : 0

        await supabase
          .from('reportes_miembros_growth')
          .insert({
            entidad_id: entityId,
            nombre: member.nombre,
            slug: member.nombre.toLowerCase().replace(/\s+/g, '-'),
            instagram_followers: member.instagram_followers,
            instagram_growth: member.instagram_growth,
            instagram_growth_pct: growthPct,
            orden: member.orden,
            activo: true
          })
      }

      await fetchMembers()
      setIsEditing(false)
      setEditedMembers([])
    } catch (error) {
      console.error('Error saving members:', error)
      alert('Error saving changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return 'N/A'
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatGrowth = (growth: number, pct: number) => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${formatNumber(growth)} (${sign}${pct.toFixed(1)}%)`
  }

  const getGrowthColor = (pct: number) => {
    if (pct > 0) return 'text-green-600'
    if (pct < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-8 text-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (members.length === 0 && !isEditing) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-8 text-center">
        <p className="text-gray-500 text-sm">No data available yet</p>
      </div>
    )
  }

  const displayMembers = isEditing ? editedMembers : members
  const totalCurrent = displayMembers.reduce((sum, m) => sum + m.instagram_followers, 0)
  const totalGrowth = displayMembers.reduce((sum, m) => sum + m.instagram_growth, 0)
  const prevTotal = totalCurrent - totalGrowth
  const totalPct = prevTotal > 0 ? (totalGrowth / prevTotal) * 100 : 0

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-300 flex justify-end print:hidden">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Metrics
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Member</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Current</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Past Week</th>
              <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Growth</th>
              {isEditing && (
                <th className="text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayMembers.map((member, idx) => (
              <MemberRow
                key={member.id}
                member={member}
                isEditing={isEditing}
                isSaving={isSaving}
                formatNumber={formatNumber}
                formatGrowth={formatGrowth}
                getGrowthColor={getGrowthColor}
                onMemberChange={handleMemberChange}
                onDelete={handleDeleteMember}
              />
            ))}
            <tr className="border-t-2 border-gray-300 bg-gray-100">
              <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black font-bold whitespace-nowrap">
                Total
              </td>
              <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black text-right font-bold whitespace-nowrap">
                {formatNumber(totalCurrent)}
              </td>
              <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right font-medium whitespace-nowrap">
                {formatNumber(prevTotal)}
              </td>
              <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-medium whitespace-nowrap">
                <span className={getGrowthColor(totalPct)}>
                  {formatGrowth(totalGrowth, totalPct)}
                </span>
              </td>
              {isEditing && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleAddMember}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      )}
    </div>
  )
}

interface MemberRowProps {
  member: MemberGrowth
  isEditing: boolean
  isSaving: boolean
  formatNumber: (num: number | null) => string
  formatGrowth: (growth: number, pct: number) => string
  getGrowthColor: (pct: number) => string
  onMemberChange: (memberId: string, field: keyof MemberGrowth, value: string | number) => void
  onDelete: (memberId: string) => void
}

function MemberRow({ member, isEditing, isSaving, formatNumber, formatGrowth, getGrowthColor, onMemberChange, onDelete }: MemberRowProps) {
  const prevFollowers = member.instagram_followers - member.instagram_growth

  if (isEditing) {
    return (
      <tr className="border-t border-gray-200 bg-white">
        <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
          <input
            type="text"
            value={member.nombre}
            onChange={(e) => onMemberChange(member.id, 'nombre', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            placeholder="Member name"
            disabled={isSaving}
          />
        </td>
        <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
          <input
            type="number"
            value={member.instagram_followers}
            onChange={(e) => onMemberChange(member.id, 'instagram_followers', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
            placeholder="0"
            disabled={isSaving}
          />
        </td>
        <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs text-gray-600 text-right">
          {formatNumber(prevFollowers)}
        </td>
        <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
          <input
            type="number"
            value={member.instagram_growth}
            onChange={(e) => onMemberChange(member.id, 'instagram_growth', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
            placeholder="0"
            disabled={isSaving}
          />
        </td>
        <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right">
          <button
            onClick={() => onDelete(member.id)}
            disabled={isSaving}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t border-gray-200">
      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black font-medium whitespace-nowrap">
        {member.nombre}
      </td>
      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black text-right font-medium whitespace-nowrap">
        {formatNumber(member.instagram_followers)}
      </td>
      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right whitespace-nowrap">
        {formatNumber(prevFollowers)}
      </td>
      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap">
        <span className={getGrowthColor(member.instagram_growth_pct)}>
          {formatGrowth(member.instagram_growth, member.instagram_growth_pct)}
        </span>
      </td>
    </tr>
  )
}
