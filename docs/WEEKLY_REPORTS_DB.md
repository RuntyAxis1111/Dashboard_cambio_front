# Weekly Reports Database Integration

This document describes how to enable database-backed Weekly Reports in the application.

## Overview

The Weekly Reports feature supports three data sources with automatic fallback:

1. **New Schema** (`reports`, `report_sections`, `artistas_registry`) - Primary source
2. **Old Schema** (`spotify_report_weekly`, `spotify_report_sections`) - Fallback
3. **Hardcoded Samples** - Final fallback (always available)

## Quick Start

### Enable Database Integration

Add this to your `.env` file:

```bash
VITE_USE_DB_REPORTS=true
```

Or if migrating to Next.js in the future:

```bash
NEXT_PUBLIC_USE_DB_REPORTS=true
```

### Disable Database Integration (Use Samples Only)

```bash
VITE_USE_DB_REPORTS=false
```

Or simply remove the variable entirely.

## How It Works

### Feature Flag Resolution

The application checks for the feature flag in this order:

1. `VITE_USE_DB_REPORTS` (Vite projects)
2. `NEXT_PUBLIC_USE_DB_REPORTS` (Next.js migration ready)

The flag is active when the value is exactly `"true"` (case-sensitive string).

### Data Source Fallback

When `VITE_USE_DB_REPORTS=true`:

```
┌─────────────────┐
│  Try New Schema │
│  (reports)      │
└────────┬────────┘
         │
         ├─ Has Data? ──> Return Data
         │
         ├─ No Data
         │
┌────────▼────────┐
│  Try Old Schema │
│ (spotify_*)     │
└────────┬────────┘
         │
         ├─ Has Data? ──> Return Data
         │
         ├─ No Data
         │
┌────────▼────────┐
│ Use Samples     │
│ (hardcoded)     │
└─────────────────┘
```

When `VITE_USE_DB_REPORTS=false` or not set:
- Always uses hardcoded samples (current behavior)
- No database queries are made

## Database Schemas

### New Schema (Primary)

#### `artistas_registry`
```sql
- id: integer (PK)
- nombre: text (e.g., "Santos Bravos")
- id_bigquery: text
- id_chartmetric: text
- id_meltwater: text
- created_at, updated_at: timestamp
```

#### `reports`
```sql
- id: bigint (PK)
- report_type: text ('artist' or 'creator')
- template_key: text
- artist_id: bigint (FK to artistas_registry.id)
- week_start: date
- week_end: date
- title: text
- summary_md: text
- raw_json: jsonb
- created_at, updated_at: timestamp

UNIQUE (report_type, artist_id, week_end)
```

#### `report_sections`
```sql
- id: bigint (PK)
- report_id: bigint (FK to reports.id)
- section_key: text (see Section Keys below)
- order_no: integer
- title: text
- content_md: text (NOT NULL, use '' if empty)
- data_json: jsonb
- created_at, updated_at: timestamp

UNIQUE (report_id, section_key)
```

### Old Schema (Fallback)

#### `spotify_report_weekly`
```sql
- report_id: uuid (PK)
- artist_id: text (slug format: 'santos-bravos')
- artist_name: text (uppercase: 'SANTOS BRAVOS')
- week_start, week_end: date
- status: text ('ready' for published reports)
- cover_image_url: text
- ...
```

## Section Keys

The `report_sections.section_key` maps to these Weekly Report fields:

| section_key | Maps To | data_json Structure |
|-------------|---------|---------------------|
| `highlights` | `highlights[]` | `{ bullets: string[] }` |
| `fan_sentiment` | `fan_sentiment` | Use `content_md` field |
| `billboard_charts` | `billboard_charts[]` | `{ charts: BillboardChartRow[] }` |
| `spotify_charts` | `spotify_charts[]` | `{ charts: SpotifyChartRow[] }` |
| `streaming_trends` | `streaming_trends[]` | `{ trends: StreamingTrend[] }` |
| `tiktok_trends` | `tiktok_trends[]` | `{ trends: TikTokTrend[] }` |
| `demographics` | `demographics` | `{ gender: {...}, age_pct: {...} }` |
| `top_countries` | `top_countries[]` | `{ countries: TopCountry[] }` |
| `top_cities` | `top_cities[]` | `{ cities: TopCity[] }` |
| `spotify_stats` | `spotify_stats` | `{ listeners, streams, ... }` |
| `audience_segmentation` | `audience_segmentation` | `{ active, previously_active, programmed }` |
| `mv_views` | `mv_views[]` | `{ views: MVViews[] }` |
| `playlist_adds` | `playlist_adds[]` | `{ adds: PlaylistAdd[] }` |
| `apple_music` | `apple_music[]` | `{ data: any[] }` |
| `shazam` | `shazam[]` | `{ data: any[] }` |

## Example: Inserting a Report

### 1. Insert Artist (if doesn't exist)

```sql
INSERT INTO artistas_registry (nombre, id_bigquery)
VALUES ('Santos Bravos', 'SANTOSBRAVOS_FACEBOOK')
ON CONFLICT (nombre) DO UPDATE SET
  updated_at = NOW()
RETURNING id;
-- Returns: id = 1
```

### 2. Insert Report

```sql
INSERT INTO reports (
  report_type, template_key, artist_id,
  week_start, week_end, title, summary_md, raw_json
)
VALUES (
  'artist', 'default', 1,
  '2025-10-04', '2025-10-10',
  'SANTOS BRAVOS Weekly — 2025-10-04 a 2025-10-10',
  '', '{}'::jsonb
)
ON CONFLICT (report_type, artist_id, week_end) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW()
RETURNING id;
-- Returns: id = 42
```

### 3. Insert Sections

```sql
-- Highlights
INSERT INTO report_sections (
  report_id, section_key, order_no, title, content_md, data_json
)
VALUES (
  42, 'highlights', 1, 'Highlights / Overall Summary', '',
  '{"bullets": ["TikTok comments +103.5%", "Shares +255.6%"]}'::jsonb
)
ON CONFLICT (report_id, section_key) DO UPDATE SET
  data_json = EXCLUDED.data_json, updated_at = NOW();

-- Demographics
INSERT INTO report_sections (
  report_id, section_key, order_no, title, content_md, data_json
)
VALUES (
  42, 'demographics', 2, 'Demographics', '',
  '{"gender": {"female": 52, "male": 46, "non_binary": 1, "not_specified": 1}, "age_pct": {"13-17": 18, "18-22": 32, "23-27": 25, "28-34": 15, "35-44": 7, "45-59": 2, "60+": 1}}'::jsonb
)
ON CONFLICT (report_id, section_key) DO UPDATE SET
  data_json = EXCLUDED.data_json, updated_at = NOW();
```

## Testing

### Test 1: Flag Disabled (Samples Only)

```bash
# In .env
VITE_USE_DB_REPORTS=false

# Expected: All reports show hardcoded sample data
# No database queries executed
```

### Test 2: Flag Enabled with New Schema Data

```bash
# In .env
VITE_USE_DB_REPORTS=true

# Ensure reports table has data
# Expected: Reports load from new schema (reports + report_sections)
```

### Test 3: Flag Enabled with Only Old Schema Data

```bash
# In .env
VITE_USE_DB_REPORTS=true

# Clear reports table, ensure spotify_report_weekly has data
# Expected: Reports fall back to old schema
```

### Test 4: Flag Enabled with No Data

```bash
# In .env
VITE_USE_DB_REPORTS=true

# Clear both reports and spotify_report_weekly tables
# Expected: Reports fall back to hardcoded samples
```

## URLs

### Weekly Reports Grid
```
/reports/weeklies
```
Shows all available artists with their latest weekly report.

### Artist Weekly Report Detail
```
/reports/weeklies/{artist-slug}?week=YYYY-MM-DD
```

Examples:
- `/reports/weeklies/santos-bravos?week=2025-10-10`
- `/reports/weeklies/katseye?week=2025-10-06`

The `week` parameter is optional. Without it, the most recent report is shown.

## Troubleshooting

### Reports not loading from database

1. Check feature flag value:
   ```bash
   echo $VITE_USE_DB_REPORTS
   ```
   Must be exactly `"true"` (string)

2. Check browser console for errors:
   - Look for "Error fetching from new schema" or similar
   - Check network tab for failed Supabase queries

3. Verify database has data:
   ```sql
   SELECT COUNT(*) FROM reports WHERE report_type = 'artist';
   SELECT COUNT(*) FROM report_sections;
   ```

### Artist slug mismatch

Artist slugs are auto-generated from `artistas_registry.nombre`:
- Lowercased
- Accents removed (é → e)
- Spaces → hyphens
- Special chars removed

Examples:
- "Santos Bravos" → `santos-bravos`
- "Adrián Cota" → `adrian-cota`
- "MAGNA" → `magna`

## Migration Notes

### Next.js Migration

The code already supports `NEXT_PUBLIC_USE_DB_REPORTS`. When migrating to Next.js:

1. Copy environment variables to Next.js format
2. The feature flag will automatically work
3. No code changes needed

### From Old Schema to New Schema

No migration script needed. Both schemas coexist:

1. New reports go into `reports` + `report_sections`
2. Old reports stay in `spotify_report_weekly`
3. Application reads from both with automatic fallback

## Architecture

### Files Modified/Added

**New Files:**
- `src/lib/reports-mapper.ts` - Maps DB schemas to WeeklyReport type

**Modified Files:**
- `src/lib/reports-api.ts` - Added `listWeeklyReports()` with fallback logic
- `src/pages/Weeklies.tsx` - Uses new `listWeeklyReports()` function
- `src/pages/WeeklyDetail.tsx` - Uses new `getWeeklyReportDetailed()` function
- `.env` - Added `VITE_USE_DB_REPORTS` flag

**Database:**
- Added indexes for performance
- Added unique constraints to prevent duplicates
- Seed data for Santos Bravos (test/demo)

### No Breaking Changes

- All hardcoded samples remain unchanged
- Default behavior (flag=false) identical to pre-integration
- PDF export, styling, and UI unchanged
- No components refactored
