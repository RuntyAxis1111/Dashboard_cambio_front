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
  fan_sentiment: `(social media pending)`,
  highlights: [
    'Weekly streams: 10,060 (+131% WoW)',
    'Weekly listeners: 6,336 (+74% WoW)',
    'Streams por oyente: 1.59 (+33% WoW)',
    'Seguidores netos: +42 (+5% vs PW)',
    '"Boujee" añadió playlists clave: All New Latin (Spotify), Cha Cha Cha Top 100, Lanzamientos de la Semana, Crema Scoops Of The Week (Oct 3–4)',
    'Release engagement: 476 (6.3%) of 7,533 active listeners streamed "Boujee" in the first 8 days'
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
      track: 'Markets (S4A, 28 days)',
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
  fan_sentiment: `This week's takeaways (social media pending):

• Overall tone: Very positive (celebration, gratitude, closeness). No relevant negative signals.

• Themes:
  - Milestone: 1st album anniversary
  - -50% promo on merch/vinyl with shipping to MX/CO/US
  - Emotional connection with "Deja de hablar" (sing-along, community)

• Pull-quotes (sample):
  - "Ese álbum es pura magia, lo amo tanto 💙"
  - "Además tiene mi canción favorita en el mundo!!!!"
  - "La vida suena muy linda contigooo 🩷"
  - "Qué lindo @c2abadp 😍"

• Suggested actions:
  - Pin/reuse the -50% post and push it in stories with link sticker to itsmagna.com (MX/CO/US)
  - Repost sing-along clips of "Deja de hablar" (IG Reels/TikTok) with CTA to Save the track
  - Add UTM (e.g. ?utm_source=ig&utm_campaign=aniv50) to measure traffic to merch`,
  highlights: [
    'Album anniversary (+almost 5M streams) and -50% promo on vinyl/merch at itsmagna.com (shipping to MX/CO/US)',
    'Intimate/UGC content from "Deja de hablar" generated high affinity and positive comments (see Fan Sentiment)',
    'Strong markets 28d (S4A): Mexico (82.7K), Colombia (46.9K), US (39.8K)',
    'Key cities 28d: CDMX (23.4K), Bogotá (21.5K), Lima (9.7K)',
    'Total audience 28d (S4A): 1,576,299 (New Actives 22,481)',
    'Demographics 28d: 51% female, peak 25–34 (45%)',
    'Luminate: no verified entries this week (No data)'
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

• Overall tone: Very positive (live performance + collaboration).

• What works: short reels with large captions; collaborations/remixes.

• Top fan comments highlight the live performance and demand for collaboration with Santos Bravos.

• Instagram: CTR link-in-bio 19.6%, engagement/reach 11.6%, views per reach 3.13. Reels with hook <3s + large captions concentrate interaction.`,
  highlights: [
    'TikTok (28d): Comments 38K (+103.5%), Shares 52K (+255.6%) — strong surge in conversation and high organic momentum.',
    'Key TikTok post: "La química se baila…" — 30K views, 491 comments (most commented recently). Peak: Sep 25–27; then stabilization.',
    'Instagram: CTR link-in-bio 19.6%, engagement/reach 11.6%, views per reach 3.13. Reels with hook <3s + large captions concentrate interaction.',
    'Spotify for Creators (last 30 days): 946.4K streams, 28,531 hours consumed, +1,030 followers.',
    'Top countries (7 days, Spotify): Mexico, Argentina, Spain.',
    'Spotify demographics: 62.6% female, 31.4% male, 1.6% non-binary, 4.4% unspecified; age peak 45–59; also strong 23–27 and 18–22.'
  ],
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [
    {
      track: 'YouTube (last 7 days)',
      bullets: [
        '3.5M views (+122% WoW) · 113.3K hours watch time (-19% WoW) · +32.6K subs',
        'Top en 48h: Kenneth "Cuando estoy…" 236K, Kenneth el más pequeño… 225K, EP 3: DINAMITA 197K'
      ]
    },
    {
      track: 'TikTok (last 28 days)',
      bullets: [
        '19M video views (+175.7%) · 2.5M likes (+230%) · 38K comments (+103%) · 52K shares (+255.6%)',
        'Traffic: For You 66%, Profile 19.5%, Search 13.5%',
        'Week\'s featured post: "La química se baila…" ≈ 30K views · 5,372 likes · 491 comments'
      ]
    },
    {
      track: 'Spotify for Creators (last 30 days)',
      bullets: [
        '946.4K streams · 28,531 hours consumed · +1,030 followers'
      ]
    }
  ],
  tiktok_trends: [
    {
      track: 'TikTok Trends (last 28 days)',
      top_posts: [
        'Comments: 38K (+103.5%) — strong surge in conversation.',
        'Peak: Sep 25–27; then stabilization.',
        'Key post: "La química se baila…" — 30K views, 491 comments (most commented recently).',
        'Extra signal: Shares 52K (+255.6%) → high organic momentum.'
      ]
    }
  ],
  mv_views: [
    {
      section: 'YouTube (last 7 days)',
      bullets: [
        '3.5M views (+122% WoW)',
        '113.3K hours watch time (-19% WoW)',
        '+32.6K subscribers (≈ same vs previous week)',
        '$350.84 estimated revenue (+149% WoW)',
        'Realtime (48h): 1.31M views'
      ],
      top_content: [
        'Kenneth: "Cuando estoy en el escenario…" — 236K views',
        'Kenneth el más pequeño… — 225K views',
        'EP 3: DINAMITA — 197K views'
      ]
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
    { rank: 1, country: 'Mexico', listeners: 15738 },
    { rank: 2, country: 'Argentina', listeners: 59 },
    { rank: 3, country: 'Spain', listeners: 52 }
  ]
}

const SAMPLE_GREGORIO: WeeklyReport = {
  artist: 'GREGORIO',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  fan_sentiment: `This week's takeaways (social media pending):

• Overall tone: Very positive (live performance of "Toca La Puerta" and clip with Santos Bravos)

• Themes:
  - "Sounds incredible live"
  - "Powerful performance"
  - "Collaboration/affinity with Santos Bravos"
  - "Anticipation for their debut"

• Pull-quotes (sample):
  - "Eres demasiado!!! Y en vivo eres una locura!!!! Qué buena presentación ✨✨✨✨"
  - "Increíble ❤️😍"
  - "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS CUANDO YA DEBUTEN 🙏🏻"
  - "Me encanta todo lo que está sucediendo acá"`,
  highlights: [
    'Live performance of "Toca La Puerta" and content with Santos Bravos generate high affinity',
    'Total audience (S4A, last 2 years): 95,303',
    'Segmentation (S4A): 3.3% active audience, 4% previously active, 92.6% programmed',
    'Release engagement: "Toca La Puerta" — 977 (34%) of 2,877 active audience listeners intentionally streamed it in the first 28 days',
    'Strong markets 28d (Top-3): Colombia (17,275), Mexico (9,816), United States (9,431)',
    'Key cities 28d (Top-3): Bogotá (8,608), Lima (3,587), Medellín (2,350)',
    'Demographics 28d: 54% female, 41% male, 1% non-binary, 4% not specified. Age peak 25–34 (38%); then 35–44 (29%) and 18–24 (13%)'
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
    'Spotify (28d): 23,728 listeners · 43,520 streams · 1.834 streams/listener · 1,711 saves · 1,635 playlist adds.',
    'Audience quality: 27% active · 73% programmed · 0% previously active → heavy programming dependency.',
    'Release engagement: Máquina Del Tiempo (released 2025-09-10): 5,611 / 6,214 (90.3%) of active audience intentionally streamed in first 28 days.',
    'Top countries (7d, Spotify): Mexico, United States, Guatemala.',
    'Top cities (28d, Spotify): Mexico City, Guadalajara, Puebla.',
    'Facebook (7d vs prev): Video views ↑ +240%; other metrics mixed/declining.',
    'Instagram (7d): Massive reach/video spikes (Oct 5) but low conversion to profile visits and link clicks → focus on CTAs.'
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
  ],
  fan_sentiment: `This week's takeaways:

• Overall tone: Very positive (🔥🙌). No relevant negative signals.
• Demand gen (live): fans asking to see them live; mentions of Arre / Premios Juventud.
• Active nostalgia: #maquinadeltiempo posts trigger affinity ("Los mejores", "Soy fan").

Comment snapshots:`
}

const SAMPLE_MUSZA: WeeklyReport = {
  artist: 'MUSZA',
  week_start: '2025-10-02',
  week_end: '2025-10-08',
  highlights: [
    'Spotify (28d): 30,655 listeners (–7.1% WoW) · 55,257 streams (+16.2%).',
    '7d snapshot: listeners 8,041 (–17.9%), streams 15,350 (–19.2%); followers +5,676 (+9.0%) with peak of 834 on Oct 8.',
    'Audience mix: 22.9% Active · 6.5% Previously Active · 70.6% Programmed → high dependency on playlists/algorithms.',
    'Facebook (7d): post-peak drop: video views 179,918 (↓~67%), viewers 83,890 (↓~70%), interactions 6,872 (↓~59%), profile visits 7,684 (↓~57%), link clicks 49 (↓~99%).',
    'Geo focus: MX first (CDMX/GDL/MTY) + pockets in USA (Chicago/Houston/San Antonio).',
    'Action: capitalize on Oct 8 follower boom with CTAs (save/stream) and short clips.'
  ],
  billboard_charts: [],
  spotify_charts: [],
  streaming_trends: [],
  tiktok_trends: [],
  apple_music: [],
  shazam: [],
  spotify_stats: {
    listeners: 30655,
    streams: 55257,
    streams_per_listener: 0,
    saves: 0,
    playlist_adds: 0
  },
  audience_segmentation: {
    active: 22.9,
    previously_active: 6.5,
    programmed: 70.6
  },
  top_countries: [
    { rank: 1, country: 'Mexico', listeners: 10911 },
    { rank: 2, country: 'United States', listeners: 2728 },
    { rank: 3, country: 'Guatemala', listeners: 210 }
  ],
  top_cities: [
    { rank: 1, city: 'Mexico City, MX', listeners: 2140 },
    { rank: 2, city: 'Guadalajara, MX', listeners: 623 },
    { rank: 3, city: 'Monterrey, MX', listeners: 532 }
  ],
  fan_sentiment: `This week's takeaways:

• Overall tone: Strong early excitement; clear demand signals.
• Launch hype: Fans expressing immediate positive reactions ("Ya la tengo en repeat", "Temazo").
• Live demand: Geographic targeting opportunities based on city-specific requests.

Comment snapshots:`
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
  document.body.classList.add('print-mode')
  window.scrollTo(0, 0)
  window.print()
  window.onafterprint = () => {
    document.body.classList.remove('print-mode')
  }
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
    : artistId === 'musza'
    ? SAMPLE_MUSZA
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

      <div className="print-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-black">{report.artist} Weekly Report</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {report.week_start} to {report.week_end} · Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <img
            src={report.artist === 'DESTINO' ? '/assets/image copy copy copy copy copy copy copy copy.png' : report.artist === 'MUSZA' ? '/assets/image copy copy copy copy copy copy copy copy copy.png' : '/assets/pinguinohybe.png'}
            alt="HYBE"
            className="h-8"
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
                        alt="Anniversary post + -50% discount"
                        className="w-full max-w-3xl mx-auto rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image unavailable</p><p class="text-sm mt-2">Anniversary post + -50%</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Image 1:</strong> Anniversary post + -50% — 839 likes — ~5 days ago.
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
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image unavailable</p><p class="text-sm mt-2">Reel "Deja de hablar"</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Image 2:</strong> Reel "Deja de hablar" (sing-along) — 386 likes — ~1 week ago.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'SANTOS BRAVOS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/santos-bravos-comment-2.png"
                        alt="Performance discussion — Iannis vs. Alex"
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
                      <strong>Performance discussion — Iannis vs. Alex</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-1">
                      "I have nothing against Alex… I choose Iannis… Alex… doesn't have a good voice and the group already has good dancers…"
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      <strong>Why it matters:</strong> Fans are weighing members' strengths (vocals/dance); guidance for coaching and messaging.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/santos-bravos-comment-1.png"
                        alt="Strong opinions on line distribution"
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
                      <strong>Strong opinions on line distribution</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-1">
                      "IT REALLY BOTHERS ME THAT IANNIS AND KAUÊ SANG SO WELL… I HOPE THEY'RE NOT KEEPING ALEX AND DIEGO JUST FOR THEIR DANCING…"
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      <strong>Why it matters:</strong> High-engagement feedback on fairness/roles; surface this theme in edits and comms.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'SANTOS BRAVOS' && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 page-break-inside-avoid">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram KPIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 page-break-inside-avoid">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">CTR (link-in-bio)</div>
                      <div className="text-3xl font-bold text-purple-600">19.6%</div>
                      <div className="text-xs text-gray-500 mt-2">Link-in-bio click-through rate</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">Engagement / Reach</div>
                      <div className="text-3xl font-bold text-pink-600">11.6%</div>
                      <div className="text-xs text-gray-500 mt-2">Engagement rate over reach</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-600 mb-1">Views per Reach</div>
                      <div className="text-3xl font-bold text-indigo-600">3.13</div>
                      <div className="text-xs text-gray-500 mt-2">Average views per user reached</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-700">
                      <strong>Insight:</strong> Reels with hook &lt;3s + large captions concentrate interactions. Clear spikes — replicate that format.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'DESTINO' && (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200 page-break-inside-avoid">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram KPIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 page-break-inside-avoid">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-600 mb-1">CTR (link-in-bio)</div>
                      <div className="text-3xl font-bold text-blue-600">N/A</div>
                      <div className="text-xs text-gray-500 mt-2">No reliable link CTR from IG data</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-600 mb-1">Engagement / Reach (7d)</div>
                      <div className="text-3xl font-bold text-cyan-600">184</div>
                      <div className="text-xs text-gray-500 mt-2">Interactions (↓ -56.6% WoW)</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-600 mb-1">Views per Reach (proxy)</div>
                      <div className="text-3xl font-bold text-indigo-600">1.18</div>
                      <div className="text-xs text-gray-500 mt-2">3.26M views / 2.75M reach</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Big spikes from Oct 5 content; average depth lower — replicate short reels with large captions + add clear CTAs.
                    </p>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-800">
                      <strong>Mini-insight:</strong> Explosive awareness (reach/video) with weak conversion (profile visits, link clicks). Add CTAs in posts/Stories during peaks.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">IG time-series (last 7 days):</h4>
                    <ul className="text-xs text-gray-700 space-y-1 ml-4">
                      <li><strong>Reach:</strong> 2.75M (↑ +1702%) — peak 455K on Oct 5</li>
                      <li><strong>Video views:</strong> 3.26M (↑ +1047%) — peak 561K on Oct 5</li>
                      <li><strong>Profile visits:</strong> 2,663 (↓ -88.7%)</li>
                      <li><strong>Bio link clicks:</strong> 38 (↓ -97.4%)</li>
                      <li><strong>Followers:</strong> +99 (↓ -75.4% vs prev week)</li>
                    </ul>
                  </div>
                </div>
              )}

              {report.artist === 'MUSZA' && (
                <div className="mt-8 space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border-2 border-orange-200 page-break-inside-avoid">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram KPIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 page-break-inside-avoid">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="text-sm text-gray-600 mb-1">CTR (link-in-bio)</div>
                        <div className="text-3xl font-bold text-orange-600">Pending</div>
                        <div className="text-xs text-gray-500 mt-2">Awaiting 7d data</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="text-sm text-gray-600 mb-1">Engagement / Reach</div>
                        <div className="text-3xl font-bold text-amber-600">Pending</div>
                        <div className="text-xs text-gray-500 mt-2">Awaiting 7d data</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="text-sm text-gray-600 mb-1">Views per Reach</div>
                        <div className="text-3xl font-bold text-red-600">Pending</div>
                        <div className="text-xs text-gray-500 mt-2">Awaiting 7d data</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-orange-100">
                      <p className="text-sm text-gray-700">
                        <strong>Note:</strong> Big reach spikes; ensure CTAs on peak days.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 page-break-inside-avoid">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Insights</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Video views (7d)</div>
                        <div className="text-2xl font-bold text-gray-900">179,918</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~67% vs prev</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Viewers (7d)</div>
                        <div className="text-2xl font-bold text-gray-900">83,890</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~70% vs prev</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Interactions (7d)</div>
                        <div className="text-2xl font-bold text-gray-900">6,872</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~59% vs prev</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Profile visits (7d)</div>
                        <div className="text-2xl font-bold text-gray-900">7,684</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~57% vs prev</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Link clicks (7d)</div>
                        <div className="text-2xl font-bold text-gray-900">49</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~99% vs prev</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Followers (net)</div>
                        <div className="text-2xl font-bold text-gray-900">+944</div>
                        <div className="text-xs text-red-600 mt-1">↓ ~38% vs prev</div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">28d peaks:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li><strong>Views:</strong> 116,280 (Sep 23)</li>
                        <li><strong>Viewers:</strong> 68,297 (Sep 23)</li>
                        <li><strong>Interactions:</strong> 3,558 (Sep 25)</li>
                        <li><strong>Visits:</strong> 4,263 (Sep 24)</li>
                        <li><strong>Link clicks:</strong> 851 (Sep 29)</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
                      <p className="text-sm text-gray-700">
                        <strong>Micro-insight:</strong> Post-launch drop after Sep 23–29 spike — add strong CTAs to convert awareness to visits/clicks.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {report.artist === 'GREGORIO' && (
                <div className="space-y-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/gregorio-santos-bravos.png"
                        alt="Post with Santos Bravos"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image unavailable</p><p class="text-sm mt-2">Post with Santos Bravos</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Image 1:</strong> Post with Santos Bravos — "UNA CANCIÓN ASÍ LES QUEDARÍA PERFECTO A SANTOS BRAVOS CUANDO YA DEBUTEN" — ~3 weeks.
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
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image unavailable</p><p class="text-sm mt-2">Toca La Puerta (live)</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center italic">
                      <strong>Image 2:</strong> My first time singing "Toca La Puerta" (live) — "Eres demasiado!!! Y en vivo eres una locura!!!! Qué buena presentación" — ~2 days.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'DESTINO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/destino-comment-1.png"
                        alt="Instagram - #maquinadeltiempo"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">destino-comment-1.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Instagram — #maquinadeltiempo</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-2">
                      "Los mejores", "Soy fan!!!", 🔥🔥🔥
                    </p>
                    <p className="text-xs font-semibold text-gray-800 text-center mt-3">
                      Why it matters:
                    </p>
                    <p className="text-xs text-gray-600 text-center">
                      Nostalgia & loyalty signal. Fans express strong affinity and positive sentiment toward the concept/era.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/destino-comment-2.png"
                        alt="Instagram - Live performance hype (Arre / Premios Juventud)"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">destino-comment-2.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Instagram — Live performance hype (Arre / Premios Juventud)</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-2">
                      "Qué chingón se vivió eso", "Ya cuento los días para verlos en Arre"
                    </p>
                    <p className="text-xs font-semibold text-gray-800 text-center mt-3">
                      Why it matters:
                    </p>
                    <p className="text-xs text-gray-600 text-center">
                      Clear demand for live shows; comments point to anticipation and sustained hype.
                    </p>
                  </div>
                </div>
              )}

              {report.artist === 'MUSZA' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/musza-comment-1.png"
                        alt="Instagram - Launch hype"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">musza-comment-1.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Instagram — Launch hype</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-2">
                      "🔥🔥🔥", "Ya la tengo en repeat", "Temazo"
                    </p>
                    <p className="text-xs font-semibold text-gray-800 text-center mt-3">
                      Why it matters:
                    </p>
                    <p className="text-xs text-gray-600 text-center">
                      Early excitement → opportunity to convert awareness into saves/streams.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      <img
                        src="/assets/musza-comment-2.png"
                        alt="Instagram - Live demand"
                        className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'bg-gray-200 h-96 flex items-center justify-center text-gray-500';
                          placeholder.innerHTML = '<div class="text-center"><p class="text-lg font-semibold">Image pending</p><p class="text-sm mt-2">musza-comment-2.png</p></div>';
                          target.parentElement?.appendChild(placeholder);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      <strong>Instagram — Live demand</strong>
                    </p>
                    <p className="text-xs text-gray-600 text-center italic mt-2">
                      "¿Cuándo vienen a [CDMX/GDL]?", "Necesitamos show"
                    </p>
                    <p className="text-xs font-semibold text-gray-800 text-center mt-3">
                      Why it matters:
                    </p>
                    <p className="text-xs text-gray-600 text-center">
                      Local demand signals; useful for content targeting and advertising.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}


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
          <section className="section page-break page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Top Countries (last 28 days)
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
              Top Cities (last 28 days)
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
              Spotify for Artists — Stats (last 28 days)
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
                <p className="text-sm text-gray-600 mb-1">Active</p>
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
            {report.artist === 'DESTINO' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> High programming share — invest in converting programmed to active with tailored release content & library education.
                </p>
              </div>
            )}
            {report.artist === 'MUSZA' && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> High programming share (70.6%) — convert to Active with CTAs & library education.
                </p>
              </div>
            )}
          </section>
        )}

        {report.artist !== 'DESTINO' && report.artist !== 'MUSZA' && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Streaming Trends
            </h2>
            {report.streaming_trends && report.streaming_trends.length > 0 ? (
              <div className="space-y-6">
                {report.streaming_trends.map((trend, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900 mb-2">{trend.track}</h3>
                    {trend.bullets && trend.bullets.length > 0 && (
                      <ul className="space-y-1 list-disc list-inside text-gray-900">
                        {trend.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">Social media pending</p>
            )}
          </section>
        )}

        {report.artist !== 'DESTINO' && report.artist !== 'MUSZA' && (
          <section className="section page-break page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              TikTok Trends
            </h2>
            {report.tiktok_trends && report.tiktok_trends.length > 0 ? (
              <div className="space-y-4">
                {report.tiktok_trends.map((trend, idx) => (
                  <div key={idx}>
                    {trend.track && <h3 className="font-semibold text-gray-900 mb-2">{trend.track}</h3>}
                    {trend.top_posts && trend.top_posts.length > 0 && (
                      <ul className="space-y-1 list-disc list-inside text-gray-900">
                        {trend.top_posts.map((post, pIdx) => (
                          <li key={pIdx}>{post}</li>
                        ))}
                      </ul>
                    )}
                    {trend.note && (
                      <p className="text-sm text-gray-700 italic mt-2">{trend.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">Social media pending</p>
            )}
          </section>
        )}

        {report.artist !== 'DESTINO' && report.artist !== 'MUSZA' && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Total MV Views
            </h2>
            {report.mv_views && report.mv_views.length > 0 ? (
              <div className="space-y-6">
                {report.mv_views.map((mv, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900 mb-3">{mv.section}</h3>
                    {mv.bullets && mv.bullets.length > 0 && (
                      <ul className="space-y-1 list-disc list-inside text-gray-900 mb-4">
                        {mv.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                    {mv.top_content && mv.top_content.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Top contenidos (48h)</h4>
                        <ul className="space-y-1 list-disc list-inside text-gray-900">
                          {mv.top_content.map((content, cIdx) => (
                            <li key={cIdx}>{content}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">Social media pending</p>
            )}
          </section>
        )}

        {report.demographics && (
          <section className="section page-break-inside-avoid">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
              Demographics (last 28 days)
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

        <section className="section page-break page-break-inside-avoid">
          <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-900">
            Sources
          </h2>
          {report.artist === 'SANTOS BRAVOS' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Instagram Insights (CSVs)</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Followers (28 days)</li>
                  <li>Profile visits (28 days)</li>
                  <li>Total interactions (28 days)</li>
                  <li>Bio link clicks (28 days)</li>
                  <li>Accounts reached (28 days)</li>
                  <li>Content views (28 days)</li>
                </ul>
              </li>
              <li>
                <strong>Spotify for Creators — Santos Bravos</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Overview (last 30 days): 946.4K streams, 28,531 hours, +1,030 followers</li>
                  <li>Audience (last 7 days): gender and ages (62.6% female, peak 45-59)</li>
                  <li>Top Countries (last 7 days): Mexico, Argentina, Spain</li>
                </ul>
              </li>
              <li>
                <strong>Instagram — Comment captures</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Comment 1: "I have nothing against Alex… I choose Iannis… Alex… doesn't have a good voice and the group already has good dancers…"</li>
                  <li>Comment 2: "IT REALLY BOTHERS ME THAT IANNIS AND KAUÊ SANG SO WELL… I HOPE THEY'RE NOT KEEPING ALEX AND DIEGO JUST FOR THEIR DANCING…"</li>
                </ul>
              </li>
              <li>
                <strong>TikTok Studio Overview (CSV, 28 days)</strong>
                <ul className="ml-6 mt-1 space-y-1 list-none text-sm text-gray-700">
                  <li>Overview.csv: Video views, Profile views, Likes, Comments, Shares</li>
                  <li>Daily data allowing identification of September 25 peak</li>
                  <li>Weekly comparisons (7d vs 7d)</li>
                </ul>
              </li>
              <li>
                <strong>Other (Billboard/Apple/Shazam/Luminate):</strong> Social media pending.
              </li>
            </ul>
          ) : report.artist === 'MAGNA' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Instagram @m4gna</strong> — Anniversary post + -50% promo (839 likes, ~5d), Reel "Deja de hablar" (386 likes, ~1w)
              </li>
              <li>
                <strong>Spotify for Artists</strong> — Top Countries, Top Cities, Demographics, Audience Segments (last 28 days)
              </li>
              <li>
                <strong>Chartmetric</strong> — Playlist adds & stats (week of 2025-10-08)
              </li>
              <li>
                <strong>Luminate</strong> — Entries/positions (no updates this week)
              </li>
            </ul>
          ) : report.artist === 'GREGORIO' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Spotify for Artists</strong> — Segments, Demographics, Location, Release engagement (last 28 days)
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
                <strong>Spotify for Artists:</strong> Audience Overview (28d); Segments (active 27%, programmed 73%, previously active 0%); Demographics; Top Countries/Cities; Release Engagement (Máquina Del Tiempo — 90.3% intentional within first 28 days).
              </li>
              <li>
                <strong>Facebook Insights (7d/28d CSVs):</strong> Video views (↑ +240% WoW, peak Oct 5: 796,121); Viewers/Reach (↓ -51% WoW, peak Sep 30: 467,677); Interactions (↓ -87% WoW, peak Sep 14: 3,865); Profile visits (↓ -76% WoW, peak Sep 26: 1,271); Link clicks (weekly low; last high Sep 27: 5,750); Followers +1,161 (28d); best day Sep 14 (+158).
              </li>
              <li>
                <strong>Instagram Insights (CSVs, last 7d):</strong> Reach 2.75M (↑ +1702%); Video views 3.26M (↑ +1047%); Profile visits 2,663 (↓ -88.7%); Link clicks 38 (↓ -97.4%); Interactions 184 (↓ -56.6%); Followers +99 (↓ -75.4%).
              </li>
              <li>
                <strong>Chartmetric:</strong> Milestone badges (ranking progress); used only for context, not chart placements.
              </li>
            </ul>
          ) : report.artist === 'MUSZA' ? (
            <ul className="space-y-2 list-disc list-inside text-gray-900">
              <li>
                <strong>Spotify for Artists:</strong> Audience timeline (28d/7d), Segments (Active 22.9%, Previously Active 6.5%, Programmed 70.6%), Top countries/cities.
              </li>
              <li>
                <strong>Facebook Insights:</strong> 7d/28d CSVs; peaks Sep 23–29; negative deltas Oct 2–8 (video views ↓~67%, viewers ↓~70%, interactions ↓~59%, profile visits ↓~57%, link clicks ↓~99%).
              </li>
              <li>
                <strong>Instagram Insights:</strong> (Pending) — Reach/Views/Visits/Clicks/Interactions/Followers + CTR & ER.
              </li>
            </ul>
          ) : (
            <p className="text-gray-600 italic">No sources listed</p>
          )}
        </section>
      </div>

      <div className="print-footer">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs">HYBE LATAM Data & AI Lab</span>
          <span className="text-xs">{report.artist} Weekly Report</span>
          <span className="text-xs">Page <span className="page-num"></span></span>
        </div>
      </div>
    </div>
  )
}
