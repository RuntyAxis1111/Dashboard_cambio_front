import { Link } from 'react-router-dom'
import { FolderOpen, Users, Music, BarChart3, MessageSquare, ArrowRight } from 'lucide-react'
import { data } from '../lib/data'

const projectsOverview = [
  {
    id: 'artists',
    name: 'Artists',
    description: 'Individual artist performance tracking and social media analytics',
    icon: Users,
    color: 'bg-purple-500',
    count: data.artists.length,
    type: 'artists'
  },
  {
    id: 'palf',
    name: 'PALF',
    description: 'Project PALF social media monitoring and band performance metrics',
    icon: Music,
    color: 'bg-blue-500',
    count: data.palf.socialMedia.length + data.palf.bands.length,
    type: 'sources'
  },
  {
    id: 'stbv',
    name: 'STBV',
    description: 'STBV project analytics across multiple social platforms',
    icon: BarChart3,
    color: 'bg-green-500',
    count: data.stbv.length,
    type: 'platforms'
  },
  {
    id: 'communities',
    name: 'Communities',
    description: 'Community account performance and engagement tracking',
    icon: MessageSquare,
    color: 'bg-orange-500',
    count: data.communities.accounts.length,
    type: 'accounts'
  }
]

export function Projects() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground">
          Overview of all active projects and their performance metrics
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectsOverview.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${project.color} rounded-xl flex items-center justify-center text-white`}>
                  <project.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.count} {project.type}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Quick Access:</div>
              <div className="flex flex-wrap gap-2">
                {project.id === 'artists' && (
                  <>
                    <Link
                      to="/dashboard/artists/daddy-yankee"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      Daddy Yankee
                    </Link>
                    <Link
                      to="/dashboard/artists/bts"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      BTS
                    </Link>
                  </>
                )}
                {project.id === 'palf' && (
                  <>
                    <Link
                      to="/dashboard/palf/youtube"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      YouTube
                    </Link>
                    <Link
                      to="/dashboard/palf/instagram"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      Instagram
                    </Link>
                  </>
                )}
                {project.id === 'stbv' && (
                  <>
                    <Link
                      to="/dashboard/stbv/instagram"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      Instagram
                    </Link>
                    <Link
                      to="/dashboard/stbv/tiktok"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      TikTok
                    </Link>
                  </>
                )}
                {project.id === 'communities' && (
                  <>
                    <Link
                      to="/dashboard/communities/pisteo-y-lloro/instagram"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      @PISTEO_Y_LLORO
                    </Link>
                    <Link
                      to="/dashboard/communities/el-pop-del-pop/instagram"
                      className="px-3 py-1 text-xs bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                    >
                      @ELPOPDELPOP
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">{data.artists.length}</div>
            <div className="text-sm text-muted-foreground">Active Artists</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">
              {data.palf.socialMedia.length + data.stbv.length}
            </div>
            <div className="text-sm text-muted-foreground">Social Platforms</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">{data.communities.accounts.length}</div>
            <div className="text-sm text-muted-foreground">Community Accounts</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Data Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}