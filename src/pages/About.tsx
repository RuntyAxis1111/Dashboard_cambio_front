import { useNavigate } from 'react-router-dom'

export function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <div className="px-4 md:px-6 py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-black hover:underline font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-black mb-2">
            About HYBE LATAM Data & AI Lab
          </h1>
          <p className="text-sm text-gray-500">
            Product alpha version
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Lab Overview */}
          <section aria-labelledby="lab-overview">
            <h2 id="lab-overview" className="text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
              Lab Overview
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  HYBE LATAM Data & AI Lab is a centralized platform for monitoring and analyzing 
                  social media performance across our artist portfolio and community initiatives.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The platform provides real-time dashboards and analytics for strategic 
                  decision-making across multiple social media channels and artist projects.
                </p>
              </div>
              
              {/* Penguin mascot */}
              <div className="flex flex-col items-center space-y-4">
                <img
                  src="/assets/pinguinohybe.png"
                  alt="HYBE Lab Penguin Mascot"
                  className="w-32 h-32 object-contain"
                />
                <p className="text-sm text-gray-500 text-center">
                  Lab Mascot: Penguin (static asset)
                </p>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section aria-labelledby="projects-section">
            <h2 id="projects-section" className="text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
              Current Projects
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-black mb-2">ARTISTS</h3>
                <p className="text-sm text-gray-600">
                  Individual artist performance tracking and social media analytics
                </p>
              </div>
              
              <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-black mb-2">PALF</h3>
                <p className="text-sm text-gray-600">
                  Project PALF social media monitoring and band performance metrics
                </p>
              </div>
              
              <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-black mb-2">STBV</h3>
                <p className="text-sm text-gray-600">
                  STBV project analytics across multiple social platforms
                </p>
              </div>
              
              <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-black mb-2">COMMUNITIES</h3>
                <p className="text-sm text-gray-600">
                  Community account performance and engagement tracking
                </p>
              </div>
            </div>
          </section>

          {/* Technical Info */}
          <section aria-labelledby="technical-info">
            <h2 id="technical-info" className="text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
              Technical Information
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Platform Status</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Version:</strong> Alpha</li>
                  <li>• <strong>Mode:</strong> Demo Mode</li>
                  <li>• <strong>AI Features:</strong> Disabled</li>
                  <li>• <strong>Data Sources:</strong> Live dashboards and reports</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Supported Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>• Facebook</div>
                  <div>• Instagram</div>
                  <div>• YouTube</div>
                  <div>• X (Twitter)</div>
                  <div>• TikTok</div>
                  <div>• Discord</div>
                  <div>• Reddit</div>
                  <div>• Public Relations</div>
                </div>
              </div>
            </div>
          </section>

          {/* Credits */}
          <section aria-labelledby="credits-section">
            <h2 id="credits-section" className="text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
              Credits
            </h2>
            
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Built for HYBE LATAM team
              </p>
              <p className="text-sm text-gray-500">
                © 2025 HYBE LATAM Data & AI Lab. All rights reserved.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}