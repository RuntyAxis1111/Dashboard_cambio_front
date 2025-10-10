import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Download, ExternalLink } from 'lucide-react'
import { Breadcrumb } from '../components/Breadcrumb'
import { WeeklyReport } from '../types/weekly-report'

const SAMPLE_KATSEYE: WeeklyReport = {
  artist: 'KATSEYE',
  week_start: '2025-09-29',
  week_end: '2025-10-06',
  highlights: [
    '32,652,250 Spotify Monthly Listeners (as of today)',
    'IG surpassed 7M followers (10/5)',
    'TikTok surpassed 13M followers (10/5)',
    "Roblox 'Gabriela', 'Gameboy' & 'Gnarly' emotes dropped (10/4)",
    'KATSEYE i-D October 2025 issue (10/2)',
    'YouTube surpassed 5M subscribers (10/1)',
    "'Gabriela' Dance Practice released on KE YT (9/30)"
  ],
  highlight_link: {
    label: "Watch 'Gabriela' Dance Practice",
    url: 'https://www.youtube.com/watch?v=lll3eKuBJ8w&t=50s'
  },
  billboard_charts: [
    { rank: '#29', chart: 'Billboard 200', work: 'Beautiful Chaos', weeks: 14, notes: '-' },
    { rank: '#45', chart: 'Top 200 Song Consumption', work: 'Gabriela', weeks: 15, notes: '-' },
    { rank: '#127', chart: 'Top 200 Song Consumption', work: 'Gnarly', weeks: 22, notes: '-' }
  ],
  spotify_charts: [
    { track: 'Gabriela', markets: 47, notes: 'Global #19 (+5), US #40 (+9); Italy debut #192' },
    { track: 'Gnarly', markets: 16, notes: 'Global #79 (+10), US #102 (+15); re-enters Australia #172 & Venezuela #184' },
    { track: 'Touch', markets: 10, notes: 'Global #129 (+27); US peak #154 (+25)' },
    { track: 'Gameboy / Debut', markets: 1, notes: 'Singapore chart' }
  ],
  streaming_trends: [
    {
      track: 'Beautiful Chaos',
      bullets: ['Slightly down -5% globally (US -5%).']
    },
    {
      track: 'Gabriela',
      bullets: [
        'Down -5% globally; Long-form streams slightly up +1%.',
        'Amazon LF streams up +10% (17% of global).',
        'US streams -5% (LF slightly up +1%).',
        'Top ex-US markets: Philippines (12%), Brazil (6%), Indonesia (6%).',
        'Slight LF growth in Indonesia (+4%) and Australia (+2%).'
      ]
    },
    {
      track: 'Gnarly',
      bullets: [
        'Down -6% globally; LF streams -6%.',
        'US streams -6% (LF -6%).',
        'Top ex-US: Brazil (8%), Philippines (7%), Mexico (5%), UK (5%).'
      ]
    },
    {
      track: 'Gameboy',
      bullets: [
        'Down -6% globally; US -6% (LF -5%).',
        'Top ex-US: Philippines (10%), Brazil (6%), UK (5%).'
      ]
    }
  ],
  tiktok_trends: [
    {
      track: 'Gabriela',
      top_posts: ['1,500,000 views — Yoonchae & Sophia live (France)']
    },
    {
      track: 'Gnarly',
      top_posts: [
        '1,100,000 views — Playing at the club (France)',
        '1,000,000 views — Grandma vibing (Brazil)',
        '1,000,000 views — Kylie Jenner at fashion week (posted by British Vogue, 1.5M followers)',
        '65,000 views — Dance challenge by Tati Fernandez (8M followers)'
      ],
      note: "More creators using 'Making Beats…' verse"
    }
  ],
  apple_music: [],
  shazam: []
}

const SAMPLE_ADRIAN_COTA: WeeklyReport = {
  artist: 'ADRIÁN COTA',
  week_start: '2025-10-01',
  week_end: '2025-10-07',
  highlights: [
    'Streams semanales: 10,060 (+131% WoW)',
    'Oyentes semanales: 6,336 (+74% WoW)',
    'Streams por oyente: 1.59 (+33% WoW)',
    'Seguidores netos: +42 (+5% vs PW)',
    '"Boujee" añadió playlists clave: All New Latin (Spotify), Cha Cha Cha Top 100, Lanzamientos de la Semana, Crema Scoops Of The Week (Oct 3–4)',
    'Engagement lanzamiento: 476 (6.3%) de 7,533 oyentes activos reprodujeron "Boujee" en los primeros 8 días'
  ],
  highlight_link: {
    label: 'Watch "Boujee"',
    url: 'https://www.youtube.com/watch?v=LOob4p90QTA'
  },
  billboard_charts: [],
  spotify_charts: [
    {
      track: 'Boujee',
      markets: 0,
      notes: 'Playlists nuevas: All New Latin (pos. 49), Cha Cha Cha Top 100 (pos. 222), Lanzamientos de la Semana (pos. 138), Crema Scoops Of The Week (pos. 7)'
    }
  ],
  streaming_trends: [
    {
      track: 'Global',
      bullets: [
        'Streams +131% WoW; oyentes +74%; SPL +33%',
        'Pico de streams: Oct 3 (1,699), alineado con altas a playlists'
      ]
    },
    {
      track: 'Mercados (S4A, 28 días)',
      bullets: [
        'Países top: US, MX, CA, UK, AU, DE, ES, NL, JP, FR',
        'Ciudades top: Chicago, Mexico City, New York, Minneapolis, Denver, Culiacán, Los Ángeles, Ahome'
      ]
    }
  ],
  tiktok_trends: [],
  apple_music: [],
  shazam: []
}

const SAMPLE_MAGNA: WeeklyReport = {
  artist: 'MAGNA',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  fan_sentiment: `This week's takeaways:

• Tono general: Muy positivo (celebración, gratitud, cercanía). Sin señales negativas relevantes.

• Temas:
  - Hito 1º aniversario del álbum
  - Promoción -50% de merch/vinilo con envíos a MX/CO/US
  - Conexión emocional con "Deja de hablar" (canta-along, comunidad)

• Pull-quotes (muestra):
  - "Ese álbum es pura magia, lo amo tanto 💙"
  - "Además tiene mi canción favorita en el mundo!!!!"
  - "La vida suena muy linda contigooo 🩷"
  - "Qué lindo @c2abadp 😍"

• Acciones sugeridas:
  - Fijar/rehusar el post del -50% y empujarlo en stories con link sticker a itsmagna.com (MX/CO/US)
  - Repostear clips canta-along de "Deja de hablar" (IG Reels/TikTok) con CTA a Guardar el track
  - Añadir UTM (ej. ?utm_source=ig&utm_campaign=aniv50) para medir tráfico a merch`,
  highlights: [
    'Aniversario del álbum (+casi 5M streams) y promo -50% en vinilo/merch en itsmagna.com (envíos a MX/CO/US)',
    'Contenido íntimo/UGC de "Deja de hablar" generó alta afinidad y comentarios positivos (ver Fan Sentiment)',
    'Mercados fuertes 28d (S4A): México (82.7K), Colombia (46.9K), US (39.8K)',
    'Ciudades clave 28d: CDMX (23.4K), Bogotá (21.5K), Lima (9.7K)',
    'Audiencia total 28d (S4A): 1,576,299 (Activos nuevos 22,481)',
    'Demografía 28d: 51% mujeres, pico 25–34 (45%)',
    'Luminate: sin entradas verificadas esta semana (No data)'
  ],
  highlight_link: undefined,
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [],
  tiktok_trends: [],
  apple_music: [],
  shazam: [],
  total_audience: 1576299,
  release_engagement: {
    title: 'Deja De Hablar',
    days_since_release: 13,
    active_audience_total: 68053,
    engaged_streamed: 4323,
    engaged_pct: 6.4
  },
  demographics: {
    gender: { female: 51, male: 44, non_binary: 1, not_specified: 4 },
    age_pct: {
      '<18': 2,
      '18-24': 25,
      '25-34': 45,
      '35-44': 18,
      '45-54': 7,
      '55-64': 2,
      '65+': 1
    }
  },
  top_countries: [
    { rank: 1, country: 'Mexico', listeners: 82739 },
    { rank: 2, country: 'Colombia', listeners: 46949 },
    { rank: 3, country: 'United States', listeners: 39755 },
    { rank: 4, country: 'Peru', listeners: 18219 },
    { rank: 5, country: 'Spain', listeners: 13902 },
    { rank: 6, country: 'Chile', listeners: 8528 },
    { rank: 7, country: 'Guatemala', listeners: 7349 },
    { rank: 8, country: 'Argentina', listeners: 7176 },
    { rank: 9, country: 'Ecuador', listeners: 6478 },
    { rank: 10, country: 'Venezuela', listeners: 4229 }
  ],
  top_cities: [
    { rank: 1, city: 'Mexico City, MX', listeners: 23441 },
    { rank: 2, city: 'Bogotá, CO', listeners: 21479 },
    { rank: 3, city: 'Lima, PE', listeners: 9664 },
    { rank: 4, city: 'Medellín, CO', listeners: 7283 },
    { rank: 5, city: 'Guatemala City, GT', listeners: 5754 },
    { rank: 6, city: 'Santiago, CL', listeners: 5442 },
    { rank: 7, city: 'Barranquilla, CO', listeners: 5294 },
    { rank: 8, city: 'Guadalajara, MX', listeners: 5043 }
  ],
  playlist_adds: [
    { playlist: 'el nuevo pop (P) 🇵🇪', curator: 'Spotify', track: 'deja de hablar', date_added: '2025-09-26', position: '5/50', peak: 3, followers_k: 287.9, note: 'New add; buena posición' },
    { playlist: 'TU PLAYLIST DE FAVORITA <3', curator: 'Joan Because', track: 'deja de hablar', date_added: '2025-10-07', position: '4/50', peak: 4, followers_k: 22.8, note: '—' },
    { playlist: 'Parchadito', curator: 'Spotify', track: 'les va a doler', date_added: '2025-08-29', position: '15/60', peak: 15, followers_k: 63.7, note: 'Estable' },
    { playlist: 'LO MAS NUEVO DEL REGGAETON 2025', curator: 'Yulieth Gomez B', track: 'les va a doler', date_added: '2025-09-05', position: '20/97', peak: 13, followers_k: 48.7, note: 'Seguidores creciendo' },
    { playlist: 'Tecate Pal Norte 2025', curator: 'Tecate Pa\'l Norte', track: 'SAL', date_added: '2024-10-28', position: '125/224', peak: 123, followers_k: 57.2, note: 'Larga permanencia' }
  ]
}

const SAMPLE_SANTOS_BRAVOS: WeeklyReport = {
  artist: 'SANTOS BRAVOS',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  fan_sentiment: `This week's takeaways:

• Tono general: Muy positivo (presentación en vivo + colaboración).

• Lo que funciona: reels cortos con captions grandes; colaboraciones/remix.

• Top fan comments destacan la presentación en vivo y la demanda de colaboración con Santos Bravos.

• Instagram: CTR link-in-bio 19.6%, engagement/alcance 11.6%, vistas por alcance 3.13. Reels con hook <3s + subtítulos grandes concentran la interacción.`,
  highlights: [
    'TikTok en 28 días: 19.23M views, 626.4K profile views, 2.53M likes, 38.1K comments, 52.4K shares.',
    'Pico de actividad el 25 de septiembre: 2.68M views, 100.3K profile views, 395.5K likes, 3.5K comments, 9.4K shares.',
    'Semana más reciente vs la previa (7d/7d): caída esperada tras el pico → views -59%, profile views -60%, likes -63%, comments -44%, shares -60%.',
    'Instagram: CTR link-in-bio 19.6%, engagement/alcance 11.6%, vistas por alcance 3.13. Reels con hook <3s + subtítulos grandes concentran la interacción.',
    'Spotify for Creators (últimos 30 días): 946.4K reproducciones, 28,531 horas de consumo, +1,030 seguidores.',
    'Top países (7 días, Spotify): México, Argentina, España.',
    'Demografía Spotify: 62.6% mujeres, 31.4% hombres, 1.6% no binario, 4.4% sin especificar; pico de edad 45–59; también fuerte 23–27 y 18–22.'
  ],
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [],
  tiktok_trends: [
    {
      track: 'Overview (últimos 28 días)',
      top_posts: [
        'Video views: 19,225,371',
        'Profile views: 626,390',
        'Likes: 2,530,648',
        'Comments: 38,111',
        'Shares: 52,377'
      ]
    },
    {
      track: 'Semana reciente (últimos 7 días) vs semana previa',
      top_posts: [
        'Video views: 4,669,037 vs 11,383,419 (-59%)',
        'Profile views: 146,457 vs 366,702 (-60%)',
        'Likes: 571,754 vs 1,548,447 (-63%)',
        'Comments: 9,346 vs 16,668 (-44%)',
        'Shares: 12,868 vs 32,048 (-60%)'
      ]
    },
    {
      track: 'Spike',
      top_posts: [
        'Día de mayor tracción: 25 de septiembre con 2,681,071 views, 100,255 profile views, 395,538 likes, 3,518 comments y 9,421 shares.'
      ]
    },
    {
      track: 'Notas',
      top_posts: [],
      note: 'El descenso 7d/7d refleja normalización post-pico del 25-Sep. Mantener monitoreo de contenidos publicados ese día para replicar formato/temas.'
    }
  ],
  apple_music: [],
  shazam: [],
  demographics: {
    gender: { female: 62.6, male: 31.4, non_binary: 1.6, not_specified: 4.4 },
    age_pct: {
      '0-17': 0.9,
      '18-22': 19.7,
      '23-27': 23.9,
      '28-34': 4.5,
      '35-44': 11.8,
      '45-59': 28,
      '60+': 11.4
    }
  },
  top_countries: [
    { rank: 1, country: 'México', listeners: 15738 },
    { rank: 2, country: 'Argentina', listeners: 59 },
    { rank: 3, country: 'España', listeners: 52 }
  ]
}

const SAMPLE_GREGORIO: WeeklyReport = {
  artist: 'GREGORIO',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  fan_sentiment: `This week's takeaways:

• Tono general: Muy positivo (presentación en vivo de "Toca La Puerta" y clip con Santos Bravos)

• Temas:
  - "En vivo suena increíble"
  - "Presentación poderosa"
  - "Colaboración/afinidad con Santos Bravos"
  - "Expectativa por su debut"

• Pull-quotes (muestra):
  - "Eres demasiado!!! Y en vivo eres una locura!!!! Qué buena presentación ✨✨✨✨"
  - "Increíble ❤️😍"
  - "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS CUANDO YA DEBUTEN 🙏🏻"
  - "Me encanta todo lo que está sucediendo acá"`,
  highlights: [
    'Presentación en vivo de "Toca La Puerta" y contenido con Santos Bravos generan alta afinidad',
    'Total audience (S4A, últimos 2 años): 95,303',
    'Segmentación (S4A): 3.3% audiencia activa, 4% previamente activa, 92.6% programada',
    'Release engagement: "Toca La Puerta" — 977 (34%) de 2,877 oyentes de la audiencia activa la escucharon intencionalmente en los primeros 28 días',
    'Mercados fuertes 28d (Top-3): Colombia (17,275), México (9,816), Estados Unidos (9,431)',
    'Ciudades clave 28d (Top-3): Bogotá (8,608), Lima (3,587), Medellín (2,350)',
    'Demografía 28d: 54% mujeres, 41% hombres, 1% no binario, 4% no especificado. Pico de edad 25–34 (38%); luego 35–44 (29%) y 18–24 (13%)'
  ],
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [],
  tiktok_trends: [],
  apple_music: [],
  shazam: [],
  total_audience: 95303,
  release_engagement: {
    title: 'Toca La Puerta',
    days_since_release: 28,
    active_audience_total: 2877,
    engaged_streamed: 977,
    engaged_pct: 34
  },
  demographics: {
    gender: { female: 54, male: 41, non_binary: 1, not_specified: 4 },
    age_pct: {
      '<18': 2,
      '18-24': 13,
      '25-34': 38,
      '35-44': 29,
      '45-54': 13,
      '55-64': 4,
      '65+': 1
    }
  },
  top_countries: [
    { rank: 1, country: 'Colombia', listeners: 17275 },
    { rank: 2, country: 'Mexico', listeners: 9816 },
    { rank: 3, country: 'United States', listeners: 9431 }
  ],
  top_cities: [
    { rank: 1, city: 'Bogotá, CO', listeners: 8608 },
    { rank: 2, city: 'Lima, PE', listeners: 3587 },
    { rank: 3, city: 'Medellín, CO', listeners: 2350 }
  ],
  playlist_adds: [],
  spotify_stats: {
    listeners: 64335,
    streams: 101174,
    streams_per_listener: 1.573,
    saves: 1271,
    playlist_adds: 850
  },
  audience_segmentation: {
    active: 3.3,
    previously_active: 4.0,
    programmed: 92.6
  }
}

const SAMPLE_DESTINO: WeeklyReport = {
  artist: 'DESTINO',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  highlights: [
    'Spotify (28d): 23,728 listeners, 43,520 streams, 1.834 streams/listener, 1,711 saves, 1,635 playlist adds.',
    'Audience quality: 27% active / 73% programmed / 0% previously active → alta dependencia de programación.',
    'Release engagement — Máquina Del Tiempo (released 2025-09-10): 5,611 / 6,214 (90.3%) de la active audience la escuchó intencionalmente en los primeros 28 días.',
    'Top países (28d): México, Estados Unidos, Guatemala.',
    'Top ciudades (28d): CDMX, Guadalajara, Puebla.',
    'Demografía (28d): 59% male, 37% female, 4% not specified; pico de edad 25–34.',
    '',
    '**Facebook Insights:**',
    'Facebook Insights: Video views ↑ +240% WoW; pico 05-Oct con 796,121.',
    'Facebook Insights: Viewers/Reach ↓ −51% WoW; pico 30-Sep con 467,677.',
    'Facebook Insights: Interacciones ↓ −87% WoW; pico 14-Sep (3,865).',
    'Facebook Insights: Visitas al perfil ↓ −76% WoW; pico 26-Sep (1,271).',
    'Facebook Insights: Clics en enlace semana baja; último pico 27-Sep (5,750).',
    'Facebook Insights: +1,161 seguidores (28d); semana −57% vs previa; mejor día 14-Sep (+158).',
    '',
    '**Instagram Insights (last 28 days / last 7 days):**',
    'Instagram: Alcance (7d): 2.75M ↑+1702% vs semana previa — pico 455K el 5 Oct.',
    'Instagram: Reproducciones de video (7d): 3.26M ↑+1047% — pico 561K el 5 Oct.',
    'Instagram: Visitas al perfil (7d): 2,663 ↓−88.7% vs semana previa.',
    'Instagram: Clics en el enlace (7d): 38 ↓−97.4%.',
    'Instagram: Interacciones totales (7d): 184 ↓−56.6%.',
    'Instagram: Seguidores (7d): +99 ↓−75.4% vs semana previa.',
    '',
    'Mini insight: Explosión de alcance/visualizaciones (contenido viral) pero caída en visitas/clics ⇒ awareness alto sin conversión. Próximo paso: añadir CTAs y enlaces en posts/Stories durante picos.'
  ],
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [],
  tiktok_trends: [],
  apple_music: [],
  shazam: [],
  spotify_stats: {
    listeners: 23728,
    streams: 43520,
    streams_per_listener: 1.834,
    saves: 1711,
    playlist_adds: 1635
  },
  audience_segmentation: {
    active: 27,
    previously_active: 0,
    programmed: 73
  },
  release_engagement: {
    title: 'Máquina Del Tiempo',
    days_since_release: 28,
    active_audience_total: 6214,
    engaged_streamed: 5611,
    engaged_pct: 90.3
  },
  demographics: {
    gender: { female: 37, male: 59, non_binary: 0, not_specified: 4 },
    age_pct: {
      '<18': 5,
      '18-24': 20,
      '25-34': 35,
      '35-44': 22,
      '45-54': 11,
      '55-64': 5,
      '65+': 2
    }
  },
  top_countries: [
    { rank: 1, country: 'Mexico', listeners: 17859 },
    { rank: 2, country: 'United States', listeners: 4553 },
    { rank: 3, country: 'Guatemala', listeners: 208 }
  ],
  top_cities: [
    { rank: 1, city: 'Mexico City, MX', listeners: 3298 },
    { rank: 2, city: 'Guadalajara, MX', listeners: 1081 },
    { rank: 3, city: 'Puebla City, MX', listeners: 713 }
  ]
}

function getColIndexByHeader(tableEl: HTMLTableElement, headerText = 'notes'): number {
  const ths = tableEl.querySelectorAll('thead th')
  for (let i = 0; i < ths.length; i++) {
    const text = (ths[i].textContent || '').trim().toLowerCase()
    if (text === headerText) return i
  }
  return -1
}

function paintNotesCell(td: HTMLTableCellElement) {
  if (!td || td.querySelector('.delta')) return

  let html = td.innerHTML

  html = html.replace(/([+-]?)(\d+(?:\.\d+)?)%/g, (m, s, num) => {
    if (s === '+') return `<span class="delta up" aria-label="up ${num} percent"><span class="arrow">↑</span>+${num}%</span>`
    if (s === '-') return `<span class="delta down" aria-label="down ${num} percent"><span class="arrow">↓</span>-${num}%</span>`
    return `<span class="delta flat" aria-label="${num} percent">${num}%</span>`
  })

  html = html.replace(/\(([+-])(\d+)\)/g, (m, s, num) => {
    const cls = s === '+' ? 'up' : 'down'
    const arrow = s === '+' ? '↑' : '↓'
    const label = s === '+' ? 'up' : 'down'
    return `(<span class="delta ${cls}" aria-label="${label} ${num}"><span class="arrow">${arrow}</span>${s}${num}</span>)`
  })

  td.innerHTML = html
}

function colorizeNotesInTable(tableEl: HTMLTableElement) {
  const idx = getColIndexByHeader(tableEl, 'notes')
  if (idx < 0) return

  tableEl.querySelectorAll('tbody tr').forEach(tr => {
    const td = tr.children[idx] as HTMLTableCellElement
    if (td) paintNotesCell(td)
  })
}

function colorizeDeltas(rootSel = '.report-content') {
  const root = document.querySelector(rootSel)
  if (!root) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const texts: Text[] = []
  let n: Node | null

  while ((n = walker.nextNode())) {
    const parent = n.parentElement
    if (!parent) continue

    if (parent.closest('table')) continue

    if (n.nodeValue && n.nodeValue.match(/[+-]?\d+(?:\.\d+)?%/)) {
      texts.push(n as Text)
    }
  }

  texts.forEach(t => {
    const original = t.nodeValue || ''
    const html = original.replace(/([+-]?)(\d+(?:\.\d+)?)%/g, (match, sign, num) => {
      if (sign === '+') {
        return `<span class="delta up" aria-label="up ${num} percent"><span class="arrow">↑</span>+${num}%</span>`
      }
      if (sign === '-') {
        return `<span class="delta down" aria-label="down ${num} percent"><span class="arrow">↓</span>-${num}%</span>`
      }
      return `<span class="delta flat" aria-label="${num} percent">${num}%</span>`
    })

    if (html !== original) {
      const span = document.createElement('span')
      span.innerHTML = html
      if (t.parentNode) {
        t.parentNode.replaceChild(span, t)
      }
    }
  })
}

function colorizeAllNotes() {
  document.querySelectorAll('.report-content table').forEach(table => {
    colorizeNotesInTable(table as HTMLTableElement)
  })
}

function exportWeeklyPDF() {
  window.print()
}

export function WeeklyDetail() {
  const { artistId } = useParams<{ artistId: string }>()

  const report = artistId === 'katseye'
    ? SAMPLE_KATSEYE
    : artistId === 'adrian-cota'
    ? SAMPLE_ADRIAN_COTA
    : artistId === 'magna'
    ? SAMPLE_MAGNA
    : artistId === 'gregorio'
    ? SAMPLE_GREGORIO
    : artistId === 'santos-bravos'
    ? SAMPLE_SANTOS_BRAVOS
    : artistId === 'destino'
    ? SAMPLE_DESTINO
    : null

  useEffect(() => {
    requestAnimationFrame(() => {
      colorizeAllNotes()
      colorizeDeltas()
    })
  }, [report])

  if (!report) {
    return (
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-black mb-2">Report Not Found</h2>
          <p className="text-gray-600">No report available for {artistId}</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Weekly Reports', href: '/reports/weeklies' },
    { label: report.artist }
  ]

  return (
    <div className="bg-white min-h-screen report-page">
      <div className="print:hidden border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-black">{report.artist} Weekly</h1>
              <p className="text-sm text-gray-600 mt-1">
                {report.week_start} — {report.week_end}
              </p>
            </div>

            <button
              onClick={exportWeeklyPDF}
              className="export-btn px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="print:block hidden border-b-2 border-black mb-8">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{report.artist} Weekly</h1>
            <p className="text-sm text-gray-700 mt-1">
              {report.week_start} — {report.week_end}
            </p>
          </div>
          <img
            src={report.artist === 'DESTINO' ? '/assets/image copy copy copy copy copy copy copy copy.png' : '/assets/pinguinohybe.png'}
            alt="HYBE"
            className="h-10"
          />
        </div>
      </div>

      <div className="report-content max-w-6xl mx-auto px-6 py-8 space-y-10">
        {report.highlights && report.highlights.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Highlights / Overall Summary
            </h2>
            <ul className="space-y-2 list-none">
              {report.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-black font-bold mt-1">•</span>
                  <span className="text-gray-900">{item}</span>
                </li>
              ))}
            </ul>
            {report.highlight_link && (
              <div className="mt-4">
                <a
                  href={report.highlight_link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  {report.highlight_link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </section>
        )}

        {report.fan_sentiment && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Fan Sentiment
            </h2>
            <div className="space-y-6">
              <div className="whitespace-pre-line text-gray-900">{report.fan_sentiment}</div>

              {report.artist === 'MAGNA' && (
                <div className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3">
                      <img
                        src="/assets/magna-ig-aniversario.png"
                        alt="Post aniversario + -50% descuento"
                        className="w-full max-w-3xl mx-auto rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Imagen no disponible</p><p class="text-sm mt-2">Post aniversario + -50%</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Imagen 1:</strong> Post aniversario + -50% — 839 likes — hace ~5 días.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3">
                      <img
                        src="/assets/magna-ig-dejadehablar.png"
                        alt="Reel Deja de hablar (canta-along)"
                        className="w-full max-w-3xl mx-auto rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Imagen no disponible</p><p class="text-sm mt-2">Reel "Deja de hablar"</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Imagen 2:</strong> Reel "Deja de hablar" (canta-along) — 386 likes — hace ~1 semana.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'SANTOS BRAVOS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/santos-bravos-comment-1.png"
                        alt="Presentación en vivo - Toca la puerta"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">santos-bravos-comment-1.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Comentario 1</strong> — Presentación en vivo
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-1">
                      "mi primera vez cantando 'toca la puerta'… en vivo…"
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      <strong>Por qué importa:</strong> Muestra la conexión emocional de los fans con las presentaciones en vivo y genera engagement orgánico.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/santos-bravos-comment-2.png"
                        alt="Demanda de colaboración con Santos Bravos"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">santos-bravos-comment-2.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Comentario 2</strong> — Demanda de colaboración
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-1">
                      "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS…"
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      <strong>Por qué importa:</strong> Los fans anticipan y demandan colaboraciones específicas, señal de engagement profundo con el concepto del grupo.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'SANTOS BRAVOS' && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram Mini-KPIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">CTR Link-in-Bio</div>
                      <div className="text-3xl font-bold text-purple-600">19.6%</div>
                      <div className="text-xs text-gray-500 mt-2">Tasa de clics en el enlace de la biografía</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">Engagement / Reach</div>
                      <div className="text-3xl font-bold text-pink-600">11.6%</div>
                      <div className="text-xs text-gray-500 mt-2">Ratio de interacción sobre alcance</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">Vistas por Alcance</div>
                      <div className="text-3xl font-bold text-indigo-600">3.13</div>
                      <div className="text-xs text-gray-500 mt-2">Promedio de vistas por usuario alcanzado</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-700">
                      <strong>Insight clave:</strong> Reels con hook &lt;3s + subtítulos grandes concentran la interacción.
                      Picos claros esta semana; replicar formato de esos posts.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'GREGORIO' && (
                <div className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/gregorio-santos-bravos.png"
                        alt="Post con Santos Bravos"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Imagen no disponible</p><p class="text-sm mt-2">Post con Santos Bravos</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Imagen 1:</strong> Post con Santos Bravos — "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS CUANDO YA DEBUTEN" — ~3 semanas.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/gregorio-toca-la-puerta-live.png"
                        alt="Mi primera vez cantando Toca La Puerta (en vivo)"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Imagen no disponible</p><p class="text-sm mt-2">Toca La Puerta (en vivo)</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Imagen 2:</strong> Mi primera vez cantando "Toca La Puerta" (en vivo) — "Eres demasiado!!! Y en vivo eres una locura!!!! Qué buena presentación" — ~2 días.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Streaming Data Update
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Charting — Billboard</h3>
              {report.billboard_charts && report.billboard_charts.length > 0 ? (
                <div className="overflow-x-auto table-wrapper">
                  <table className="w-full border-collapse" role="table">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Rank</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Chart</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Track/Album</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Weeks</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.billboard_charts.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold text-black">{row.rank}</td>
                          <td className="py-3 px-4 text-gray-700">{row.chart}</td>
                          <td className="py-3 px-4 font-medium text-black">{row.work}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{row.weeks}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm notes">{row.notes === '-' ? '–' : row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 italic">No data this week</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Charting — Spotify</h3>
              {report.spotify_charts && report.spotify_charts.length > 0 ? (
                <div className="overflow-x-auto table-wrapper">
                  <table className="w-full border-collapse" role="table">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Track</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Markets</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.spotify_charts.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-3 px-4 font-medium text-black">{row.track}</td>
                          <td className="py-3 px-4 text-right text-gray-700 markets">{row.markets}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm notes">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 italic">No data this week</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Charting — Apple Music</h3>
              <p className="text-gray-600 italic">No data this week</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Charting — Shazam</h3>
              <p className="text-gray-600 italic">No data this week</p>
            </div>
          </div>
        </section>


        {report.playlist_adds && report.playlist_adds.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              DSP Playlist Adds (Spotify)
            </h2>
            <div className="overflow-x-auto table-wrapper">
              <table className="w-full border-collapse text-sm" role="table">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Playlist</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Curator</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Followers (K)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Track</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Added</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Pos/Peak</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {report.playlist_adds.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black">{row.playlist}</td>
                      <td className="py-3 px-4 text-gray-700">{row.curator}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.followers_k}</td>
                      <td className="py-3 px-4 text-gray-700">{row.track}</td>
                      <td className="py-3 px-4 text-gray-600">{row.date_added}</td>
                      <td className="py-3 px-4 text-gray-700">{row.position} / {row.peak}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm notes">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.top_countries && report.top_countries.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Top Countries (28 días)
            </h2>
            <div className="overflow-x-auto table-wrapper">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Country</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Listeners</th>
                  </tr>
                </thead>
                <tbody>
                  {report.top_countries.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700">#{row.rank}</td>
                      <td className="py-3 px-4 font-medium text-black">{row.country}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.listeners.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.top_cities && report.top_cities.length > 0 && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Top Cities (28 días)
            </h2>
            <div className="overflow-x-auto table-wrapper">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">City</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50" scope="col">Listeners</th>
                  </tr>
                </thead>
                <tbody>
                  {report.top_cities.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700">#{row.rank}</td>
                      <td className="py-3 px-4 font-medium text-black">{row.city}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.listeners.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.spotify_stats && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Spotify for Artists — Stats (últimos 28 días)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Listeners</p>
                <p className="text-2xl font-bold text-black">{report.spotify_stats.listeners.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Streams</p>
                <p className="text-2xl font-bold text-black">{report.spotify_stats.streams.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Streams/Listener</p>
                <p className="text-2xl font-bold text-black">{report.spotify_stats.streams_per_listener.toFixed(3)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Saves</p>
                <p className="text-2xl font-bold text-black">{report.spotify_stats.saves.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Playlist Adds</p>
                <p className="text-2xl font-bold text-black">{report.spotify_stats.playlist_adds.toLocaleString()}</p>
              </div>
            </div>
          </section>
        )}

        {report.audience_segmentation && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Audience Segmentation
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Activa</p>
                <p className="text-3xl font-bold text-blue-600">{report.audience_segmentation.active}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Previously Active</p>
                <p className="text-3xl font-bold text-green-600">{report.audience_segmentation.previously_active}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Programmed</p>
                <p className="text-3xl font-bold text-gray-600">{report.audience_segmentation.programmed}%</p>
              </div>
            </div>
          </section>
        )}

        {report.demographics && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Demographics (28 días)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Gender</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Female</p>
                    <p className="text-2xl font-bold text-black">{report.demographics.gender.female}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Male</p>
                    <p className="text-2xl font-bold text-black">{report.demographics.gender.male}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Non-binary</p>
                    <p className="text-2xl font-bold text-black">{report.demographics.gender.non_binary}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Not specified</p>
                    <p className="text-2xl font-bold text-black">{report.demographics.gender.not_specified}%</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Age Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(report.demographics.age_pct).map(([age, pct]) => (
                    <div key={age} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">{age}</p>
                      <p className="text-2xl font-bold text-black">{pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Streaming Trends
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            TikTok Trends
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            US Weekly Album Sales Updates
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Total MV Views
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Spotify Streams (totales por canción)
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Members' IG Weekly Social Growth
          </h2>
          <p className="text-gray-600 italic">No data this week</p>
        </section>

        <section className="section page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Sources
          </h2>
          {report.artist === 'SANTOS BRAVOS' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Instagram Insights (CSVs)</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Seguidores (28 días)</li>
                  <li>Visitas al perfil (28 días)</li>
                  <li>Interacciones totales (28 días)</li>
                  <li>Clics en el enlace de la biografía (28 días)</li>
                  <li>Alcance de cuentas (28 días)</li>
                  <li>Visualizaciones de contenido (28 días)</li>
                </ul>
              </li>
              <li>
                <strong>Spotify for Creators — Santos Bravos</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Overview (últimos 30 días): 946.4K reproducciones, 28,531 horas, +1,030 seguidores</li>
                  <li>Audience (últimos 7 días): género y edades (62.6% mujeres, pico 45-59)</li>
                  <li>Top Countries (últimos 7 días): México, Argentina, España</li>
                </ul>
              </li>
              <li>
                <strong>Instagram — Capturas de comentarios</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Comentario 1: "mi primera vez cantando 'toca la puerta'… en vivo…"</li>
                  <li>Comentario 2: "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS…"</li>
                </ul>
              </li>
              <li>
                <strong>TikTok Studio Overview (CSV, 28 días)</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Overview.csv: Video views, Profile views, Likes, Comments, Shares</li>
                  <li>Datos diarios permitiendo identificar pico del 25 de septiembre</li>
                  <li>Comparativas semanales (7d vs 7d)</li>
                </ul>
              </li>
              <li>
                <strong>Otros (Billboard/Apple/Shazam/Luminate):</strong> No data esta semana.
              </li>
            </ul>
          ) : report.artist === 'MAGNA' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Instagram @m4gna</strong> — Post aniversario + promo -50% (839 likes, ~5d), Reel "Deja de hablar" (386 likes, ~1w)
              </li>
              <li>
                <strong>Spotify for Artists</strong> — Top Countries, Top Cities, Demographics, Audience Segments (últimos 28 días)
              </li>
              <li>
                <strong>Chartmetric</strong> — Playlist adds & stats (semana al 2025-10-08)
              </li>
              <li>
                <strong>Luminate</strong> — Entradas/posiciones (sin novedades esta semana)
              </li>
            </ul>
          ) : report.artist === 'GREGORIO' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Spotify for Artists</strong> — Segments, Demographics, Location, Release engagement (últimos 28 días)
              </li>
              <li>
                <strong>Instagram @gregorio_umana</strong> — Posts: "Toca La Puerta (en vivo)" y "con Santos Bravos"
              </li>
              <li>
                <strong>Chartmetric</strong> — Playlist adds & stats (pending)
              </li>
              <li>
                <strong>Luminate</strong> — Entradas/posiciones (pending)
              </li>
              <li>
                <strong>Meltwater</strong> — Social media insights (pending)
              </li>
            </ul>
          ) : report.artist === 'DESTINO' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Spotify for Artists</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Audience Overview (28 días): listeners, streams, streams/listener, saves, playlist adds</li>
                  <li>Segments: active (27%), programmed (73%), previously active (0%)</li>
                  <li>Demographics: gender distribution and age breakdown</li>
                  <li>Location: Top Countries (México, Estados Unidos, Guatemala) and Top Cities (CDMX, Guadalajara, Puebla)</li>
                  <li>Release Engagement: Máquina Del Tiempo (90.3% of active audience streamed intentionally in first 28 days)</li>
                </ul>
              </li>
              <li>
                <strong>Facebook Insights</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Video views (28 días con picos semanales)</li>
                  <li>Viewers/Reach (28 días con comparaciones WoW)</li>
                  <li>Interacciones (engagement metrics)</li>
                  <li>Visitas al perfil</li>
                  <li>Clics en enlace</li>
                  <li>Crecimiento de seguidores (+1,161 en 28 días)</li>
                </ul>
              </li>
              <li>
                <strong>Instagram Insights (CSVs)</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Alcance (1).csv — Alcance de 7 días con comparación WoW</li>
                  <li>Visualizaciones (3).csv — Reproducciones de video de 7 días</li>
                  <li>Visitas (2).csv — Visitas al perfil de 7 días</li>
                  <li>Clics en el enlace (2).csv — Clics en enlaces de 7 días</li>
                  <li>Interacciones (3).csv — Interacciones totales de 7 días</li>
                  <li>Seguidores (3).csv — Crecimiento de seguidores de 7 días</li>
                </ul>
              </li>
              <li>
                <strong>Otros (Billboard/Apple/Shazam/Luminate/TikTok):</strong> No data esta semana.
              </li>
            </ul>
          ) : (
            <p className="text-gray-600 italic">No sources listed</p>
          )}
        </section>
      </div>

      <div className="print-footer"></div>
    </div>
  )
}
