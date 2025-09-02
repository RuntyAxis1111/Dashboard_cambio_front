import { useParams, useSearchParams } from 'react-router-dom'
import { KpiTile } from '../components/KpiTile'
import { Tabs } from '../components/Tabs'
import { DashboardFrame } from '../components/DashboardFrame'
import { Breadcrumb } from '../components/Breadcrumb'
import { ActionBar } from '../components/ActionBar'
import { getDashboardUrl, projects, artists } from '../lib/dashboards'

export function DashboardDetail() {
  const { project, source, band } = useParams()
  const [searchParams] = useSearchParams()
  
  // Get dashboard URL
  const dashboardUrl = getDashboardUrl(project!, source!, band)
  
  // Build title and breadcrumb
  let title = ''
  let breadcrumbItems = []
  
  if (project === 'artists') {
    const artist = artists.find(a => a.id === source)
    title = artist?.name || source?.toUpperCase() || ''
    breadcrumbItems = [
      { label: 'Dashboards', href: '/dashboards' },
      { label: 'Artists', href: '/dashboards' },
      { label: title }
    ]
  } else if (band) {
    title = `${project?.toUpperCase()} • ${band.replace('-', ' ').toUpperCase()}`
    breadcrumbItems = [
      { label: 'Dashboards', href: '/dashboards' },
      { label: project?.toUpperCase() || '', href: '/dashboards' },
      { label: 'Bands', href: '/dashboards' },
      { label: band.replace('-', ' ').toUpperCase() }
    ]
  } else {
    title = `${project?.toUpperCase()} • ${source?.toUpperCase()}`
    breadcrumbItems = [
      { label: 'Dashboards', href: '/dashboards' },
      { label: project?.toUpperCase() || '', href: '/dashboards' },
      { label: source?.toUpperCase() || '' }
    ]
  }

  const tabs = ['Overview', 'Engagement', 'Growth', 'Audience', 'Content']
  
  // Mock KPI data
  const kpis = [
    { title: 'Total Followers', value: '2.4M', change: '+12.5%', trend: 'up' as const },
    { title: 'Engagement Rate', value: '4.8%', change: '+0.3%', trend: 'up' as const },
    { title: 'Reach', value: '18.2M', change: '-2.1%', trend: 'down' as const },
    { title: 'Impressions', value: '45.6M', change: '+8.7%', trend: 'up' as const },
  ]

  if (!dashboardUrl) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-300 bg-gray-100">
          <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-2xl font-semibold text-black mt-4">{title}</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <img 
                src="/assets/pinguinohybe.png" 
                alt="HYBE Penguin" 
                className="w-12 h-12 object-contain opacity-50"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">Dashboard not found</h3>
            <p className="text-gray-600">This dashboard is not available yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-300 bg-gray-100">
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-semibold text-black">{title}</h1>
              <p className="text-gray-600 mt-1">
                Range: {searchParams.get('from') || 'Last 30 days'} → {searchParams.get('to') || 'Today'}
                {searchParams.get('country') && ` • ${searchParams.get('country')}`}
              </p>
            </div>
            <ActionBar />
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <KpiTile key={index} {...kpi} />
          ))}
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden">
          <Tabs tabs={tabs} />
          <DashboardFrame url={dashboardUrl} title={title} />
        </div>
      </div>
    </div>
  )
}