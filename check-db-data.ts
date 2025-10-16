import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqrobbmdvanuozzhjdun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxcm9iYm1kdmFudW96emhqZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjY0ODgsImV4cCI6MjA2NjQwMjQ4OH0.Pv6RDwe1-1rlxDPdEw-hD_kuxRDQsEwG4MK41QSzTdc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('=== Checking Database Data ===\n')

  const { data: entities } = await supabase
    .from('reportes_entidades')
    .select('id, slug, nombre')
    .limit(5)

  console.log('Entities:', entities)

  if (entities && entities.length > 0) {
    const entidadId = entities[0].id
    console.log(`\n=== Checking data for: ${entities[0].nombre} (${entidadId}) ===\n`)

    const { data: sections } = await supabase
      .from('reportes_secciones')
      .select('seccion_clave, titulo, lista, orden')
      .eq('entidad_id', entidadId)
      .order('orden')

    console.log('Sections:', JSON.stringify(sections, null, 2))

    const { data: items, error: itemsError } = await supabase
      .from('reportes_items')
      .select('categoria, texto, valor, posicion')
      .eq('entidad_id', entidadId)
      .order('categoria')
      .order('posicion')

    console.log('\nItems count:', items?.length || 0)
    if (itemsError) console.log('Items error:', itemsError)

    if (items && items.length > 0) {
      const itemsByCategory = items.reduce((acc: any, item: any) => {
        if (!acc[item.categoria]) acc[item.categoria] = []
        acc[item.categoria].push(item)
        return acc
      }, {})
      console.log('Items by category:', JSON.stringify(itemsByCategory, null, 2))
    } else {
      console.log('No items found in reportes_items table')
    }

    const { data: metrics } = await supabase
      .from('reportes_metricas')
      .select('seccion_clave, metrica_clave, plataforma, valor, valor_prev, delta_pct')
      .eq('entidad_id', entidadId)
      .limit(20)

    console.log('\nMetrics sample:', JSON.stringify(metrics, null, 2))

    const { data: buckets } = await supabase
      .from('reportes_buckets')
      .select('seccion_clave, dimension, bucket_valor, valor')
      .eq('entidad_id', entidadId)
      .limit(10)

    console.log('\nBuckets sample:', JSON.stringify(buckets, null, 2))
  }
}

checkData().catch(console.error)
