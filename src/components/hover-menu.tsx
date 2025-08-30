import { useState, useEffect, useRef, useCallback } from "react"

interface HoverMenuProps {
  tabId: string
  data: any
  onItemSelect: (itemId: string, type: string, socialId?: string) => void
  onClose?: () => void
}

export function HoverMenu({ tabId, data, onItemSelect, onClose }: HoverMenuProps) {
  const [hoveredBand, setHoveredBand] = useState<string | null>(null)
  const [hoveredCommunity, setHoveredCommunity] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Refs para timeouts
  const bandTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const communityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Refs para elementos del DOM
  const bandMenuRef = useRef<HTMLDivElement>(null)
  const communityMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Cleanup function mejorada
  useEffect(() => {
    return () => {
      if (bandTimeoutRef.current) {
        clearTimeout(bandTimeoutRef.current)
        bandTimeoutRef.current = null
      }
      if (communityTimeoutRef.current) {
        clearTimeout(communityTimeoutRef.current)
        communityTimeoutRef.current = null
      }
    }
  }, [])

  // Funciones de hover optimizadas para bands
  const handleBandMouseEnter = useCallback((bandId: string) => {
    if (bandTimeoutRef.current) {
      clearTimeout(bandTimeoutRef.current)
      bandTimeoutRef.current = null
    }
    setHoveredBand(bandId)
  }, [])

  const handleBandMouseLeave = useCallback(() => {
    if (bandTimeoutRef.current) {
      clearTimeout(bandTimeoutRef.current)
    }
    bandTimeoutRef.current = setTimeout(() => {
      setHoveredBand(null)
    }, 150)
  }, [])

  // Funciones de hover optimizadas para communities
  const handleCommunityMouseEnter = useCallback((communityId: string) => {
    if (communityTimeoutRef.current) {
      clearTimeout(communityTimeoutRef.current)
      communityTimeoutRef.current = null
    }
    setHoveredCommunity(communityId)
  }, [])

  const handleCommunityMouseLeave = useCallback(() => {
    if (communityTimeoutRef.current) {
      clearTimeout(communityTimeoutRef.current)
    }
    communityTimeoutRef.current = setTimeout(() => {
      setHoveredCommunity(null)
    }, 150)
  }, [])

  // Función para cancelar timeouts cuando el mouse entra en el submenu
  const handleSubMenuMouseEnter = useCallback((type: "band" | "community", id: string) => {
    if (type === "band") {
      if (bandTimeoutRef.current) {
        clearTimeout(bandTimeoutRef.current)
        bandTimeoutRef.current = null
      }
      setHoveredBand(id)
    } else {
      if (communityTimeoutRef.current) {
        clearTimeout(communityTimeoutRef.current)
        communityTimeoutRef.current = null
      }
      setHoveredCommunity(id)
    }
  }, [])

  const handleItemClick = useCallback(
    (itemId: string, type: string, socialId?: string) => {
      // Don't do anything for disabled items like Snapchat
      if (type === "community-social" && socialId === "snapchat") {
        return
      }

      if (type === "public-relations") {
        const social =
          data.palf?.socialMedia?.find((s: any) => s.id === "public-relations") ||
          data.truvatos?.find((s: any) => s.id === "public-relations") ||
          data.communities?.socialMedia?.find((s: any) => s.id === "public-relations")
        if (social) {
          window.location.href = social.palfReportUrl || social.truvatosReportUrl || social.communityReportUrl
          return
        }
      }

      // Close dropdown after selection
      onItemSelect(itemId, type, socialId)
      if (onClose) {
        onClose()
      }
    },
    [data, onItemSelect, onClose],
  )

  // Helper function to get display name
  const getDisplayName = useCallback((item: any) => {
    return item.displayName || item.name
  }, [])

  if (tabId === "artists") {
    return (
      <div
        className={`
        absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl p-6 z-40 min-w-56
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        before:content-[''] before:absolute before:-top-2 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-4 before:h-4 before:bg-white before:border-l-2 before:border-t-2 before:border-black
        before:rotate-45 before:z-10
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <ul className="list-none p-0 m-0 relative z-10">
          {data.artists.map((artist: any, index: number) => (
            <li
              key={artist.id}
              onClick={() => handleItemClick(artist.id, "artist")}
              className={`
                py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
                hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                transition-all duration-200 ease-out rounded-md mx-1
                transform hover:translate-x-2 hover:scale-105
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                relative overflow-hidden group
              `}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                {artist.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (tabId === "palf") {
    return (
      <div
        className={`
        absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl p-6 z-40 min-w-[30rem] flex gap-6
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        before:content-[''] before:absolute before:-top-2 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-4 before:h-4 before:bg-white before:border-l-2 before:border-t-2 before:border-black
        before:rotate-45 before:z-10
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <div className="flex-1 relative z-10">
          <h3
            className={`
            text-black font-bold border-b-2 border-black pb-3 mb-4 text-lg
            transition-all duration-300 ease-out flex items-center
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          >
            <span className="w-3 h-3 bg-black rounded-full mr-3" />
            Social Media
          </h3>
          <ul className="list-none p-0 m-0">
            {data.palf.socialMedia.map((social: any, index: number) => (
              <li
                key={social.id}
                onClick={() => handleItemClick(social.id, "palf-social")}
                className={`
                  py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
                  hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                  transition-all duration-200 ease-out rounded-md mx-1
                  transform hover:translate-x-2 hover:scale-105
                  ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                  relative overflow-hidden group
                `}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                <span className="relative z-10 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                  <span className="flex flex-col items-start">
                    <span className="text-sm leading-tight">{social.name}</span>
                    {social.displayName && social.displayName !== social.name && (
                      <span className="text-xs opacity-60 font-normal normal-case leading-tight">
                        {social.displayName.includes("(pending approval)") ? "(pending approval)" : ""}
                      </span>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 relative z-10 overflow-visible">
          <h3
            className={`
            text-black font-bold border-b-2 border-black pb-3 mb-4 text-lg
            transition-all duration-300 ease-out flex items-center
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
            style={{ transitionDelay: "100ms" }}
          >
            <span className="w-3 h-3 bg-black rounded-full mr-3" />
            Bands
          </h3>
          <ul className="list-none p-0 m-0 relative overflow-visible">
            {data.palf.bands.map((band: any, index: number) => (
              <li
                key={band.id}
                className="relative overflow-visible group"
                onMouseEnter={() => handleBandMouseEnter(band.id)}
                onMouseLeave={handleBandMouseLeave}
              >
                <div
                  className={`
                  py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
                  hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                  transition-all duration-200 ease-out rounded-md mx-1
                  transform hover:translate-x-2 hover:scale-105
                  ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                  relative overflow-hidden
                `}
                  style={{
                    transitionDelay: `${(data.palf.socialMedia.length + index) * 50}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                  <span className="relative z-10 flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                    {band.name}
                    <span className="ml-auto text-xs opacity-60">▶</span>
                  </span>
                </div>

                {/* Sub-menu optimizado */}
                <div
                  ref={bandMenuRef}
                  className={`
                  absolute bg-white border-2 border-black shadow-2xl p-4 min-w-52 z-[100]
                  transition-all duration-250 ease-out backdrop-blur-sm
                  ${
                    hoveredBand === band.id
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                  before:content-[''] before:absolute before:top-4 before:-left-2 before:w-4 before:h-4 
                  before:bg-white before:border-l-2 before:border-b-2 before:border-black
                  before:rotate-45 before:z-10
                  rounded-lg overflow-hidden
                `}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                    left: "calc(100% + 0.5rem)",
                    top: `${index * 55}px`,
                  }}
                  onMouseEnter={() => handleSubMenuMouseEnter("band", band.id)}
                  onMouseLeave={handleBandMouseLeave}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

                  <ul className="list-none p-0 m-0 relative z-10">
                    {data.palf.socialMedia.map((social: any, subIndex: number) => (
                      <li
                        key={social.id}
                        onClick={() => handleItemClick(band.id, "palf-band-social", social.id)}
                        className={`
                          py-2 px-3 cursor-pointer text-black border-b border-black/10 last:border-b-0 
                          hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                          transition-all duration-200 ease-out rounded-md
                          transform hover:translate-x-1 hover:scale-105
                          ${hoveredBand === band.id ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
                          relative overflow-hidden group
                        `}
                        style={{
                          transitionDelay: `${subIndex * 30}ms`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                        <span className="relative z-10 flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-black rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                          <span className="flex flex-col items-start">
                            <span className="leading-tight">{social.name}</span>
                            {social.displayName && social.displayName !== social.name && (
                              <span className="text-xs opacity-60 font-normal normal-case leading-tight">
                                {social.displayName.includes("(pending approval)") ? "(pending approval)" : ""}
                              </span>
                            )}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (tabId === "stbv") {
    return (
      <div
        className={`
        absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl p-6 z-40 min-w-56
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        before:content-[''] before:absolute before:-top-2 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-4 before:h-4 before:bg-white before:border-l-2 before:border-t-2 before:border-black
        before:rotate-45 before:z-10
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <ul className="list-none p-0 m-0 relative z-10">
          {data.stbv.map((social: any, index: number) => (
            <li
              key={social.id}
              onClick={() => handleItemClick(social.id, "stbv-social")}
              className={`
                py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
                hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                transition-all duration-200 ease-out rounded-md mx-1
                transform hover:translate-x-2 hover:scale-105
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                relative overflow-hidden group
              `}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                <span className="flex flex-col items-start">
                  <span className="text-sm leading-tight">{social.name}</span>
                  {social.displayName && social.displayName !== social.name && (
                    <span className="text-xs opacity-60 font-normal normal-case leading-tight">
                      {social.displayName.includes("(pending approval)") ? "(pending approval)" : ""}
                    </span>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (tabId === "about") {
    return (
      <div
        role="menu"
        aria-labelledby="about-menu"
        className={`
        absolute top-full right-0 bg-white border-2 border-black shadow-2xl p-4 z-40 min-w-56
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <div
          className="absolute -top-2 w-4 h-4 bg-white border-l-2 border-t-2 border-black rotate-45 z-10"
          style={{
            right: "2rem",
          }}
        />

        <ul className="list-none p-0 m-0 relative z-10">
          <li role="menuitem">
            <button
              onClick={() => window.location.href = '/about'}
              className={`
                w-full text-left py-3 px-3 font-bold uppercase text-black border-b border-black/10 
                hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                transition-all duration-200 ease-out rounded-md
                transform hover:translate-x-2 hover:scale-105
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                relative overflow-hidden group no-underline
              `}
              style={{
                transitionDelay: "0ms",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
              <span className="relative z-10 flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                About Lab
              </span>
            </button>
          </li>
        </ul>
      </div>
    )
  }

  if (tabId === "overview") {
    return (
      <div
        className={`
        absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl p-6 z-40 min-w-56
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        before:content-[''] before:absolute before:-top-2 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-4 before:h-4 before:bg-white before:border-l-2 before:border-t-2 before:border-black
        before:rotate-45 before:z-10
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <ul className="list-none p-0 m-0 relative z-10">
          <li
            onClick={() => handleItemClick("overview", "overview")}
            className={`
              py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
              hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
              transition-all duration-200 ease-out rounded-md mx-1
              transform hover:translate-x-2 hover:scale-105
              ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
              relative overflow-hidden group
            `}
            style={{
              transitionDelay: "0ms",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
            <span className="relative z-10 flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
              OVERVIEW
            </span>
          </li>
        </ul>
      </div>
    )
  }

  if (tabId === "communities") {
    return (
      <div
        className={`
        absolute top-full bg-white border-2 border-black shadow-2xl p-6 z-40 min-w-56
        transition-all duration-300 ease-out backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        rounded-lg overflow-visible
      `}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          right: "0",
          transform: "translateX(0)",
          left: "auto",
        }}
      >
        <div
          className="absolute -top-2 w-4 h-4 bg-white border-l-2 border-t-2 border-black rotate-45 z-10"
          style={{
            right: "2rem",
            left: "auto",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

        <ul className="list-none p-0 m-0 relative z-10 overflow-visible">
          {data.communities.accounts.map((community: any, index: number) => {
            const communityId = `community-${community.id}-${index}`

            return (
              <li
                key={community.id}
                className="relative overflow-visible group"
                onMouseEnter={() => handleCommunityMouseEnter(communityId)}
                onMouseLeave={handleCommunityMouseLeave}
              >
                <div
                  className={`
                  py-3 px-3 cursor-pointer font-bold uppercase text-black border-b border-black/10 last:border-b-0 
                  hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10 
                  transition-all duration-200 ease-out rounded-md mx-1
                  transform hover:translate-x-2 hover:scale-105
                  ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}
                  relative overflow-hidden
                `}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                  <span className="relative z-10 flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-150" />
                    {community.name}
                    <span className="ml-auto text-xs opacity-60">◀</span>
                  </span>
                </div>

                {/* Sub-menu optimizado para communities */}
                <div
                  ref={communityMenuRef}
                  className={`
                  absolute bg-white border-2 border-black shadow-2xl p-4 min-w-52 z-[100]
                  transition-all duration-250 ease-out backdrop-blur-sm
                  ${
                    hoveredCommunity === communityId
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                  before:content-[''] before:absolute before:top-4 before:-right-2 before:w-4 before:h-4 
                  before:bg-white before:border-r-2 before:border-b-2 before:border-black
                  before:rotate-45 before:z-10
                  rounded-lg overflow-hidden
                `}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                    right: "calc(100% + 0.5rem)",
                    top: `${index * 55}px`,
                  }}
                  onMouseEnter={() => handleSubMenuMouseEnter("community", communityId)}
                  onMouseLeave={handleCommunityMouseLeave}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

                  <ul className="list-none p-0 m-0 relative z-10">
                    {data.communities.socialMedia.map((social: any, subIndex: number) => {
                      const isDisabled = social.isDisabled
                      const textColorClass = social.textColor || ""

                      return (
                        <li
                          key={social.id}
                          onClick={() => !isDisabled && handleItemClick(community.id, "community-social", social.id)}
                          className={`
                            py-2 px-3 cursor-${isDisabled ? "default" : "pointer"} text-black border-b border-black/10 last:border-b-0 
                            ${!isDisabled ? "hover:bg-gradient-to-r hover:from-black/5 hover:to-black/10" : ""}
                            transition-all duration-200 ease-out rounded-md
                            transform ${!isDisabled ? "hover:-translate-x-1 hover:scale-105" : ""}
                            ${hoveredCommunity === communityId ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}
                            relative overflow-hidden group
                          `}
                          style={{
                            transitionDelay: `${subIndex * 30}ms`,
                          }}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r from-transparent to-black/5 transform -translate-x-full ${!isDisabled ? "group-hover:translate-x-0" : ""} transition-transform duration-200`}
                          />
                          <span className="relative z-10 flex items-center text-sm">
                            <span
                              className={`w-1.5 h-1.5 bg-black rounded-full mr-2 transform scale-0 ${!isDisabled ? "group-hover:scale-100" : ""} transition-transform duration-150`}
                            />
                            <span className={`flex flex-col items-start ${textColorClass}`}>
                              <span className="leading-tight">{social.name}</span>
                              {social.displayName && social.displayName !== social.name && (
                                <span className="text-xs opacity-80 font-normal normal-case leading-tight">
                                  {social.displayName.includes("(No API)") ? "(No API)" : ""}
                                </span>
                              )}
                            </span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return null
}