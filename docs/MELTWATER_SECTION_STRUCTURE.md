# PR (Meltwater) Section - Estructura HTML

## Descripción General
Esta sección muestra métricas de Meltwater (prensa y menciones) dividida en tres partes:
1. **KPIs principales** (Reach, Avg. Engagement, Views, Mentions)
2. **Top Countries y Top Cities** (desplegables)
3. **Most Relevant News** (solo si hay artículos en la base de datos)

---

## Fuente de Datos

### Tabla: `reportes_meltwater_data`
```sql
SELECT
  reach,              -- Alcance
  avarage,            -- Promedio de engagement
  views,              -- Vistas totales
  total_menciones,    -- Total de menciones
  pais_top1,          -- País #1
  pais_top2,          -- País #2
  pais_top3,          -- País #3
  pais_top4,          -- País #4
  pais_top5,          -- País #5
  ciudad_top1,        -- Ciudad #1
  ciudad_top2,        -- Ciudad #2
  ciudad_top3,        -- Ciudad #3
  ciudad_top4,        -- Ciudad #4
  ciudad_top5         -- Ciudad #5
FROM reportes_meltwater_data
WHERE entidad_id = '[ENTITY_ID]';
```

### Tabla: `reportes_items` (para noticias)
```sql
SELECT
  titulo,      -- Titular de la noticia
  texto,       -- Descripción/extracto
  link_url,    -- URL de la noticia
  url,         -- URL alternativa
  categoria,   -- 'pr', 'pr_us', o 'pr_kr'
  posicion     -- Orden
FROM reportes_items
WHERE entidad_id = '[ENTITY_ID]'
  AND categoria IN ('pr', 'pr_us', 'pr_kr')
ORDER BY posicion;
```

---

## Estructura HTML

### 1. Contenedor Principal
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
  <!-- Contenido aquí -->
</div>
```

### 2. Grid de KPIs Principales (SIEMPRE MOSTRAR SI HAY DATOS)

```html
<div class="grid grid-cols-4 gap-3">
  <!-- KPI 1: Reach -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-gray-600">Reach</span>
      <!-- Icono opcional -->
    </div>
    <div class="text-xl font-bold text-black">8.9M</div>
  </div>

  <!-- KPI 2: Avg. Engagement -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-gray-600">Avg. Engagement</span>
    </div>
    <div class="text-xl font-bold text-black">7.2K</div>
  </div>

  <!-- KPI 3: Views -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-gray-600">Views</span>
    </div>
    <div class="text-xl font-bold text-black">15.7M</div>
  </div>

  <!-- KPI 4: Mentions -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-gray-600">Mentions</span>
    </div>
    <div class="text-xl font-bold text-black">1245</div>
  </div>
</div>
```

### 3. Top Countries y Top Cities (SIEMPRE MOSTRAR SI HAY DATOS)

```html
<div class="grid grid-cols-2 gap-3">
  <!-- Top Countries -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between cursor-pointer">
      <span class="text-sm font-semibold text-black">Top Countries</span>
      <!-- Icono de chevron opcional -->
    </div>
    <div class="mt-3 space-y-2">
      <!-- País 1 -->
      <div class="flex items-center gap-2">
        <span class="text-lg">🇲🇽</span>
        <span class="text-sm text-gray-700">Mexico</span>
      </div>

      <!-- País 2 -->
      <div class="flex items-center gap-2">
        <span class="text-lg">🇨🇴</span>
        <span class="text-sm text-gray-700">Colombia</span>
      </div>

      <!-- Más países... (hasta 5) -->
    </div>
  </div>

  <!-- Top Cities -->
  <div class="bg-white border border-gray-200 rounded-lg p-3">
    <div class="flex items-center justify-between cursor-pointer">
      <span class="text-sm font-semibold text-black">Top Cities</span>
    </div>
    <div class="mt-3 space-y-2">
      <!-- Ciudad 1 -->
      <div class="flex items-center gap-2">
        <span class="text-lg">🏙️</span>
        <span class="text-sm text-gray-700">Mexico City</span>
      </div>

      <!-- Ciudad 2 -->
      <div class="flex items-center gap-2">
        <span class="text-lg">🏙️</span>
        <span class="text-sm text-gray-700">Bogota</span>
      </div>

      <!-- Más ciudades... (hasta 5) -->
    </div>
  </div>
</div>
```

### 4. Most Relevant News (SOLO SI HAY ITEMS)

```html
<h4 class="text-base font-semibold text-black">Most Relevant News</h4>

<div class="space-y-6">
  <!-- General Press (sin categoría específica) -->
  <ul class="space-y-3">
    <li class="flex items-start text-sm">
      <span class="mr-2 text-gray-500">•</span>
      <div class="flex-1">
        <!-- Título con link -->
        <div class="font-medium text-black mb-1">
          <a
            href="https://example.com/article"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-blue-600"
          >
            Article Title Here
          </a>
        </div>
        <!-- Descripción -->
        <div class="text-gray-700">Article description or excerpt</div>
      </div>
    </li>

    <!-- Más artículos... -->
  </ul>

  <!-- US Press (categoria = 'pr_us') -->
  <div>
    <h4 class="text-sm font-semibold text-gray-700 mb-3">US Press</h4>
    <ul class="space-y-2">
      <!-- Artículos de US Press -->
    </ul>
  </div>

  <!-- KR Press (categoria = 'pr_kr') -->
  <div>
    <h4 class="text-sm font-semibold text-gray-700 mb-3">KR Press</h4>
    <ul class="space-y-2">
      <!-- Artículos de KR Press -->
    </ul>
  </div>
</div>
```

---

## Emojis de Países

```javascript
const countryEmojis = {
  'South Korea': '🇰🇷',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'Japan': '🇯🇵',
  'Chile': '🇨🇱',
  'Argentina': '🇦🇷',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Philippines': '🇵🇭',
  'Thailand': '🇹🇭',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Taiwan': '🇹🇼',
  'China': '🇨🇳',
  'Vietnam': '🇻🇳',
  'India': '🇮🇳'
};
```

Si no hay emoji para un país, usar: `'🌍'`

---

## Formateo de Números

Misma función que YouTube:

```javascript
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
```

**Ejemplos:**
- `8945000` → `"8.9M"`
- `7182` → `"7.2K"`
- `15680000` → `"15.7M"`
- `1245` → `"1245"`

---

## Ejemplo Completo de HTML Generado

```html
<div class="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
  <!-- KPIs principales -->
  <div class="grid grid-cols-4 gap-3">
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-600">Reach</span>
      </div>
      <div class="text-xl font-bold text-black">8.9M</div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-600">Avg. Engagement</span>
      </div>
      <div class="text-xl font-bold text-black">7.2K</div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-600">Views</span>
      </div>
      <div class="text-xl font-bold text-black">15.7M</div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-600">Mentions</span>
      </div>
      <div class="text-xl font-bold text-black">1245</div>
    </div>
  </div>

  <!-- Top Countries y Cities -->
  <div class="grid grid-cols-2 gap-3">
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between cursor-pointer">
        <span class="text-sm font-semibold text-black">Top Countries</span>
      </div>
      <div class="mt-3 space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">🇲🇽</span>
          <span class="text-sm text-gray-700">Mexico</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🇨🇴</span>
          <span class="text-sm text-gray-700">Colombia</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🇺🇸</span>
          <span class="text-sm text-gray-700">USA</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🇦🇷</span>
          <span class="text-sm text-gray-700">Argentina</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🇪🇸</span>
          <span class="text-sm text-gray-700">Spain</span>
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between cursor-pointer">
        <span class="text-sm font-semibold text-black">Top Cities</span>
      </div>
      <div class="mt-3 space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">🏙️</span>
          <span class="text-sm text-gray-700">Mexico City</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🏙️</span>
          <span class="text-sm text-gray-700">Bogota</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🏙️</span>
          <span class="text-sm text-gray-700">Los Angeles</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🏙️</span>
          <span class="text-sm text-gray-700">Buenos Aires</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🏙️</span>
          <span class="text-sm text-gray-700">Madrid</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Most Relevant News (solo si hay items) -->
  <h4 class="text-base font-semibold text-black">Most Relevant News</h4>

  <div class="space-y-6">
    <ul class="space-y-3">
      <li class="flex items-start text-sm">
        <span class="mr-2 text-gray-500">•</span>
        <div class="flex-1">
          <div class="font-medium text-black mb-1">
            <a
              href="https://example.com/article"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600"
            >
              Major Music Magazine Features Artist
            </a>
          </div>
          <div class="text-gray-700">
            The artist was featured in a prominent music magazine discussing their latest release.
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
```

---

## Campos de la Base de Datos

### `reportes_meltwater_data`
| Campo | Tipo | Descripción | Formato |
|-------|------|-------------|---------|
| `reach` | bigint | Alcance total | Compact (K/M) |
| `avarage` | numeric | Promedio de engagement | Compact (K/M) |
| `views` | bigint | Vistas totales | Compact (K/M) |
| `total_menciones` | integer | Total de menciones | Sin formato |
| `pais_top1` - `pais_top5` | text | Top 5 países | Con emoji |
| `ciudad_top1` - `ciudad_top5` | text | Top 5 ciudades | Con emoji 🏙️ |

### `reportes_items` (categoria = 'pr', 'pr_us', 'pr_kr')
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `titulo` | text | Titular de la noticia |
| `texto` | text | Descripción o extracto |
| `link_url` | text | URL de la noticia (primaria) |
| `url` | text | URL alternativa |
| `categoria` | text | Tipo: 'pr', 'pr_us', 'pr_kr' |
| `posicion` | integer | Orden en la lista |

---

## Reglas Importantes

1. **SIEMPRE mostrar los KPIs** si hay datos en `reportes_meltwater_data`
2. **SIEMPRE mostrar Top Countries/Cities** si hay datos (al menos mostrar los primeros 2)
3. **SOLO mostrar "Most Relevant News"** si hay items en `reportes_items` con categorías 'pr', 'pr_us', 'pr_kr'
4. **Categorías de noticias:**
   - Sin categoría o `categoria = 'pr'` → General Press (lista principal)
   - `categoria = 'pr_us'` → US Press (subsección)
   - `categoria = 'pr_kr'` → KR Press (subsección)
5. **Links en noticias**: intentar `link_url` primero, luego `url` como alternativa
6. **Emojis de países**: usar el mapa de emojis, si no existe usar 🌍
7. **Emojis de ciudades**: siempre usar 🏙️

---

## Casos Especiales

### Solo tiene KPIs y geo data, sin noticias
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-3">...</div>

  <!-- Top Countries/Cities -->
  <div class="grid grid-cols-2 gap-3">...</div>

  <!-- NO incluir sección de noticias -->
</div>
```

### Tiene todo
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl p-6 space-y-6">
  <!-- KPIs -->
  <div class="grid grid-cols-4 gap-3">...</div>

  <!-- Top Countries/Cities -->
  <div class="grid grid-cols-2 gap-3">...</div>

  <!-- Noticias -->
  <h4 class="text-base font-semibold text-black">Most Relevant News</h4>
  <div class="space-y-6">...</div>
</div>
```

### Noticia sin título
```html
<li class="flex items-start text-sm">
  <span class="mr-2 text-gray-500">•</span>
  <div class="flex-1">
    <!-- Sin div de título, solo descripción -->
    <div class="text-gray-700">Article description only</div>
  </div>
</li>
```
