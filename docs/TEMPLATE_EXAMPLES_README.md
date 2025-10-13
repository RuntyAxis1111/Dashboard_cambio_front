# Weekly Report Template Examples

This document describes the two template examples created in Supabase for Weekly Reports.

## Overview

Two complete weekly reports have been inserted into the new schema (`reports` + `report_sections`) to demonstrate the Show and Artist templates:

1. **Santos Bravos** - Show template (`show_v1`)
2. **Adrián Cota** - Artist template (`artist_v1`)

## Template Details

### 1. Santos Bravos - Show Template

**Report Metadata:**
- `report_type`: `artist`
- `template_key`: `show_v1`
- `entity_type`: `show` (in raw_json)
- `week_start`: 2025-10-04
- `week_end`: 2025-10-10
- **8 sections** total

**Sections (in order):**

1. **highlights** - Highlights / Overall Summary
   - Bullet points of key metrics

2. **fan_sentiment** - Fan Sentiment
   - Qualitative fan sentiment analysis

3. **tiktok_trends** - TikTok Trends
   - TikTok engagement metrics

4. **instagram_kpis** - Instagram KPIs
   - CTR, engagement rate, views per reach

5. **streaming_trends** - Streaming Trends
   - Spotify streams and deltas

6. **demographics** - Demographics
   - Gender, age, top countries

7. **playlist_adds** - DSP Playlist Adds
   - New playlist placements

8. **top_countries** - Top Countries
   - Geographic performance data

**Access URL:**
```
/reports/weeklies/santos-bravos?week=2025-10-10
```

---

### 2. Adrián Cota - Artist Template

**Report Metadata:**
- `report_type`: `artist`
- `template_key`: `artist_v1`
- `entity_type`: `artist` (in raw_json)
- `week_start`: 2025-10-02
- `week_end`: 2025-10-08
- **16 sections** total

**Sections (in order):**

1. **fan_sentiment** - Fan Sentiment
2. **highlights** - Weekly Highlights / Overall Summary
3. **streaming_data_update** - Streaming Data Update
4. **billboard_charts** - Billboard
5. **spotify_charts** - Spotify
6. **apple_music** - Apple Music
7. **shazam** - Shazam
8. **streaming_trends** - Streaming Trends
9. **tiktok_trends** - TikTok Trends
10. **us_weekly_album_sales** - US Weekly Album Sales Updates
11. **mv_views** - Total MV Views
12. **spotify_stats** - Spotify Streams
13. **playlist_adds** - DSP Playlist Adds
14. **instagram_kpis** - Instagram KPIs
15. **demographics** - Demographics / Top Countries / Top Cities
16. **sources** - Sources (data attribution)

**Access URL:**
```
/reports/weeklies/adrian-cota?week=2025-10-08
```

---

## Testing the Templates

### Step 1: Enable Database Integration

In your `.env` file:

```bash
VITE_USE_DB_REPORTS=true
```

### Step 2: View in Application

1. Navigate to `/reports/weeklies`
2. You should see both reports in the grid:
   - **SANTOS BRAVOS** (week ending 2025-10-10)
   - **ADRIÁN COTA** (week ending 2025-10-08)

3. Click on either to view the full report with all sections

### Step 3: Verify Template Differentiation

The application reads `template_key` and `entity_type` from the database, allowing you to:

- Customize rendering based on template type
- Apply template-specific styling
- Show/hide sections based on entity type (show vs artist)

## Database Verification

### Check Reports

```sql
SELECT
  r.id,
  r.template_key,
  r.title,
  a.nombre as artist,
  r.week_end,
  r.raw_json->>'entity_type' as entity_type,
  COUNT(rs.id) as sections_count
FROM reports r
JOIN artistas_registry a ON a.id = r.artist_id
LEFT JOIN report_sections rs ON rs.report_id = r.id
WHERE r.report_type = 'artist'
GROUP BY r.id, r.template_key, r.title, a.nombre, r.week_end, r.raw_json
ORDER BY r.week_end DESC;
```

**Expected Output:**
```
report_id | template_key | title                                    | artist        | week_end   | entity_type | sections_count
----------|--------------|------------------------------------------|---------------|------------|-------------|---------------
4         | artist_v1    | ADRIÁN COTA Weekly — 2025-10-02 to ...  | Adrián Cota   | 2025-10-08 | artist      | 16
2         | show_v1      | SANTOS BRAVOS Weekly — 2025-10-04 to... | Santos Bravos | 2025-10-10 | show        | 8
```

### Check Sections for Santos Bravos

```sql
SELECT order_no, section_key, title
FROM report_sections
WHERE report_id = 2
ORDER BY order_no;
```

### Check Sections for Adrián Cota

```sql
SELECT order_no, section_key, title
FROM report_sections
WHERE report_id = 4
ORDER BY order_no;
```

## Reseed Script

If you need to recreate or update these examples, run:

```bash
docs/SEED_SHOW_ARTIST_TEMPLATES.sql
```

This script is **idempotent** - safe to run multiple times without creating duplicates.

## Key Differences: Show vs Artist

| Aspect | Show Template | Artist Template |
|--------|---------------|-----------------|
| **Sections** | 8 | 16 |
| **Focus** | Show-level metrics (TikTok, IG, streaming) | Comprehensive artist tracking |
| **entity_type** | `"show"` | `"artist"` |
| **template_key** | `show_v1` | `artist_v1` |
| **Sources Section** | No | Yes (section 16) |
| **Charts** | Streaming only | Billboard, Spotify, Apple, Shazam |
| **Sales** | No | US Weekly Album Sales |
| **MV Views** | No | Yes |

## Adding More Templates

To create a new template:

1. Choose a unique `template_key` (e.g., `creator_v1`, `show_v2`)
2. Define required sections with their `section_key` values
3. Set `entity_type` in `raw_json` for categorization
4. Create seed script following the pattern in `SEED_SHOW_ARTIST_TEMPLATES.sql`

## Notes

- **Samples NOT Modified**: All hardcoded samples (KATSEYE, MAGNA, etc.) remain untouched
- **Coexistence**: These DB reports work alongside samples when `VITE_USE_DB_REPORTS=true`
- **Fallback**: If flag is `false`, samples are used exclusively
- **Artist Slugs**: Auto-generated as `santos-bravos`, `adrian-cota` (lowercase, hyphenated)
- **No Breaking Changes**: UI, PDF export, and styling unchanged

## Troubleshooting

### Reports not appearing in grid

1. Verify `VITE_USE_DB_REPORTS=true` in `.env`
2. Restart dev server after changing `.env`
3. Check browser console for errors
4. Verify data exists with SQL queries above

### Wrong template rendering

Check that `template_key` and `entity_type` are correctly set:

```sql
SELECT id, template_key, raw_json
FROM reports
WHERE artist_id IN (1, 4);
```

### Sections in wrong order

Verify `order_no` sequence:

```sql
SELECT report_id, order_no, section_key
FROM report_sections
WHERE report_id IN (2, 4)
ORDER BY report_id, order_no;
```

## Future Enhancements

Once these templates are validated:

1. Connect n8n workflow to populate real data
2. Add template-specific rendering in frontend
3. Create additional templates (creator, podcast, etc.)
4. Implement template versioning (v1, v2, etc.)
5. Add template selection in admin UI
