# Weekly Reports Database Integration

## Summary

The Weekly Reports feature now supports database-backed content with automatic fallback to hardcoded samples. This integration enables dynamic report generation while maintaining backward compatibility.

## Quick Start

### 1. Enable Database Integration

Add to `.env`:

```bash
VITE_USE_DB_REPORTS=true
```

### 2. Verify Test Data

The database already contains seed data for **Santos Bravos** (week ending 2025-10-10). To view it:

1. Navigate to `/reports/weeklies`
2. Click on "Santos Bravos" if visible (depends on flag being true)
3. Or directly visit: `/reports/weeklies/santos-bravos?week=2025-10-10`

### 3. Disable to Use Samples Only

```bash
VITE_USE_DB_REPORTS=false
```

Or remove the variable entirely.

## What Changed

### Files Added

- `src/lib/reports-mapper.ts` - Maps database schemas to WeeklyReport type
- `docs/WEEKLY_REPORTS_DB.md` - Complete integration documentation
- `docs/SEED_SCRIPT.sql` - Idempotent seed script for testing

### Files Modified

- `src/lib/reports-api.ts` - Added `listWeeklyReports()` with triple fallback
- `src/pages/Weeklies.tsx` - Uses new API with flag support
- `src/pages/WeeklyDetail.tsx` - Uses new API with flag support
- `.env` - Added `VITE_USE_DB_REPORTS` flag
- `.env.example` - Documented the new flag

### Database Changes

- Added unique constraints to prevent duplicate reports
- Added indexes for query performance
- Seeded test data for Santos Bravos

### What Didn't Change

- **All hardcoded samples remain untouched**
- **Default behavior (flag=false) identical to before**
- **No UI/UX changes** - same look and feel
- **PDF export works identically**
- **No breaking changes**

## How It Works

### Triple Fallback System

```
Flag = false
  └─> Always use samples (current behavior)

Flag = true
  └─> Try new schema (reports + report_sections)
      ├─> Has data? Return it
      └─> No data? Try old schema (spotify_report_weekly)
          ├─> Has data? Return it
          └─> No data? Use samples
```

### Data Sources

1. **New Schema** (Primary)
   - `artistas_registry` - Artist metadata + external IDs
   - `reports` - Report metadata (week, title, etc.)
   - `report_sections` - Structured sections with JSON data

2. **Old Schema** (Fallback)
   - `spotify_report_weekly` - Legacy reports
   - `spotify_report_sections` - Legacy sections

3. **Hardcoded Samples** (Final Fallback)
   - 8 artists: KATSEYE, ADRIÁN COTA, MAGNA, etc.
   - Always available, never removed

## Testing Scenarios

### Scenario 1: Flag Disabled (Current Behavior)

```bash
# .env
VITE_USE_DB_REPORTS=false
```

**Expected:**
- ✅ All 8 sample artists appear
- ✅ All reports show hardcoded data
- ✅ No database queries
- ✅ Identical to pre-integration behavior

### Scenario 2: Flag Enabled, New Schema Has Data

```bash
# .env
VITE_USE_DB_REPORTS=true

# Database has reports in new schema
```

**Expected:**
- ✅ Santos Bravos appears (from new schema)
- ✅ Report loads with sections from report_sections table
- ✅ Other sample artists may still appear if no DB data

### Scenario 3: Flag Enabled, Only Old Schema Has Data

```bash
# .env
VITE_USE_DB_REPORTS=true

# Clear new schema (reports table)
# Keep old schema (spotify_report_weekly)
```

**Expected:**
- ✅ KATSEYE, SANTOS BRAVOS, DESTINO appear (status='ready' in old schema)
- ✅ Reports load from spotify_report_weekly
- ✅ Falls back to old schema successfully

### Scenario 4: Flag Enabled, No Data Anywhere

```bash
# .env
VITE_USE_DB_REPORTS=true

# Clear both new and old schemas
```

**Expected:**
- ✅ All 8 sample artists appear
- ✅ Falls back to hardcoded samples
- ✅ No errors, graceful fallback

## Database Schema

### New Schema Structure

```
artistas_registry (artist master data)
  └─> reports (weekly reports)
       └─> report_sections (structured content)
```

### Section Keys

Map `report_sections.section_key` to these fields:

- `highlights` → `highlights[]` (array of bullet strings)
- `fan_sentiment` → `fan_sentiment` (string)
- `billboard_charts` → `billboard_charts[]`
- `spotify_charts` → `spotify_charts[]`
- `streaming_trends` → `streaming_trends[]`
- `tiktok_trends` → `tiktok_trends[]`
- `demographics` → `demographics` (object)
- `top_countries` → `top_countries[]`
- `top_cities` → `top_cities[]`
- `spotify_stats` → `spotify_stats` (object)
- `audience_segmentation` → `audience_segmentation` (object)
- `mv_views` → `mv_views[]`
- `playlist_adds` → `playlist_adds[]`
- `apple_music` → `apple_music[]`
- `shazam` → `shazam[]`

See `docs/WEEKLY_REPORTS_DB.md` for complete schema documentation.

## Inserting New Reports

### Option 1: Use Seed Script

```bash
# Edit docs/SEED_SCRIPT.sql with your data
# Run in Supabase SQL Editor
```

### Option 2: Manual Insert

```sql
-- 1. Insert artist
INSERT INTO artistas_registry (nombre)
VALUES ('Your Artist Name')
RETURNING id;

-- 2. Insert report
INSERT INTO reports (
  report_type, template_key, artist_id,
  week_start, week_end, title, summary_md, raw_json
)
VALUES (
  'artist', 'default', 1,
  '2025-10-04', '2025-10-10',
  'YOUR ARTIST Weekly — 2025-10-04 a 2025-10-10',
  '', '{}'::jsonb
)
RETURNING id;

-- 3. Insert sections (see docs/SEED_SCRIPT.sql for examples)
```

### Option 3: From n8n (Future)

When your n8n workflow is ready, it should:
1. Upsert artist in `artistas_registry`
2. Upsert report in `reports` (using unique constraint)
3. Upsert sections in `report_sections`

The code already handles this data source.

## URLs

### Weekly Reports Grid
```
http://localhost:5173/reports/weeklies
```

### Artist Detail
```
http://localhost:5173/reports/weeklies/{artist-slug}?week=YYYY-MM-DD
```

Examples:
- `/reports/weeklies/santos-bravos?week=2025-10-10` (new schema)
- `/reports/weeklies/katseye?week=2025-10-06` (sample)
- `/reports/weeklies/destino?week=2025-10-08` (old schema)

## Troubleshooting

### Problem: Reports still showing samples with flag=true

**Check:**
1. Is `VITE_USE_DB_REPORTS=true` in `.env`?
2. Did you restart the dev server after changing .env?
3. Check browser console for database errors
4. Verify data exists:
   ```sql
   SELECT COUNT(*) FROM reports WHERE report_type = 'artist';
   ```

### Problem: Artist not appearing in grid

**Check:**
1. Report exists with correct `report_type = 'artist'`
2. Artist exists in `artistas_registry`
3. Foreign key `reports.artist_id` points to correct artist
4. Browser console for JavaScript errors

### Problem: Sections not rendering

**Check:**
1. Sections exist in `report_sections` for the report
2. `section_key` matches expected keys (see docs)
3. `data_json` has correct structure
4. `content_md` is NOT NULL (use empty string if needed)

## Next Steps

1. **Test with flag disabled** - Verify samples work (default behavior)
2. **Test with flag enabled** - Verify Santos Bravos loads from DB
3. **Add more artists** - Use seed script or manual inserts
4. **Connect n8n** - Point workflow to new schema
5. **Monitor performance** - Check query times in Supabase Dashboard

## Support

For detailed documentation:
- Schema details: `docs/WEEKLY_REPORTS_DB.md`
- Seed script: `docs/SEED_SCRIPT.sql`
- BigQuery setup: `docs/BIGQUERY_SETUP.md`

## Architecture Decisions

### Why Triple Fallback?

- **Backward compatibility** - Existing samples always work
- **Migration safety** - Can test new schema without risk
- **Data flexibility** - Supports both old and new schemas
- **Zero downtime** - No breaking changes during rollout

### Why Feature Flag?

- **Gradual rollout** - Enable per environment
- **Easy rollback** - Just flip the flag
- **Testing isolation** - Test DB integration separately
- **Future-proof** - Ready for Next.js migration

### Why Keep Samples?

- **Demo purposes** - Always have working examples
- **Development** - No DB required for UI work
- **Fallback safety** - Graceful degradation
- **Documentation** - Living examples of data structure

## Success Criteria

✅ **All tasks completed:**

1. ✅ Feature flag added to `.env` (dual prefix support)
2. ✅ Database constraints and indexes created
3. ✅ Seed data inserted (Santos Bravos)
4. ✅ `listWeeklyReports()` implemented with fallback
5. ✅ `getWeeklyReportDetailed()` implemented with fallback
6. ✅ Weeklies.tsx updated (no breaking changes)
7. ✅ WeeklyDetail.tsx updated (no breaking changes)
8. ✅ Documentation created
9. ✅ Build succeeds without errors
10. ✅ No samples removed or modified

**Result:** Weekly Reports now supports database integration with full backward compatibility.
