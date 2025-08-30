import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, Share2, Download, ExternalLink, Calendar, Filter } from 'lucide-react'
import { Button } from '../components/ui/button'
import { data } from '../lib/data'

export function DashboardView() {
  const { project, source, band } = useParams()
  const navigate = useNavigate()
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Simulate loading delay
    const timer = setTimeout(() => {
      let url: string | null = null
      let projectName = ''
      let sourceName = ''

      if (project === 'artists') {
        projectName = 'Artists'
        const artist = data.artists.find(a => a.id === source)
        if (artist) {
          url = artist.reportUrls[0]
          sourceName = artist.name
        }
      } else if (project === 'palf') {
        projectName = 'PALF'
        if (band) {
          // Band dashboard
          const social = data.palf.socialMedia.find(s => s.id === 'instagram') // Default to Instagram for bands
          if (social) {
            url = social.palfReportUrl
            sourceName = `${band.toUpperCase()} - Instagram`
          }
        } else {
          // Social media dashboard
          const social = data.palf.socialMedia.find(s => s.id === source)
          if (social) {
            url = social.palfReportUrl
            sourceName = social.name
          }
        }
      } else if (project === 'stbv') {
        projectName = 'STBV'
        const social = data.stbv.find(s => s.id === source)
        if (social) {
          url = social.stbvReportUrl
          sourceName = social.name
        }
      } else if (project === 'communities') {
        projectName = 'Communities'
        const account = data.communities.accounts.find(a => a.id === source)
        if (account) {
          const social = data.communities.socialMedia.find(s => s.id === 'instagram')
          if (social?.communityReportUrls?.[source]) {
            url = social.communityReportUrls[source]
            sourceName = `${account.name} - Instagram`
          }
        }
      }

      if (url) {
        setReportUrl(url)
        document.title = `${projectName} - ${sourceName} | HYBE LATAM Data & AI Lab`
      } else {
        setError(`Dashboard not found: ${project}/${source}${band ? `/${band}` : ''}`)
      }
      
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [project, source, band])

  const handleShare = async () => {
    const currentUrl = window.location.href
    
    try {
      await navigator.clipboard.writeText(currentUrl)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Export functionality coming soon')
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-4 bg-muted rounded skeleton" />
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="w-24 h-4 bg-muted rounded skeleton" />
        </div>

        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="w-64 h-8 bg-muted rounded skeleton" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-9 bg-muted rounded skeleton" />
            <div className="w-20 h-9 bg-muted rounded skeleton" />
            <div className="w-32 h-9 bg-muted rounded skeleton" />
          </div>
        </div>

        {/* Dashboard skeleton */}
        <div className="w-full h-[600px] bg-muted rounded-xl skeleton" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center space-y-6 py-12">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Dashboard Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => navigate('/dashboards')}>
              Back to Dashboards
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const projectName = project?.toUpperCase() || ''
  const sourceName = source?.toUpperCase() || ''
  const bandName = band?.toUpperCase() || ''

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboards" className="hover:text-foreground transition-colors">
            Dashboards
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/dashboards`} className="hover:text-foreground transition-colors">
            {projectName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {bandName ? `${bandName} - ${sourceName}` : sourceName}
          </span>
        </nav>
      </div>

      {/* Header */}
      <div className="px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              {projectName} {bandName && `- ${bandName}`}
            </h1>
            <p className="text-lg text-muted-foreground">
              {sourceName} Analytics Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleShare} className="relative">
              <Share2 className="w-4 h-4 mr-2" />
              Share
              {showCopyMessage && (
                <div className="absolute top-full right-0 mt-2 bg-green-600 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap z-10">
                  ✓ URL copied to clipboard
                </div>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Data Explorer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            All Countries
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-8 pb-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {reportUrl ? (
            <iframe
              src={reportUrl}
              title={`${projectName} - ${sourceName} Dashboard`}
              className="w-full h-[700px] border-0"
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="flex items-center justify-center h-[700px] text-muted-foreground">
              <div className="text-center space-y-4">
                <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Dashboard Unavailable</h3>
                  <p className="text-sm">This dashboard is currently not available.</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}