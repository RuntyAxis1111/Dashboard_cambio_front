import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ReportPreferences {
  hiddenSections: string[]
  loading: boolean
  toggleSection: (sectionKey: string) => Promise<void>
  resetToDefault: () => Promise<void>
  isSectionVisible: (sectionKey: string) => boolean
}

export function useReportPreferences(entidadId: string): ReportPreferences {
  const [hiddenSections, setHiddenSections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserId() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    if (!userId || !entidadId) {
      setLoading(false)
      return
    }

    async function loadPreferences() {
      try {
        const { data, error } = await supabase
          .from('reportes_preferencias_visualizacion')
          .select('secciones_ocultas')
          .eq('user_id', userId)
          .eq('entidad_id', entidadId)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error)
          return
        }

        if (data?.secciones_ocultas) {
          setHiddenSections(data.secciones_ocultas as string[])
        }
      } catch (err) {
        console.error('Error fetching preferences:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [userId, entidadId])

  const savePreferences = async (newHiddenSections: string[]) => {
    if (!userId || !entidadId) return

    try {
      const { error } = await supabase
        .from('reportes_preferencias_visualizacion')
        .upsert({
          user_id: userId,
          entidad_id: entidadId,
          secciones_ocultas: newHiddenSections,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,entidad_id'
        })

      if (error) {
        console.error('Error saving preferences:', error)
      }
    } catch (err) {
      console.error('Error upserting preferences:', err)
    }
  }

  const toggleSection = async (sectionKey: string) => {
    const newHiddenSections = hiddenSections.includes(sectionKey)
      ? hiddenSections.filter(key => key !== sectionKey)
      : [...hiddenSections, sectionKey]

    setHiddenSections(newHiddenSections)
    await savePreferences(newHiddenSections)
  }

  const resetToDefault = async () => {
    setHiddenSections([])
    await savePreferences([])
  }

  const isSectionVisible = (sectionKey: string): boolean => {
    return !hiddenSections.includes(sectionKey)
  }

  return {
    hiddenSections,
    loading,
    toggleSection,
    resetToDefault,
    isSectionVisible
  }
}
