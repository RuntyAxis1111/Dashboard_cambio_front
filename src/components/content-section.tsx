import { useState } from "react"
import { ArtistPanel } from "./artist-panel"

interface ContentSectionProps {
  activeTab: string
  selectedItem: {
    id: string
    type: string
    socialId?: string
  } | null
  data: any
}

export function ContentSection({ activeTab, selectedItem, data }: ContentSectionProps) {
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  const generateShareableUrl = () => {
    if (!selectedItem) return null
    
    const { id, type, socialId } = selectedItem
    const baseUrl = window.location.origin
    
    if (type === "artist") {
      return `${baseUrl}/artists/${id}`
    }
    
    if (type === "palf-social") {
      return `${baseUrl}/palf/${id}`
    }
    
    if (type === "palf-band-social") {
      return `${baseUrl}/palf/${socialId}`
    }
    
    if (type === "stbv-social") {
      return `${baseUrl}/stbv/${id}`
    }
    
    if (type === "community-social") {
      return `${baseUrl}/communities/${id}/${socialId}`
    }
    
    return null
  }

  const getReportUrl = () => {
    if (!selectedItem || activeTab === "artists") return null

    const { id, type, socialId } = selectedItem

    if (type === "palf-social") {
      const social = data.palf.socialMedia.find((s: any) => s.id === id)
      return social?.palfReportUrl || null
    }

    if (type === "palf-band-social") {
      const social = data.palf.socialMedia.find((s: any) => s.id === socialId)
      return social?.palfReportUrl || data.stbv[0]?.stbvReportUrl || null
    }

    if (type === "stbv-social") {
      const social = data.stbv.find((s: any) => s.id === id)
      return social?.stbvReportUrl || null
    }

    if (type === "community-social") {
      const social = data.communities.socialMedia.find((s: any) => s.id === socialId)
      if (social?.isDisabled) return null

      if (social?.communityReportUrls && social.communityReportUrls[id]) {
        return social.communityReportUrls[id]
      }
      return null
    }

    return null
  }

  const handleShareReport = async () => {
    const shareUrl = generateShareableUrl()
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    }
  }

  const reportUrl = getReportUrl()

  const selectedArtist =
    activeTab === "artists" && selectedItem?.type === "artist"
      ? data.artists.find((a: any) => a.id === selectedItem.id)
      : null

  return (
    <div className="p-4 h-[calc(100vh-4rem)]">
      <div className="w-full h-full bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg flex flex-col">
        {activeTab === "artists" ? (
          <ArtistPanel artist={selectedArtist} />
        ) : reportUrl ? (
          <>
            <div className="bg-black text-white p-3 flex justify-between items-center flex-shrink-0 h-16 relative">
              <span className="font-bold uppercase">{`${activeTab.toUpperCase()} Data Panel`}</span>
              
              {/* Share Report Button */}
              <button
                onClick={handleShareReport}
                className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative group"
                title="Share Report"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Share Report
                </div>
              </button>
              
              {/* Success Message */}
              {showCopyMessage && (
                <div className="absolute top-full right-0 mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                  ✓ URL copied to clipboard
                </div>
              )}
            </div>
            <div className="flex-1 h-full overflow-y-auto">
              <iframe
                src={reportUrl}
                title={`${activeTab.toUpperCase()} Data Panel`}
                className="w-full h-full border-0"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img
                  src="/assets/pinguinohybe.png"
                  alt="HYBE Lab Penguin"
                  className="w-20 h-20 mx-auto object-contain opacity-50"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Select a Project</h2>
              <p className="text-gray-600 max-w-md">
                Choose a project from the navigation above to view analytics dashboards and insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}