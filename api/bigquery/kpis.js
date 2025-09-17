// Mock BigQuery API endpoint for KPIs
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { project, platform } = req.query;
    
    // Mock data based on project and platform
    const mockData = {
      palf: {
        facebook: {
          totalFollowers: 2400000,
          engagementRate: 4.8,
          reach: 18200000,
          impressions: 45600000,
          change: {
            followers: '+12.5%',
            engagement: '+0.3%',
            reach: '-2.1%',
            impressions: '+8.7%'
          }
        },
        instagram: {
          totalFollowers: 1800000,
          engagementRate: 6.2,
          reach: 12500000,
          impressions: 32100000,
          change: {
            followers: '+8.3%',
            engagement: '+1.2%',
            reach: '+4.5%',
            impressions: '+12.1%'
          }
        }
      },
      bts: {
        twitter: {
          totalFollowers: 45600000,
          engagementRate: 3.2,
          reach: 89200000,
          impressions: 156700000,
          change: {
            followers: '+5.7%',
            engagement: '-0.8%',
            reach: '+15.3%',
            impressions: '+22.4%'
          }
        }
      }
    };

    const data = mockData[project]?.[platform] || {
      totalFollowers: 0,
      engagementRate: 0,
      reach: 0,
      impressions: 0,
      change: {
        followers: '0%',
        engagement: '0%',
        reach: '0%',
        impressions: '0%'
      }
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in KPI API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}