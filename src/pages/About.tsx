export function About() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-4">About HYBE LATAM Data & AI Lab</h1>
          <p className="text-xl text-gray-600">
            Advanced analytics and AI-powered insights for the Latin American music industry
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-black mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                HYBE LATAM Data & AI Lab is the central hub for data-driven decision making 
                in the Latin American music market. We provide comprehensive analytics, 
                AI-powered insights, and advanced modeling tools to optimize artist performance 
                and fan engagement.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Platform Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time social media analytics</li>
                <li>• Marketing mix modeling and optimization</li>
                <li>• Conversational data analysis with Hybe LLM</li>
                <li>• Intelligent alerts and subscriptions</li>
                <li>• Comprehensive data exploration tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Version</h3>
              <p className="text-gray-600">
                Product Alpha • No AI features currently enabled
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white border border-gray-300 rounded-2xl p-8 inline-block">
              <img 
                src="/assets/pinguinohybe.png" 
                alt="HYBE Penguin Mascot" 
                className="w-48 h-48 mx-auto mb-4 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500 text-sm">Penguin Mascot</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Meet Our Mascot</h3>
              <p className="text-gray-600 text-sm">
                The HYBE Penguin - our friendly lab companion (static asset)
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 HYBE LATAM Data & AI Lab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}