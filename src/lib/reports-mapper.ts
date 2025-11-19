import { supabase } from './supabase'
import type { WeeklyReport } from '../types/weekly-report'

function isDbReportsEnabled(): boolean {
  const viteFlag = import.meta.env.VITE_USE_DB_REPORTS
  const nextFlag = import.meta.env.NEXT_PUBLIC_USE_DB_REPORTS
  return viteFlag === 'true' || nextFlag === 'true'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getWeeklyReportFromReportesEntidades(
  entidad: { id: string; nombre: string; slug: string },
  weekEnd?: string
): Promise<WeeklyReport | null> {
  try {
    console.log('[getWeeklyReportFromReportesEntidades] Called with:', { entidad, weekEnd })

    // Get the report status/dates - just get the most recent one for now
    const { data: statusData, error: statusError } = await supabase
      .from('reportes_estado')
      .select('*')
      .eq('entidad_id', entidad.id)
      .order('semana_inicio', { ascending: false })
      .limit(1)
      .maybeSingle()

    console.log('[getWeeklyReportFromReportesEntidades] statusData:', statusData, 'error:', statusError)

    if (!statusData) {
      return null
    }

    // Get all items for this entity
    const { data: items } = await supabase
      .from('reportes_items')
      .select('*')
      .eq('entidad_id', entidad.id)
      .order('posicion', { ascending: true })

    if (!items) {
      return null
    }

    const result: WeeklyReport = {
      artist: entidad.nombre.toUpperCase(),
      week_start: statusData.semana_inicio,
      week_end: statusData.semana_fin,
      highlights: []
    }

    // Group items by categoria
    const mvBullets: string[] = []

    items.forEach((item: any) => {
      switch (item.categoria) {
        case 'highlights':
        case 'highlight':
          if (item.texto && item.texto !== 'No data') {
            result.highlights = result.highlights || []
            result.highlights.push(item.texto)
          }
          break

        case 'sentiment':
        case 'fan_sentiment':
          if (item.texto && item.texto !== 'No data') {
            result.fan_sentiment = (result.fan_sentiment || '') + item.texto + '\n\n'
          }
          break

        case 'mv_totales':
          if (item.titulo && item.texto) {
            mvBullets.push(`${item.titulo}: ${item.texto}`)
          }
          break
      }
    })

    // Add mv_views if we have any
    if (mvBullets.length > 0) {
      result.mv_views = [{
        section: 'MV Views',
        bullets: mvBullets
      }]
    }

    console.log('[getWeeklyReportFromReportesEntidades] Mapped result:', JSON.stringify(result, null, 2))

    // Clean up fan_sentiment trailing newlines
    if (result.fan_sentiment) {
      result.fan_sentiment = result.fan_sentiment.trim()
    }

    console.log('[getWeeklyReportFromReportesEntidades] FINAL result before return:', result)
    console.log('[getWeeklyReportFromReportesEntidades] highlights length:', result.highlights?.length)
    console.log('[getWeeklyReportFromReportesEntidades] mv_views length:', result.mv_views?.length)

    return result
  } catch (error) {
    console.error('Error fetching from reportes_entidades:', error)
    return null
  }
}

async function getWeeklyReportFromNewSchema(
  artistSlug: string,
  weekEnd?: string
): Promise<WeeklyReport | null> {
  try {
    console.log('[getWeeklyReportFromNewSchema] Called with:', { artistSlug, weekEnd })

    const { data: artists } = await supabase
      .from('artistas_registry')
      .select('id, nombre')
      .ilike('nombre', `%${artistSlug.replace(/-/g, ' ')}%`)

    console.log('[getWeeklyReportFromNewSchema] Found in artistas_registry:', artists)

    // If not found in artistas_registry, try reportes_entidades
    if (!artists || artists.length === 0) {
      console.log('[getWeeklyReportFromNewSchema] Not found in artistas_registry, trying reportes_entidades')

      const { data: entidades, error: entidadesError } = await supabase
        .from('reportes_entidades')
        .select('id, nombre, slug')
        .eq('activo', true)
        .or(`slug.eq.${artistSlug},nombre.ilike.%${artistSlug.replace(/-/g, ' ')}%`)

      console.log('[getWeeklyReportFromNewSchema] Found in reportes_entidades:', entidades, 'error:', entidadesError)

      if (!entidades || entidades.length === 0) {
        console.log('[getWeeklyReportFromNewSchema] Not found anywhere, returning null')
        return null
      }

      // For reportes_entidades, we need to fetch from reportes_items, not reports table
      console.log('[getWeeklyReportFromNewSchema] Calling getWeeklyReportFromReportesEntidades')
      return await getWeeklyReportFromReportesEntidades(entidades[0], weekEnd)
    }

    const artistId = artists[0].id
    const artistName = artists[0].nombre

    let query = supabase
      .from('reports')
      .select('*')
      .eq('report_type', 'artist')
      .eq('artist_id', artistId)

    if (weekEnd) {
      query = query.eq('week_end', weekEnd)
    }

    const { data: report, error: reportError } = await query
      .order('week_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (reportError || !report) {
      return null
    }

    const { data: sections } = await supabase
      .from('report_sections')
      .select('*')
      .eq('report_id', report.id)
      .order('order_no', { ascending: true })

    // Fetch demographics from reportes_buckets (using entidad_id from reports)
    const { data: entidad } = await supabase
      .from('reportes_entidades')
      .select('id')
      .eq('tipo', 'artist')
      .ilike('nombre', artistName)
      .maybeSingle()

    let demographics: { gender: Record<string, number>; age_pct: Record<string, number> } | null = null
    if (entidad) {
      const { data: buckets } = await supabase
        .from('reportes_buckets')
        .select('*')
        .eq('entidad_id', entidad.id)
        .eq('seccion_clave', 'demographics')

      if (buckets && buckets.length > 0) {
        // Transform buckets to the format expected by WeeklyDetail
        const genderBuckets = buckets.filter((b: any) => b.dimension === 'gender')
        const ageBuckets = buckets.filter((b: any) => b.dimension === 'age')

        const genderMap: Record<string, number> = {}
        const ageMap: Record<string, number> = {}

        genderBuckets.forEach((b: any) => {
          const key = b.bucket.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
          genderMap[key] = b.valor_num
        })

        ageBuckets.forEach((b: any) => {
          ageMap[b.bucket] = b.valor_num
        })

        demographics = {
          gender: genderMap,
          age_pct: ageMap
        }
      }
    }

    const result: WeeklyReport = {
      artist: artistName.toUpperCase(),
      week_start: report.week_start,
      week_end: report.week_end,
      highlights: [],
      demographics: demographics || undefined
    }

    if (sections) {
      for (const section of sections) {
        const key = section.section_key
        const data = section.data_json || {}

        switch (key) {
          case 'highlights':
            result.highlights = data.bullets || []
            if (data.link) {
              result.highlight_link = data.link
            }
            break

          case 'fan_sentiment':
            result.fan_sentiment = section.content_md || data.text || ''
            break

          case 'billboard_charts':
            result.billboard_charts = data.charts || []
            break

          case 'spotify_charts':
            result.spotify_charts = data.charts || []
            break

          case 'streaming_trends':
            result.streaming_trends = data.trends || []
            break

          case 'tiktok_trends':
            result.tiktok_trends = data.trends || []
            break

          case 'apple_music':
            result.apple_music = data.data || []
            break

          case 'shazam':
            result.shazam = data.data || []
            break

          case 'playlist_adds':
            result.playlist_adds = data.adds || []
            break

          case 'demographics':
            result.demographics = data
            break

          case 'top_countries':
            result.top_countries = data.countries || []
            break

          case 'top_cities':
            result.top_cities = data.cities || []
            break

          case 'release_engagement':
            result.release_engagement = data
            break

          case 'mv_views':
            result.mv_views = data.views || []
            break

          case 'spotify_stats':
            result.spotify_stats = data
            break

          case 'audience_segmentation':
            result.audience_segmentation = data
            break

          case 'total_audience':
            result.total_audience = data.total || 0
            break
        }
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching from new schema:', error)
    return null
  }
}

async function getWeeklyReportFromOldSchema(
  artistSlug: string,
  weekEnd?: string
): Promise<WeeklyReport | null> {
  try {
    let query = supabase
      .from('spotify_report_weekly')
      .select('*')
      .eq('artist_id', artistSlug)
      .eq('status', 'ready')

    if (weekEnd) {
      query = query.eq('week_end', weekEnd)
    }

    const { data, error } = await query
      .order('week_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return {
      artist: data.artist_name,
      week_start: data.week_start,
      week_end: data.week_end,
      highlights: []
    }
  } catch (error) {
    console.error('Error fetching from old schema:', error)
    return null
  }
}

export async function getWeeklyReportDetailed(
  artistSlug: string,
  weekEnd?: string,
  fallbackSample?: WeeklyReport | null
): Promise<WeeklyReport | null> {
  console.log('[getWeeklyReportDetailed] Called with:', { artistSlug, weekEnd, hasSample: !!fallbackSample })

  const dbEnabled = isDbReportsEnabled()
  console.log('[getWeeklyReportDetailed] DB Reports enabled:', dbEnabled)

  if (!dbEnabled) {
    console.log('[getWeeklyReportDetailed] DB disabled, returning fallback sample')
    return fallbackSample || null
  }

  console.log('[getWeeklyReportDetailed] Trying newReport from new schema')
  const newReport = await getWeeklyReportFromNewSchema(artistSlug, weekEnd)
  if (newReport) {
    console.log('[getWeeklyReportDetailed] Found newReport, returning it')
    return newReport
  }

  console.log('[getWeeklyReportDetailed] No newReport, trying old schema')
  const oldReport = await getWeeklyReportFromOldSchema(artistSlug, weekEnd)
  if (oldReport) {
    console.log('[getWeeklyReportDetailed] Found oldReport, returning it')
    return oldReport
  }

  console.log('[getWeeklyReportDetailed] Nothing found, returning fallback sample')
  return fallbackSample || null
}
