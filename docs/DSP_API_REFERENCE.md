# DSP Live Growth - API Reference

## 📊 REST API Endpoints (Usando Supabase REST API)

Si necesitas consultar o insertar datos desde un backend externo usando HTTP:

### Base URL
```
https://YOUR_SUPABASE_URL.supabase.co/rest/v1
```

### Headers requeridos
```
apikey: YOUR_SUPABASE_ANON_KEY
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
Prefer: return=representation
```

---

## 1️⃣ Insertar datos DSP

### Endpoint
```
POST /reportes_dsp_stbv
```

### Request Body
```json
{
  "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
  "dsp": "spotify",
  "snapshot_ts": "2025-10-23T16:30:00Z",
  "followers_total": 68500,
  "monthly_listeners": 425000,
  "streams_total": 10900000,
  "rank_country": "Mexico #142",
  "dsp_artist_url": "https://open.spotify.com/artist/xyz"
}
```

### cURL Example
```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/reportes_dsp_stbv' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "snapshot_ts": "2025-10-23T16:30:00Z",
    "followers_total": 68500,
    "monthly_listeners": 425000,
    "streams_total": 10900000,
    "rank_country": "Mexico #142",
    "dsp_artist_url": "https://open.spotify.com/artist/xyz"
  }'
```

### Bulk Insert
```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/reportes_dsp_stbv' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '[
    {
      "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
      "dsp": "spotify",
      "snapshot_ts": "2025-10-23T16:30:00Z",
      "followers_total": 68500,
      "monthly_listeners": 425000,
      "streams_total": 10900000
    },
    {
      "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
      "dsp": "apple_music",
      "snapshot_ts": "2025-10-23T16:30:00Z",
      "followers_total": 42300,
      "monthly_listeners": 285000,
      "streams_total": 7500000
    },
    {
      "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
      "dsp": "amazon_music",
      "snapshot_ts": "2025-10-23T16:30:00Z",
      "followers_total": 26800,
      "monthly_listeners": 165000,
      "streams_total": 4200000
    }
  ]'
```

---

## 2️⃣ Consultar últimos datos

### Endpoint
```
GET /v_dsp_latest?entity_id=eq.{entityId}
```

### cURL Example
```bash
curl 'https://YOUR_PROJECT.supabase.co/rest/v1/v_dsp_latest?entity_id=eq.74adf60e-c603-406e-90b0-6bb72c9ee1b1' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Response
```json
[
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "snapshot_ts": "2025-10-23T16:30:00Z",
    "followers_total": 68500,
    "monthly_listeners": 425000,
    "streams_total": 10900000,
    "rank_country": "Mexico #142",
    "dsp_artist_url": "https://..."
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "apple_music",
    "snapshot_ts": "2025-10-23T16:30:00Z",
    "followers_total": 42300,
    "monthly_listeners": 285000,
    "streams_total": 7500000,
    "rank_country": "Mexico #189",
    "dsp_artist_url": "https://..."
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "amazon_music",
    "snapshot_ts": "2025-10-23T16:30:00Z",
    "followers_total": 26800,
    "monthly_listeners": 165000,
    "streams_total": 4200000,
    "rank_country": "Mexico #205",
    "dsp_artist_url": "https://..."
  }
]
```

---

## 3️⃣ Consultar deltas 24h

### Endpoint
```
GET /v_dsp_delta_24h?entity_id=eq.{entityId}
```

### Response
```json
[
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "followers_delta_24h": 700,
    "listeners_delta_24h": 15000,
    "streams_delta_24h": 320000
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "apple_music",
    "followers_delta_24h": 400,
    "listeners_delta_24h": 8500,
    "streams_delta_24h": 180000
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "amazon_music",
    "followers_delta_24h": 300,
    "listeners_delta_24h": 5200,
    "streams_delta_24h": 95000
  }
]
```

---

## 4️⃣ Consultar deltas 7d

### Endpoint
```
GET /v_dsp_delta_7d?entity_id=eq.{entityId}
```

### Response
```json
[
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "followers_delta_7d": 4900,
    "listeners_delta_7d": 98000,
    "streams_delta_7d": 980000
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "apple_music",
    "followers_delta_7d": 2800,
    "listeners_delta_7d": 78500,
    "streams_delta_7d": 550000
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "amazon_music",
    "followers_delta_7d": 2100,
    "listeners_delta_7d": 21000,
    "streams_delta_7d": 340000
  }
]
```

---

## 5️⃣ Consultar serie temporal

### Endpoint
```
GET /v_dsp_timeseries_30d?entity_id=eq.{entityId}&order=snapshot_ts.desc
```

### Response
```json
[
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "snapshot_ts": "2025-10-23T16:30:00Z",
    "followers_total": 68500,
    "monthly_listeners": 425000,
    "streams_total": 10900000
  },
  {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "snapshot_ts": "2025-10-23T00:00:00Z",
    "followers_total": 67800,
    "monthly_listeners": 410000,
    "streams_total": 10580000
  }
  // ... más snapshots históricos
]
```

---

## 6️⃣ Listar todas las entidades con datos DSP

### Endpoint
```
GET /reportes_entidades?activo=eq.true&select=id,nombre,slug,imagen_url
```

### Response
```json
[
  {
    "id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "nombre": "SANTOS BRAVOS",
    "slug": "santos-bravos",
    "imagen_url": "/assets/santos-bravos.png"
  },
  {
    "id": "eb87856f-b25c-4a42-9c31-b4f24eb12345",
    "nombre": "MAGNA",
    "slug": "magna",
    "imagen_url": "/assets/magna.png"
  }
  // ... más entidades
]
```

---

## 🔐 Autenticación

### Service Role Key (Backend/n8n)
Para operaciones desde backend, usa el Service Role Key:

```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

⚠️ **Nunca expongas el Service Role Key en frontend**

### Anon Key (Frontend)
Para operaciones desde frontend, usa el Anon Key (con RLS habilitado):

```
Authorization: Bearer YOUR_ANON_KEY
```

---

## 📝 TypeScript/JavaScript SDK

Si usas JavaScript/TypeScript, puedes usar el SDK de Supabase:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://YOUR_PROJECT.supabase.co',
  'YOUR_ANON_KEY'
)

// Insertar datos
const { data, error } = await supabase
  .from('reportes_dsp_stbv')
  .insert({
    entity_id: '74adf60e-c603-406e-90b0-6bb72c9ee1b1',
    dsp: 'spotify',
    snapshot_ts: new Date().toISOString(),
    followers_total: 68500,
    monthly_listeners: 425000,
    streams_total: 10900000,
    rank_country: 'Mexico #142',
    dsp_artist_url: 'https://...'
  })

// Consultar últimos datos
const { data: latest } = await supabase
  .from('v_dsp_latest')
  .select('*')
  .eq('entity_id', '74adf60e-c603-406e-90b0-6bb72c9ee1b1')

// Consultar deltas 7d
const { data: deltas } = await supabase
  .from('v_dsp_delta_7d')
  .select('*')
  .eq('entity_id', '74adf60e-c603-406e-90b0-6bb72c9ee1b1')
```

---

## 🐍 Python Example

```python
import requests
from datetime import datetime

SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
SUPABASE_KEY = "YOUR_ANON_KEY"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# Insertar datos
data = {
    "entity_id": "74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    "dsp": "spotify",
    "snapshot_ts": datetime.utcnow().isoformat(),
    "followers_total": 68500,
    "monthly_listeners": 425000,
    "streams_total": 10900000,
    "rank_country": "Mexico #142"
}

response = requests.post(
    f"{SUPABASE_URL}/rest/v1/reportes_dsp_stbv",
    headers=headers,
    json=data
)

print(response.json())

# Consultar datos
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/v_dsp_latest?entity_id=eq.74adf60e-c603-406e-90b0-6bb72c9ee1b1",
    headers=headers
)

print(response.json())
```

---

## 📊 Webhook para actualizaciones automáticas

Si quieres recibir notificaciones cuando se insertan nuevos datos:

```sql
-- Crear función para webhook
CREATE OR REPLACE FUNCTION notify_dsp_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'dsp_updated',
    json_build_object(
      'entity_id', NEW.entity_id,
      'dsp', NEW.dsp,
      'snapshot_ts', NEW.snapshot_ts
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
CREATE TRIGGER dsp_update_trigger
AFTER INSERT ON reportes_dsp_stbv
FOR EACH ROW
EXECUTE FUNCTION notify_dsp_update();
```

---

## 🔄 Rate Limits y Best Practices

1. **Batch inserts**: Usa bulk inserts para múltiples registros
2. **Timestamps**: Redondea a minutos para evitar duplicados
3. **Error handling**: Siempre verifica errores en respuestas
4. **Retry logic**: Implementa reintentos con backoff exponencial
5. **Caching**: Cachea entity_ids para evitar queries repetidas

---

**Última actualización**: Octubre 23, 2025
