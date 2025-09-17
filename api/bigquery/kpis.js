import { BigQuery } from '@google-cloud/bigquery'
import { BIGQUERY_CONFIG, buildKPIQuery, formatPercentageChange } from '../../src/lib/bigquery.js'

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: BIGQUERY_CONFIG.projectId,
  credentials: BIGQUERY_CONFIG.credentials
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { project, platform, start_date, end_date } = req.query

    console.log('🔍 BigQuery KPI Request:', { project, platform, start_date, end_date })

    if (!project || !platform) {
      return res.status(400).json({ 
        error: 'Missing required parameters: project and platform' 
      })
    }

    // Build the query based on project and platform
    const query = buildKPIQuery(project, platform, {
      start: start_date || '2025-08-17',
      end: end_date || '2025-09-17'
    })

    console.log('📊 Executing BigQuery:', query)

    // Execute the query
    const [rows] = await bigquery.query({
      query,
      location: 'US', // Specify location if needed
    })

    if (rows.length === 0) {
      return res.status(404).json({ 
        error: 'No data found for the specified project and platform',
        project,
        platform 
      })
    }

    const data = rows[0]
    
    // Format the response to match the expected structure
    const response = {
      total_followers: data.total_followers || 0,
      engagement_rate: data.engagement_rate || 0,
      reach: data.reach || 0,
      impressions: data.impressions || 0,
      followers_change: formatPercentageChange(data.followers_change_pct || 0),
      engagement_change: formatPercentageChange(data.engagement_change_pct || 0),
      reach_change: formatPercentageChange(data.reach_change_pct || 0),
      impressions_change: formatPercentageChange(data.impressions_change_pct || 0)
    }

    console.log('✅ BigQuery Response:', response)
    res.status(200).json(response)

  } catch (error) {
    console.error('❌ BigQuery Error:', error)
    
    // Return detailed error for debugging
    res.status(500).json({ 
      error: 'BigQuery query failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}