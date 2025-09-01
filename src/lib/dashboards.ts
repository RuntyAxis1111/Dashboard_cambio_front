// Dashboard configuration with all real Looker Studio URLs
export interface DashboardConfig {
  id: string
  name: string
  url: string
  type: 'looker' | 'external'
}

export interface ProjectSection {
  id: string
  name: string
  type: 'social' | 'band' | 'pr' | 'artist'
  dashboards: DashboardConfig[]
}

export interface Project {
  id: string
  name: string
  description: string
  icon: string
  color: string
  sections: ProjectSection[]
}

// Artists dashboards
export const artists: DashboardConfig[] = [
  {
    id: 'daddy-yankee',
    name: 'DADDY YANKEE',
    url: 'https://lookerstudio.google.com/embed/reporting/0114febd-b174-4d34-8e78-f6b10a94535f/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'bts',
    name: 'BTS',
    url: 'https://lookerstudio.google.com/embed/reporting/0ec3d1cf-547b-4e66-8c81-77921c1cab64/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'chicocurlyhead',
    name: 'CHICOCURLYHEAD',
    url: 'https://lookerstudio.google.com/embed/reporting/2cdea0f6-6583-4f4d-8500-b0a58e677dc6/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'magna',
    name: 'MAGNA',
    url: 'https://lookerstudio.google.com/embed/reporting/d53caf15-04e7-4737-b2ab-d9b47a9752e9/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'adrian-cota',
    name: 'ADRIAN COTA',
    url: 'https://lookerstudio.google.com/embed/reporting/a1f0ea40-c3b2-4df5-979d-4ab132a2b7ec/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'meme-del-real',
    name: 'MEME DEL REAL',
    url: 'https://lookerstudio.google.com/embed/reporting/ce6d6f8f-4e3e-458f-ad76-7bd16651cd52/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'andrea-ele',
    name: 'ANDREA ELE',
    url: 'https://lookerstudio.google.com/embed/reporting/andrea-ele-report-id/page/p_andreaele',
    type: 'looker'
  },
  {
    id: 'america-fernandez',
    name: 'AMÉRICA FERNÁNDEZ',
    url: 'https://lookerstudio.google.com/embed/reporting/01360d8d-5515-477c-819d-11ecba384212/page/gnpEF',
    type: 'looker'
  }
]

// PALF social media dashboards
export const palfSocialDashboards: DashboardConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://lookerstudio.google.com/embed/reporting/43a608b8-7c3d-4ba2-a08a-21991d52dcd7/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://lookerstudio.google.com/embed/reporting/e9926442-f057-43ce-9687-5cc19be71ed4/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: 'https://lookerstudio.google.com/embed/reporting/9226e7dc-a254-4100-aa8d-446827b053cb/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://lookerstudio.google.com/embed/reporting/cf011f91-670c-4cd5-b3da-f1564c48a8cf/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://lookerstudio.google.com/embed/reporting/bfd71dab-b9e1-4cb1-91f5-051d8096f264/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'pr-panel',
    name: 'PR Panel',
    url: 'https://lookerstudio.google.com/embed/reporting/bd178033-7fcc-4990-9c5d-0bd8b7746861/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'public-relations',
    name: 'Public Relations',
    url: 'https://dancing-swan-64a0b2.netlify.app/',
    type: 'external'
  }
]

// STBV social media dashboards
export const stbvSocialDashboards: DashboardConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://lookerstudio.google.com/embed/reporting/f430c83b-dfb1-423f-85d3-2e0e1b34e052/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: 'https://lookerstudio.google.com/embed/reporting/ef2c8cf0-a9cc-440d-8221-879468f15143/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://lookerstudio.google.com/embed/reporting/2ebf19ce-8077-497b-ae8f-580d274d0a17/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://lookerstudio.google.com/embed/reporting/ff8cc1bd-0cae-440e-bb25-ca3c5eb76722/page/p_u876dxgudd',
    type: 'looker'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://lookerstudio.google.com/embed/reporting/db511cf8-aafa-47ff-aaed-e38b77219a36/page/p_u876dxgudd',
    type: 'looker'
  }
]

// Communities dashboards - @PISTEO_Y_LLORO
export const pisteoLloroDashboards: DashboardConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://lookerstudio.google.com/embed/reporting/ec282e0b-ed12-4e16-938b-b938328b5cda/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://lookerstudio.google.com/embed/reporting/d67f600b-6653-495a-87a5-949622aeaaba/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://lookerstudio.google.com/embed/reporting/67435df5-822f-4884-bb67-863c4cf373ca/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: 'https://lookerstudio.google.com/embed/reporting/6602360c-8561-4802-a9e5-26d80cfb1b0a/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://lookerstudio.google.com/embed/reporting/b98f1466-b4ca-4e04-8247-4604de8c647b/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://lookerstudio.google.com/embed/reporting/dac6c6ac-183c-4304-b100-e86d09ba199d/page/gnpEF',
    type: 'looker'
  }
]

// Communities dashboards - @ELPOPDELPOP
export const popDelPopDashboards: DashboardConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://lookerstudio.google.com/embed/reporting/e79d9e7a-ebbb-4051-927f-fb799ca2a522/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://lookerstudio.google.com/embed/reporting/25e59991-0412-4ac1-852a-1311c82d7f9b/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://lookerstudio.google.com/embed/reporting/e824d4a3-f181-42cc-9911-79037523cd70/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: 'https://lookerstudio.google.com/embed/reporting/7312cd16-5208-4d35-8bc6-baa42160e022/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://lookerstudio.google.com/embed/reporting/c873d3b1-83ea-43f9-9f63-a1e7c3bfe0a5/page/gnpEF',
    type: 'looker'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://lookerstudio.google.com/embed/reporting/8894952d-c444-4fc2-8dfd-f5e84ba7b820/page/gnpEF',
    type: 'looker'
  }
]

// PALF bands (use same social URLs as PALF)
export const palfBands = [
  { id: 'grupo-destino', name: 'GRUPO DESTINO' },
  { id: 'muzsa', name: 'MUZSA' },
  { id: 'jugada-maestra', name: 'JUGADA MAESTRA' }
]

// Other dashboards
export const otherDashboards = {
  mmm: {
    id: 'mmm-results',
    name: 'MMM Results',
    url: '/mmm/results',
    type: 'external'
  },
  news: {
    id: 'meltwater-news',
    name: 'News (Meltwater)',
    url: 'https://app.meltwater.com/shareable-dashboards/presentation/viewer/fe3558eb-fc9b-42cd-a3b2-acfce10aa240#slide-AF-contentStream',
    type: 'external'
  }
}

// Main projects configuration
export const projects: Project[] = [
  {
    id: 'artists',
    name: 'Artists',
    description: 'Individual artist performance and analytics',
    icon: 'Megaphone',
    color: 'orange',
    sections: [
      {
        id: 'individual-artists',
        name: 'Individual Artists',
        type: 'artist',
        dashboards: artists
      }
    ]
  },
  {
    id: 'palf',
    name: 'PALF',
    description: 'Primary artist analytics and social media performance',
    icon: 'Music',
    color: 'blue',
    sections: [
      {
        id: 'social-media',
        name: 'Social Media',
        type: 'social',
        dashboards: palfSocialDashboards
      },
      {
        id: 'bands',
        name: 'Bands',
        type: 'band',
        dashboards: palfBands.map(band => ({
          id: band.id,
          name: band.name,
          url: '', // Uses PALF social URLs
          type: 'looker' as const
        }))
      }
    ]
  },
  {
    id: 'stbv',
    name: 'STBV',
    description: 'Strategic brand visibility and market presence',
    icon: 'BarChart3',
    color: 'purple',
    sections: [
      {
        id: 'social-media',
        name: 'Social Media',
        type: 'social',
        dashboards: stbvSocialDashboards
      }
    ]
  },
  {
    id: 'communities',
    name: 'Communities',
    description: 'Fan engagement and community growth metrics',
    icon: 'Users',
    color: 'green',
    sections: [
      {
        id: 'pisteo-y-lloro',
        name: '@PISTEO_Y_LLORO',
        type: 'social',
        dashboards: pisteoLloroDashboards
      },
      {
        id: 'elpopdelpop',
        name: '@ELPOPDELPOP',
        type: 'social',
        dashboards: popDelPopDashboards
      }
    ]
  }
]

// Helper functions
export function getDashboardUrl(project: string, source: string, band?: string): string | null {
  if (project === 'artists') {
    const artist = artists.find(a => a.id === source)
    return artist?.url || null
  }

  const projectConfig = projects.find(p => p.id === project)
  if (!projectConfig) return null

  if (band && project === 'palf') {
    // For PALF bands, use the same social media URLs as PALF
    const socialDashboard = palfSocialDashboards.find(d => d.id === source)
    return socialDashboard?.url || null
  }

  for (const section of projectConfig.sections) {
    const dashboard = section.dashboards.find(d => d.id === source)
    if (dashboard) return dashboard.url
  }

  return null
}

export function getProjectSections(projectId: string) {
  const project = projects.find(p => p.id === projectId)
  return project?.sections || []
}

export function getAllProjects() {
  return projects
}