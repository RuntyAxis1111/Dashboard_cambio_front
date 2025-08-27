import { useParams, useNavigate } from 'react-router-dom'
import { data } from '../lib/data'
import { useEffect, useState } from 'react'

export function DirectDashboard() {
  const { section, platform } = useParams()
  const navigate = useNavigate()
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  useEffect(() => {
    if (!section || !platform) {
      setError('Invalid URL parameters')
      return
    }

    // Find the report URL based on section and platform
    let url: string | null = null
    let sectionName = ''
    let platformName = ''

    if (section.toLowerCase() === 'palf') {
      sectionName = 'PALF'
      const social = data.palf.socialMedia.find(s => 
        s.id.toLowerCase() === platform.toLowerCase()
      )
      if (social) {
        url = social.palfReportUrl
        platformName = social.name
      }
    } else if (section.toLowerCase() === 'stbv') {
      sectionName = 'STBV'
      const social = data.stbv.find(s => 
        s.id.toLowerCase() === platform.toLowerCase()
      )
      if (social) {
        url = social.stbvReportUrl
        platformName = social.name
      }
    } else if (section.toLowerCase() === 'communities') {
      sectionName = 'COMMUNITIES'
      // For communities, we need account and platform
      // This would need additional URL structure like /communities/pisteo-y-lloro/instagram
      setError('Communities require account specification')
      return
    } else if (section.toLowerCase() === 'artists') {
      sectionName = 'ARTISTS'
      const artist = data.artists.find(a => 
        a.id.toLowerCase() === platform.toLowerCase()
      )
      if (artist) {
        url = artist.reportUrls[0]
        platformName = artist.name
      }
    }

    if (url) {
      setReportUrl(url)
      // Update document title
      document.title = `${sectionName} - ${platformName} | HYBE Latin America`
    } else {
      setError(`Dashboard not found: ${section}/${platform}`)
    }
  }, [section, platform])

  const handleShareReport = async () => {
    const currentUrl = window.location.href
    
    try {
      await navigator.clipboard.writeText(currentUrl)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Dashboard no encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!reportUrl) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header with back button */}
      <div className="bg-black text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-lg font-bold uppercase">
            {section?.toUpperCase()} - {platform?.toUpperCase()}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleShareReport}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 relative"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Report
            {showCopyMessage && (
              <div className="absolute top-full right-0 mt-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
                ✓ URL copiada al portapapeles
              </div>
            )}
          </button>
          <span className="text-sm text-gray-300">Demo Mode</span>
        </div>
      </div>

      {/* Dashboard iframe */}
      <div className="flex-1 h-full">
        <iframe
          src={reportUrl}
          title={`${section?.toUpperCase()} - ${platform?.toUpperCase()} Dashboard`}
          className="w-full h-full border-0 min-h-0"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  )
}