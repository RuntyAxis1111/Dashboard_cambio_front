// BigQuery configuration and client setup
export interface BigQueryConfig {
  projectId: string
  datasetId: string
  tableId: string
  credentials?: {
    client_email: string
    private_key: string
  }
}

// Default configuration - will be updated with real values
export const BIGQUERY_CONFIG: BigQueryConfig = {
  projectId: process.env.BIGQUERY_PROJECT_ID || 'your-project-id',
  datasetId: process.env.BIGQUERY_DATASET_ID || 'analytics',
  tableId: process.env.BIGQUERY_TABLE_ID || 'social_metrics',
  credentials: {
    client_email: process.env.BIGQUERY_CLIENT_EMAIL || '',
    private_key: process.env.BIGQUERY_PRIVATE_KEY || ''
  }
}

// SQL query templates
export const KPI_QUERIES = {
  // Get current metrics for a project/platform
  getCurrentMetrics: `
    SELECT 
      total_followers,
      engagement_rate,
      reach,
      impressions,
      DATE(created_at) as metric_date
    FROM \`{projectId}.{datasetId}.{tableId}\`
    WHERE project = @project 
      AND platform = @platform
      AND DATE(created_at) = (
        SELECT MAX(DATE(created_at))
        FROM \`{projectId}.{datasetId}.{tableId}\`
        WHERE project = @project AND platform = @platform
      )
    LIMIT 1
  `,
  
  // Get previous period for comparison
  getPreviousMetrics: `
    SELECT 
      total_followers,
      engagement_rate,
      reach,
      impressions
    FROM \`{projectId}.{datasetId}.{tableId}\`
    WHERE project = @project 
      AND platform = @platform
      AND DATE(created_at) = DATE_SUB(
        (SELECT MAX(DATE(created_at))
         FROM \`{projectId}.{datasetId}.{tableId}\`
         WHERE project = @project AND platform = @platform),
        INTERVAL 30 DAY
      )
    LIMIT 1
  `
}

// Helper function to format SQL queries
export function formatQuery(template: string, config: BigQueryConfig): string {
  return template
    .replace(/{projectId}/g, config.projectId)
    .replace(/{datasetId}/g, config.datasetId)
    .replace(/{tableId}/g, config.tableId)
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): string {
  if (previous === 0) return '+0%'
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}