# YouTube Performance Section - Estructura HTML

## Descripción General
Esta sección muestra métricas de YouTube dividida en dos partes:
1. **KPIs en tarjetas** (siempre visible si hay datos)
2. **Top 5 Videos** (solo si hay videos en la lista)

---

## Fuente de Datos

### Tabla: `reportes_youtube_general`
```sql
SELECT
  subscribers,
  total_views,
  total_watch_time,
  total_likes,
  total_comments,
  total_monetized
FROM reportes_youtube_general
WHERE entidad_id = '[ENTITY_ID]';
```

### Tabla: `reportes_items` (para videos)
```sql
SELECT
  titulo,      -- Nombre del video
  texto,       -- Descripción (ej: "80,911 views")
  link_url,    -- URL del video
  posicion     -- Orden
FROM reportes_items
WHERE entidad_id = '[ENTITY_ID]'
  AND categoria = 'mv_totales'
ORDER BY posicion;
```

---

## Estructura HTML

### 1. Contenedor Principal
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
  <!-- Contenido aquí -->
</div>
```

### 2. Grid de KPIs (SIEMPRE MOSTRAR SI HAY DATOS)

```html
<div class="p-6">
  <!-- Grid de 5 o 6 columnas dependiendo si total_monetized > 0 -->
  <div class="grid gap-3 mb-6 grid-cols-5">
    <!-- O grid-cols-6 si incluye Total Monetized -->

    <!-- KPI Card 1: Subscribers -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Subscribers</div>
      <div class="text-lg font-semibold text-black">1.7K</div>
    </div>

    <!-- KPI Card 2: Total Views -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Total Views</div>
      <div class="text-lg font-semibold text-black">101.7K</div>
    </div>

    <!-- KPI Card 3: Total Watch Time -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Total Watch Time</div>
      <div class="text-lg font-semibold text-black">64.3K</div>
    </div>

    <!-- KPI Card 4: Total Likes -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Total Likes</div>
      <div class="text-lg font-semibold text-black">79</div>
    </div>

    <!-- KPI Card 5: Total Comments -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Total Comments</div>
      <div class="text-lg font-semibold text-black">1</div>
    </div>

    <!-- KPI Card 6: Total Monetized (SOLO SI > 0) -->
    <div class="bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-xs text-gray-500 mb-1">Total Monetized</div>
      <div class="text-lg font-semibold text-black">1.2M</div>
    </div>
  </div>
</div>
```

### 3. Lista de Videos (SOLO SI HAY ITEMS)

```html
<!-- Título de la sección -->
<h4 class="text-base font-semibold text-black mb-4">
  Top 5 Videos In Youtube Of Last Week
</h4>

<!-- Lista de videos -->
<ul class="space-y-2">
  <!-- Video Item -->
  <li class="flex items-start text-sm">
    <span class="mr-2 text-gray-500">•</span>
    <div class="flex-1">
      <!-- Título del video (opcional, con link si existe) -->
      <div class="font-medium text-black mb-1">
        <a
          href="https://youtube.com/watch?v=..."
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-blue-600"
        >
          Video Title Here
        </a>
      </div>
      <!-- Descripción (views, etc) -->
      <div class="text-gray-700">80,911 views</div>
    </div>
  </li>

  <!-- Repetir para cada video... -->
</ul>
```

---

## Reglas de Formato de Números

Usa esta función para formatear los números de los KPIs:

```javascript
function formatNumberCompact(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}
```

**Ejemplos:**
- `1741` → `"1.7K"`
- `101747` → `"101.7K"`
- `64338` → `"64.3K"`
- `1156000` → `"1.2M"`
- `79` → `"79"`

---

## Ejemplo Completo de HTML Generado

```html
<div class="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
  <div class="p-6">
    <!-- Grid de KPIs: 6 columnas porque tiene Total Monetized -->
    <div class="grid gap-3 mb-6 grid-cols-6">
      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Subscribers</div>
        <div class="text-lg font-semibold text-black">1.7K</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Total Views</div>
        <div class="text-lg font-semibold text-black">101.7K</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Total Watch Time</div>
        <div class="text-lg font-semibold text-black">64.3K</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Total Likes</div>
        <div class="text-lg font-semibold text-black">79</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Total Comments</div>
        <div class="text-lg font-semibold text-black">1</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1">Total Monetized</div>
        <div class="text-lg font-semibold text-black">1.2M</div>
      </div>
    </div>

    <!-- Videos: solo si hay items en reportes_items -->
    <h4 class="text-base font-semibold text-black mb-4">
      Top 5 Videos In Youtube Of Last Week
    </h4>

    <ul class="space-y-2">
      <li class="flex items-start text-sm">
        <span class="mr-2 text-gray-500">•</span>
        <div class="flex-1">
          <div class="font-medium text-black mb-1">
            <a
              href="https://youtube.com/watch?v=abc123"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600"
            >
              Music Video - Official
            </a>
          </div>
          <div class="text-gray-700">80,911 views</div>
        </div>
      </li>

      <li class="flex items-start text-sm">
        <span class="mr-2 text-gray-500">•</span>
        <div class="flex-1">
          <div class="font-medium text-black mb-1">
            Behind the Scenes
          </div>
          <div class="text-gray-700">45,320 views</div>
        </div>
      </li>

      <!-- Más videos... -->
    </ul>
  </div>
</div>
```

---

## Campos de la Base de Datos

### `reportes_youtube_general`
| Campo | Tipo | Descripción | Formato |
|-------|------|-------------|---------|
| `subscribers` | bigint | Suscriptores totales | Compact (K/M) |
| `total_views` | bigint | Vistas totales | Compact (K/M) |
| `total_watch_time` | bigint | Tiempo total de reproducción | Compact (K/M) |
| `total_likes` | bigint | Likes totales | Compact (K/M) |
| `total_comments` | bigint | Comentarios totales | Compact (K/M) |
| `total_monetized` | bigint | Reproducciones monetizadas | Compact (K/M) |

### `reportes_items` (categoria = 'mv_totales')
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `titulo` | text | Título del video |
| `texto` | text | Descripción (ej: "80,911 views") |
| `link_url` | text | URL del video (opcional) |
| `posicion` | integer | Orden en la lista |

---

## Reglas Importantes

1. **SIEMPRE mostrar los KPIs** si hay datos en `reportes_youtube_general`
2. **SOLO mostrar la sección de videos** si hay items en `reportes_items` con `categoria = 'mv_totales'`
3. **Grid cols**: usar `grid-cols-6` si `total_monetized > 0`, sino usar `grid-cols-5`
4. **Total Monetized**: solo incluir este KPI si el valor es mayor a 0
5. **Links en videos**: solo hacer el título clickeable si `link_url` tiene valor
6. **Formateo de números**: usar la función `formatNumberCompact()` para todos los KPIs

---

## Casos Especiales

### Solo tiene KPIs, sin videos
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
  <div class="p-6">
    <div class="grid gap-3 mb-6 grid-cols-5">
      <!-- Solo los KPIs, sin la sección de videos -->
    </div>
  </div>
</div>
```

### Tiene KPIs y videos
```html
<div class="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
  <div class="p-6">
    <div class="grid gap-3 mb-6 grid-cols-5">
      <!-- KPIs -->
    </div>

    <h4 class="text-base font-semibold text-black mb-4">
      Top 5 Videos In Youtube Of Last Week
    </h4>
    <ul class="space-y-2">
      <!-- Videos -->
    </ul>
  </div>
</div>
```

### Video sin título
```html
<li class="flex items-start text-sm">
  <span class="mr-2 text-gray-500">•</span>
  <div class="flex-1">
    <!-- Sin div de título, solo descripción -->
    <div class="text-gray-700">80,911 views</div>
  </div>
</li>
```
