# Report Sections Order Documentation

## Overview
This document defines the canonical order of sections in Weekly Reports across all entities/artists in the HYBE LATAM Data & AI Lab analytics platform.

## Standard Section Order

All weekly reports follow this standardized order:

| Order | Section Key | Section Title | Description |
|-------|-------------|---------------|-------------|
| 1 | `highlights` | Highlights / Overall Summary | Key takeaways and weekly summary bullets |
| 2 | `mv_totales` | Total Music Video Views | YouTube performance metrics and top videos |
| 3 | `spotify_insights` | Spotify Insights | Spotify-specific metrics and insights |
| 4 | `dsp_platform_breakdown` | DSP Platform Breakdown | Digital streaming platform metrics across Spotify, Apple Music, etc. |
| 5 | `dsp_last_song_tracking` | Latest Song Release Tracking | Performance tracking for most recent song releases |
| 6 | `social_growth` | Social Platform Weekly Social Growth | Instagram, TikTok, Facebook growth metrics |
| 7 | `members_growth` | Members' IG Weekly Social Growth | Individual band member Instagram growth (for bands only) |
| 8 | `pr_press` | PR (Meltwater) | Press and media coverage from Meltwater |
| 9 | `weekly_content` | Weekly Content Recap | Summary of content posted during the week |
| 10 | `top_posts` | Top 3 Best Performing Posts | Best performing social media posts |
| 11 | `fan_sentiment` | Fan Sentiment | Analysis of fan comments and sentiment |
| 12 | `demographics` | Demographics | Audience demographics (age, gender, location) |
| 13 | `sources` | Sources | Data sources and attribution |
| 100 | `dsp_live_growth` | DSP Live Growth (Legacy) | Legacy section for backward compatibility |

## Section Placement Rules

### DSP Sections Position
The DSP sections (`dsp_platform_breakdown` and `dsp_last_song_tracking`) MUST appear:
- **AFTER** the YouTube/MV section (`mv_totales`)
- **AFTER** Spotify Insights (`spotify_insights`) if present
- **BEFORE** Social Growth sections

This ensures a logical flow: YouTube → Spotify → All DSPs → Social Media

### Band-Specific Sections
Some sections only apply to bands/groups:
- `members_growth` - Only for entities with type=band and subtipo=band

### Optional Sections
Not all entities have all sections. Common configurations:
- **Solo Artists**: May skip `members_growth`
- **Early Stage Artists**: May skip `spotify_insights`, `demographics`, `sources`
- **Social-Only Reports**: May only have highlights + social sections

## Database Schema

### Tables
- `reportes_secciones` - Defines which sections each entity has
  - `entidad_id` - Links to `reportes_entidades`
  - `seccion_clave` - Section identifier (key)
  - `titulo` - Display title
  - `orden` - Sort order (1-100)
  - `lista` - Boolean flag for list-style rendering

### Standard Configuration Query
```sql
-- Get sections for an entity
SELECT seccion_clave, titulo, orden
FROM reportes_secciones
WHERE entidad_id = '<entity_id>'
ORDER BY orden;
```

## Frontend Rendering

### WeeklyDetail.tsx (Weekly Reports from Samples)
For reports using sample data (KATSEYE, Santos Bravos, Magna, etc.), sections are rendered in this order:
1. Highlights
2. Fan Sentiment (if present)
3. Playlist Adds
4. Top Countries
5. Top Cities
6. Spotify Stats
7. Audience Segmentation
8. **Streaming Trends** (includes YouTube/MV data)
9. **DSP Platform Breakdown** (SpotifyMetricsCard)
10. **DSP Last Song Tracking** (LastSongTracking)
11. TikTok Trends
12. MV Views
13. Demographics
14. Sources

### ReportDetail.tsx (Database-Driven Reports)
For reports from the database (`reportes_entidades`), sections are dynamically rendered based on `reportes_secciones.orden`.

Components used:
- `HighlightsSection` - Highlights
- `MVViewsSection` - MV Totales (YouTube)
- `SpotifyMetricsCard` - DSP Platform Breakdown
- `LastSongTracking` - DSP Last Song Tracking
- `PlatformGrowthSection` - Social Growth
- `MembersGrowthSection` - Members Growth
- `PRPressSection` - PR/Meltwater
- `WeeklyContentSection` - Weekly Content
- `TopPostsSection` - Top Posts
- `FanSentimentSection` - Fan Sentiment
- `DemographicsSection` - Demographics
- `SourcesSection` - Sources

## Adding Sections to New Entities

When adding a new entity, ensure they have all standard sections:

```sql
-- Add standard sections for a new entity
INSERT INTO reportes_secciones (entidad_id, seccion_clave, titulo, lista, orden)
VALUES
  ('<entity_id>', 'highlights', 'Highlights / Overall Summary', false, 1),
  ('<entity_id>', 'mv_totales', 'Total Music Video Views', false, 2),
  ('<entity_id>', 'spotify_insights', 'Spotify Insights', false, 3),
  ('<entity_id>', 'dsp_platform_breakdown', 'DSP Platform Breakdown', false, 4),
  ('<entity_id>', 'dsp_last_song_tracking', 'Latest Song Release Tracking', false, 5),
  ('<entity_id>', 'social_growth', 'Social Platform Weekly Social Growth', false, 6),
  -- Add members_growth only for bands
  ('<entity_id>', 'pr_press', 'PR (Meltwater)', false, 8),
  ('<entity_id>', 'weekly_content', 'Weekly Content Recap', false, 9),
  ('<entity_id>', 'top_posts', 'Top 3 Best Performing Posts', false, 10),
  ('<entity_id>', 'fan_sentiment', 'Fan Sentiment', false, 11),
  ('<entity_id>', 'demographics', 'Demographics', false, 12),
  ('<entity_id>', 'sources', 'Sources', false, 13)
ON CONFLICT (entidad_id, seccion_clave) DO NOTHING;
```

## Migration History

- **20251030182306** - Added DSP sections (`dsp_platform_breakdown`, `dsp_last_song_tracking`) to all active entities
- Sections with orden >= 4 were shifted by +2 to make room for DSP sections

## N8N Workflow Integration

The N8N workflow that generates weekly reports should populate sections in this order:
1. Generate highlights from weekly data
2. Aggregate YouTube/MV metrics
3. Pull Spotify insights
4. Fetch DSP data (Chartmetric API)
5. Collect social media growth
6. Gather PR/press mentions
7. Compile content recap
8. Identify top posts
9. Analyze fan sentiment
10. Update demographics
11. Document sources

## Validation

To verify an entity has correct section order:
```sql
SELECT
  e.nombre,
  rs.orden,
  rs.seccion_clave,
  rs.titulo
FROM reportes_entidades e
LEFT JOIN reportes_secciones rs ON rs.entidad_id = e.id
WHERE e.slug = '<artist-slug>'
ORDER BY rs.orden;
```

Expected: Should match standard order table above.

## Troubleshooting

### Missing Sections
If sections are missing from a report:
1. Check `reportes_secciones` for the entity
2. Verify `orden` values are correct
3. Ensure no gaps in order sequence

### Wrong Order
If sections appear in wrong order:
1. Query current order
2. Compare with standard order
3. Run UPDATE to fix orden values
4. Check frontend isSectionVisible() calls

## Related Documentation
- `/docs/DSP_API_REFERENCE.md` - DSP data API documentation
- `/docs/WEEKLY_REPORTS_DB.md` - Weekly reports database schema
- `/docs/YOUTUBE_SECTION_STRUCTURE.md` - YouTube section structure
- `/docs/MELTWATER_SECTION_STRUCTURE.md` - Meltwater PR section structure
