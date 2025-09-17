// BigQuery KPIs API endpoint
// This would be deployed as a Vercel serverless function

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { project, platform, start_date, end_date } = req.query;

    // Validate required parameters
    if (!project || !platform) {
      return res.status(400).json({ 
        error: 'Missing required parameters: project and platform' 
      });
    }

    // For now, return mock data based on project/platform
    // TODO: Replace with actual BigQuery integration
    const mockData = generateMockKPIs(project, platform);
    
    console.log(`📊 KPI request: ${project}/${platform} (${start_date} to ${end_date})`);
    
    return res.status(200).json(mockData);

  } catch (error) {
    console.error('❌ BigQuery KPI error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}

function generateMockKPIs(project, platform) {
  // Mock data generator based on project/platform
  const baseData = {
    'palf-facebook': {
      total_followers: 2400000,
      engagement_rate: 4.8,
      reach: 18200000,
      impressions: 45600000,
      followers_change: '+12.5%',
      engagement_change: '+0.3%',
      reach_change: '-2.1%',
      impressions_change: '+8.7%'
    },
    'palf-instagram': {
      total_followers: 3200000,
      engagement_rate: 6.2,
      reach: 24500000,
      impressions: 52300000,
      followers_change: '+15.2%',
      engagement_change: '+1.1%',
      reach_change: '+3.4%',
      impressions_change: '+11.2%'
    },
    'palf-tiktok': {
      total_followers: 1800000,
      engagement_rate: 8.9,
      reach: 15600000,
      impressions: 38900000,
      followers_change: '+22.1%',
      engagement_change: '+2.3%',
      reach_change: '+8.7%',
      impressions_change: '+18.5%'
    },
    'stbv-facebook': {
      total_followers: 890000,
      engagement_rate: 3.2,
      reach: 7200000,
      impressions: 19800000,
      followers_change: '+8.3%',
      engagement_change: '-0.2%',
      reach_change: '+1.9%',
      impressions_change: '+5.4%'
    },
    'kocky-ka-tiktok': {
      total_followers: 125000,
      engagement_rate: 12.4,
      reach: 2100000,
      impressions: 5600000,
      followers_change: '+45.2%',
      engagement_change: '+3.8%',
      reach_change: '+28.1%',
      impressions_change: '+35.7%'
    }
  };

  const key = `${project}-${platform}`;
  return baseData[key] || {
    total_followers: 100000,
    engagement_rate: 2.5,
    reach: 500000,
    impressions: 1200000,
    followers_change: '+5.0%',
    engagement_change: '+0.1%',
    reach_change: '+2.0%',
    impressions_change: '+3.5%'
  };
}

/* 
TODO: Real BigQuery Integration
Replace the mock function above with this actual BigQuery code:

import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: process.env.BIGQUERY_PROJECT_ID,
  credentials: {
    client_email: process.env.BIGQUERY_CLIENT_EMAIL,
    private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
});

async function fetchRealKPIs(project, platform, startDate, endDate) {
  const query = `
    SELECT 
      total_followers,
      engagement_rate,
      reach,
      impressions,
      LAG(total_followers) OVER (ORDER BY date) as prev_followers,
      LAG(engagement_rate) OVER (ORDER BY date) as prev_engagement,
      LAG(reach) OVER (ORDER BY date) as prev_reach,
      LAG(impressions) OVER (ORDER BY date) as prev_impressions,
      DATE(created_at) as date
    FROM \`your-project.analytics.social_metrics\`
    WHERE project = @project 
    AND platform = @platform
    AND DATE(created_at) BETWEEN @start_date AND @end_date
    ORDER BY created_at DESC
    LIMIT 2
  `;
  
  const options = {
    query,
    params: {
      project,
      platform,
      start_date: startDate,
      end_date: endDate
    }
  };
  
  const [rows] = await bigquery.query(options);
  
  if (rows.length === 0) return null;
  
  const current = rows[0];
  const previous = rows[1] || current;
  
  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };
  
  return {
    total_followers: current.total_followers,
    engagement_rate: current.engagement_rate,
    reach: current.reach,
    impressions: current.impressions,
    followers_change: calculateChange(current.total_followers, previous.total_followers),
    engagement_change: calculateChange(current.engagement_rate, previous.engagement_rate),
    reach_change: calculateChange(current.reach, previous.reach),
    impressions_change: calculateChange(current.impressions, previous.impressions)
  };
}
*/