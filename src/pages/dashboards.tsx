import { Link } from 'react-router-dom'
import { BarChart3, Users, Music, MessageSquare } from 'lucide-react'
import { data } from '../lib/data'

const projectIcons = {
  artists: Users,
  palf: Music,
  stbv: BarChart3,
  communities: MessageSquare
}

const projectColors = {
  artists: 'bg-purple-500',
  palf: 'bg-blue-500',
  stbv: 'bg-green-500',
  communities: 'bg-orange-500'
}

export function DashboardsIndex() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboards</h1>
        <p className="text-muted-foreground">
          Access real-time analytics and insights across all projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Artists */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${projectColors.artists} rounded-lg flex items-center justify-center text-white`}>
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Artists</h2>
          </div>
          <div className="space-y-2">
            {data.artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/dashboard/artists/${artist.id}`}
                className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {artist.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* PALF */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${projectColors.palf} rounded-lg flex items-center justify-center text-white`}>
              <Music className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">PALF</h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Social Media</h3>
              <div className="space-y-2">
                {data.palf.socialMedia.slice(0, 4).map((social) => (
                  <Link
                    key={social.id}
                    to={`/dashboard/palf/${social.id}`}
                    className="block p-2 bg-card border border-border rounded-md hover:bg-accent transition-colors group text-sm"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {social.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bands</h3>
              <div className="space-y-2">
                {data.palf.bands.slice(0, 2).map((band) => (
                  <Link
                    key={band.id}
                    to={`/dashboard/palf/band/${band.id}`}
                    className="block p-2 bg-card border border-border rounded-md hover:bg-accent transition-colors group text-sm"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {band.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STBV */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${projectColors.stbv} rounded-lg flex items-center justify-center text-white`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">STBV</h2>
          </div>
          <div className="space-y-2">
            {data.stbv.map((social) => (
              <Link
                key={social.id}
                to={`/dashboard/stbv/${social.id}`}
                className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {social.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Communities */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${projectColors.communities} rounded-lg flex items-center justify-center text-white`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Communities</h2>
          </div>
          <div className="space-y-2">
            {data.communities.accounts.map((account) => (
              <Link
                key={account.id}
                to={`/dashboard/communities/${account.id}/instagram`}
                className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {account.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}