import { Link } from 'react-router-dom'
import { BarChart3, Brain, Bell, Database, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

const quickActions = [
  {
    title: 'View Dashboards',
    description: 'Access real-time analytics for all projects',
    href: '/dashboards',
    icon: BarChart3,
    color: 'bg-blue-500'
  },
  {
    title: 'AI Studio',
    description: 'Marketing Mix Modeling and LLM Assistant',
    href: '/ai',
    icon: Brain,
    color: 'bg-purple-500',
    badge: 'Beta'
  },
  {
    title: 'Data Explorer',
    description: 'Browse datasets and metadata catalog',
    href: '/data',
    icon: Database,
    color: 'bg-green-500'
  },
  {
    title: 'Subscriptions',
    description: 'Manage alerts and notifications',
    href: '/subscriptions',
    icon: Bell,
    color: 'bg-orange-500'
  }
]

const recentProjects = [
  { name: 'PALF - YouTube', href: '/dashboard/palf/youtube' },
  { name: 'STBV - Instagram', href: '/dashboard/stbv/instagram' },
  { name: 'Daddy Yankee', href: '/dashboard/artists/daddy-yankee' },
  { name: 'Communities - TikTok', href: '/dashboard/communities/tiktok' }
]

export function Home() {
  return (
    <div className="p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/assets/pinguinohybe.png"
            alt="HYBE Lab Penguin Mascot"
            className="w-16 h-16 object-contain opacity-80"
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          From dashboards to decisions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to HYBE LATAM Data & AI Lab. Your central hub for analytics, 
          insights, and AI-powered decision making.
        </p>
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button asChild size="lg">
            <Link to="/dashboards">
              View Dashboards
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/ai">
              Try AI Studio
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group block p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                  <action.icon className="w-6 h-6" />
                </div>
                {action.badge && (
                  <span className="px-2 py-1 text-xs font-medium bg-hybe-gold text-black rounded-full">
                    {action.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentProjects.map((project) => (
            <Link
              key={project.name}
              to={project.href}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
            >
              <span className="font-medium text-foreground">{project.name}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}