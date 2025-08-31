import { useParams, useSearchParams } from 'react-router-dom'
import { KpiTile } from '../components/KpiTile'
import { Tabs } from '../components/Tabs'
import { DashboardFrame } from '../components/DashboardFrame'
import { Breadcrumb } from '../components/Breadcrumb'
import { ActionBar } from '../components/ActionBar'

export function DashboardDetail() {
  const { project, source, band } = useParams()
  const [searchParams] = useSearchParams()
  
  const title = band 
    ? `${project?.toUpperCase()} • ${band.replace('-', ' ').toUpperCase()}`
    : `${project?.toUpperCase()} • ${source?.toUpperCase()}`
  
  const breadcrumbItems = band
    ? [
        { label: 'Dashboards', href: '/dashboards' },
        { label: project?.toUpperCase() || '', href: `/dashboards` },
        { label: 'Bands', href: `/dashboards` },
        { label: band.replace('-', ' ').toUpperCase() }
      ]
    : [
        { label: 'Dashboards', href: '/dashboards' },
        { label: project?.toUpperCase() || '', href: `/dashboards` },
        { label: source?.toUpperCase() || '' }
      ]

  const tabs = ['Overview', 'Engagement', 'Growth', 'Audience', 'Content']
  
  // Mock KPI data
  const kpis = [
    { title: 'Total Followers', value: '2.4M', change: '+12.5%', trend: 'up' },
    { title: 'Engagement Rate', value: '4.8%', change: '+0.3%', trend: 'up' },
    { title: 'Reach', value: '18.2M', change: '-2.1%', trend: 'down' },
    { title: 'Impressions', value: '45.6M', change: '+8.7%', trend: 'up' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">{title}</h1>
              <p className="text-neutral-400 mt-1">
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
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <Tabs tabs={tabs} />
          <DashboardFrame project={project} source={source} band={band} />
        </div>
      </div>
    </div>
  )
}