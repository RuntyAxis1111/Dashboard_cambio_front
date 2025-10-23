# DSP Live Growth - Backend Integration Guide

## 📊 Tabla Principal: `reportes_dsp_stbv`

Esta tabla almacena todos los snapshots de métricas DSP. Es donde debes insertar los datos desde n8n o cualquier otro sistema de actualización.

### Estructura de la tabla

```sql
CREATE TABLE reportes_dsp_stbv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES reportes_entidades(id),
  dsp TEXT NOT NULL,  -- 'spotify' | 'apple_music' | 'amazon_music'
  snapshot_ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  followers_total BIGINT,
  monthly_listeners BIGINT,
  streams_total BIGINT,
  rank_country TEXT,
  dsp_artist_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(entity_id, dsp, snapshot_ts)
);
```

### Valores válidos para `dsp`
- `'spotify'` - Spotify
- `'apple_music'` - Apple Music
- `'amazon_music'` - Amazon Music

---

## 🔄 Cómo actualizar los datos (Desde n8n o Backend)

### Opción 1: INSERT directo (Recomendado para n8n)

```sql
INSERT INTO reportes_dsp_stbv (
  entity_id,
  dsp,
  snapshot_ts,
  followers_total,
  monthly_listeners,
  streams_total,
  rank_country,
  dsp_artist_url
) VALUES (
  '74adf60e-c603-406e-90b0-6bb72c9ee1b1',  -- Entity ID (SANTOS BRAVOS)
  'spotify',                                -- DSP name
  NOW(),                                    -- Timestamp actual
  68500,                                    -- Followers
  425000,                                   -- Monthly Listeners
  10900000,                                 -- Total Streams
  'Mexico #142',                            -- Country Rank
  'https://open.spotify.com/artist/...'    -- Artist URL
)
ON CONFLICT (entity_id, dsp, snapshot_ts) DO UPDATE SET
  followers_total = EXCLUDED.followers_total,
  monthly_listeners = EXCLUDED.monthly_listeners,
  streams_total = EXCLUDED.streams_total,
  rank_country = EXCLUDED.rank_country,
  dsp_artist_url = EXCLUDED.dsp_artist_url;
```

### Opción 2: Bulk Insert (Para actualizar múltiples entidades/DSPs)

```sql
INSERT INTO reportes_dsp_stbv (
  entity_id, dsp, snapshot_ts, followers_total, monthly_listeners, streams_total, rank_country, dsp_artist_url
) VALUES
  -- SANTOS BRAVOS - Spotify
  ('74adf60e-c603-406e-90b0-6bb72c9ee1b1', 'spotify', NOW(), 68500, 425000, 10900000, 'Mexico #142', 'https://...'),
  -- SANTOS BRAVOS - Apple Music
  ('74adf60e-c603-406e-90b0-6bb72c9ee1b1', 'apple_music', NOW(), 42300, 285000, 7500000, 'Mexico #189', 'https://...'),
  -- SANTOS BRAVOS - Amazon Music
  ('74adf60e-c603-406e-90b0-6bb72c9ee1b1', 'amazon_music', NOW(), 26800, 165000, 4200000, 'Mexico #205', 'https://...'),
  -- MAGNA - Spotify
  ('eb87856f-b25c-4a42-9c31-b4f24eb12345', 'spotify', NOW(), 52400, 285000, 8700000, 'Mexico #165', 'https://...'),
  -- etc...
ON CONFLICT (entity_id, dsp, snapshot_ts) DO UPDATE SET
  followers_total = EXCLUDED.followers_total,
  monthly_listeners = EXCLUDED.monthly_listeners,
  streams_total = EXCLUDED.streams_total,
  rank_country = EXCLUDED.rank_country,
  dsp_artist_url = EXCLUDED.dsp_artist_url;
```

---

## 📍 IDs de Entidades Actuales

Para saber qué `entity_id` usar en tus inserts:

```sql
SELECT id, nombre, slug
FROM reportes_entidades
WHERE activo = true
ORDER BY nombre;
```

### Entidades actuales:
- **SANTOS BRAVOS**: `74adf60e-c603-406e-90b0-6bb72c9ee1b1`
- **MAGNA**: `eb87856f-b25c-4a42-9c31-b4f24eb12345`
- **LOWCLIKA**: `389bf4cd-7eb5-4ad1-afee-362f230ad2b0`
- **DESTINO**: `4c3c8e68-5eeb-4d65-a2f1-ebc945678def`
- **MUSZA**: `d4b5c3a2-9e8f-4d1c-b2a3-123456789abc`
- **KATSEYE**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **ADRIÁN COTA**: `b2c3d4e5-f6a7-8901-bcde-f12345678901`
- **GREGORIO**: `c3d4e5f6-a7b8-9012-cdef-123456789012`

---

## 🔍 Vistas disponibles para consultar

El frontend usa estas vistas para mostrar los datos:

### 1. `v_dsp_latest` - Datos más recientes por DSP
```sql
SELECT * FROM v_dsp_latest
WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';
```

### 2. `v_dsp_delta_24h` - Cambios en 24 horas
```sql
SELECT * FROM v_dsp_delta_24h
WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';
```

### 3. `v_dsp_delta_7d` - Cambios en 7 días
```sql
SELECT * FROM v_dsp_delta_7d
WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';
```

### 4. `v_dsp_timeseries_30d` - Serie temporal últimos 30 días
```sql
SELECT * FROM v_dsp_timeseries_30d
WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1'
ORDER BY snapshot_ts DESC;
```

---

## 🤖 Ejemplo de workflow n8n

### Paso 1: Obtener datos de Chartmetric API
```javascript
// HTTP Request node
URL: https://api.chartmetric.com/api/artist/{{artistId}}/spotify-metrics
Method: GET
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

### Paso 2: Transformar datos
```javascript
// Function node
const entityId = '74adf60e-c603-406e-90b0-6bb72c9ee1b1'; // SANTOS BRAVOS
const dsp = 'spotify';

return {
  entity_id: entityId,
  dsp: dsp,
  snapshot_ts: new Date().toISOString(),
  followers_total: items[0].json.followers,
  monthly_listeners: items[0].json.monthly_listeners,
  streams_total: items[0].json.total_streams,
  rank_country: items[0].json.rank?.country || null,
  dsp_artist_url: items[0].json.artist_url
};
```

### Paso 3: Insertar en Supabase
```javascript
// Supabase node
Table: reportes_dsp_stbv
Operation: Insert
Options: {
  upsert: true,
  onConflict: 'entity_id,dsp,snapshot_ts'
}
```

---

## 📅 Frecuencia de actualización recomendada

- **Cada 15 minutos**: Para métricas en tiempo real
- **Cada hora**: Para balance entre actualidad y carga
- **Cada 6 horas**: Para ahorro de API calls

---

## 🎯 Frontend: Cómo se consumen los datos

El frontend automáticamente:

1. **En `/reports/weeklies`** - Lista todas las entidades con datos DSP
2. **En `/weeklies/dsp/{entityId}`** - Muestra el detalle de una entidad:
   - **Highlights**: Suma total de los 3 DSPs con deltas 7d
   - **Platform Breakdown**: Tarjeta individual por cada DSP (Spotify, Apple Music, Amazon Music)

### Query que hace el frontend:

```typescript
// 1. Obtener últimos datos
const { data: latestData } = await supabase
  .from('v_dsp_latest')
  .select('*')
  .eq('entity_id', entityId);

// 2. Obtener cambios 24h
const { data: delta24hData } = await supabase
  .from('v_dsp_delta_24h')
  .select('*')
  .eq('entity_id', entityId);

// 3. Obtener cambios 7d
const { data: delta7dData } = await supabase
  .from('v_dsp_delta_7d')
  .select('*')
  .eq('entity_id', entityId);
```

---

## ⚠️ Consideraciones importantes

1. **Timestamps**: Siempre usa `NOW()` o la hora actual exacta del snapshot
2. **Entity ID**: Debe existir en `reportes_entidades` con `activo = true`
3. **DSP name**: Solo valores válidos: `'spotify'`, `'apple_music'`, `'amazon_music'`
4. **Unique constraint**: La combinación `(entity_id, dsp, snapshot_ts)` debe ser única
5. **Nulls**: Todos los campos numéricos pueden ser NULL si no hay datos disponibles

---

## 🧪 Testing: Insertar datos de prueba

```sql
-- Insertar snapshot actual
INSERT INTO reportes_dsp_stbv (entity_id, dsp, snapshot_ts, followers_total, monthly_listeners, streams_total, rank_country)
VALUES
  ('74adf60e-c603-406e-90b0-6bb72c9ee1b1', 'spotify', NOW(), 70000, 450000, 11000000, 'Mexico #135');

-- Verificar que aparece en la vista
SELECT * FROM v_dsp_latest WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';

-- Verificar deltas
SELECT * FROM v_dsp_delta_24h WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';
SELECT * FROM v_dsp_delta_7d WHERE entity_id = '74adf60e-c603-406e-90b0-6bb72c9ee1b1';
```

---

## 📞 Contacto y soporte

Para agregar nuevas entidades o modificar la estructura, contactar al equipo de desarrollo.

**Última actualización**: Octubre 23, 2025
