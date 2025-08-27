import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Newspaper, Download, MoreVertical } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useMediaQuery } from "../hooks/use-media-query"

type Tab = "metrics" | "news"

interface ArtistPanelProps {
  artist: {
    id: string
    name: string
    reportUrls: string[]
  } | null
}

export function ArtistPanel({ artist }: ArtistPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("metrics")
  const [hasMountedNews, setHasMountedNews] = useState(false)
  const [isNewsLoading, setIsNewsLoading] = useState(false)
  const [newsLoadError, setNewsLoadError] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const panelContentRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    metrics: null,
    news: null,
  })

  useEffect(() => {
    setActiveTab("metrics")
    setHasMountedNews(false)
    setIsNewsLoading(false)
    setNewsLoadError(false)
  }, [artist])

  const NEWS_IFRAME_URL =
    "https://app.meltwater.com/shareable-dashboards/presentation/viewer/fe3558eb-fc9b-42cd-a3b2-acfce10aa240#slide-AF-contentStream"

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === "news" && !hasMountedNews) {
      setHasMountedNews(true)
      setIsNewsLoading(true)
    }
    panelContentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsIconClick = () => {
    handleTabClick("news")
    tabRefs.current["news"]?.focus()
  }

  const handleDownloadClick = () => {
    alert("Downloading PDF...")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tabs: Tab[] = ["metrics", "news"]
    const currentIndex = tabs.indexOf(activeTab)
    let nextIndex = -1

    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    if (nextIndex !== -1) {
      const nextTab = tabs[nextIndex]
      tabRefs.current[nextTab]?.focus()
      handleTabClick(nextTab)
    }
  }

  if (!artist) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Select an Artist</h2>
          <p className="mt-2 text-gray-500">Please choose an artist from the main menu to view their data.</p>
        </div>
      </div>
    )
  }

  const renderIcons = () => (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleNewsIconClick}
              aria-label="Últimas noticias"
              className="opacity-70 hover:opacity-100 active:opacity-40 transition-opacity"
            >
              <Newspaper className="h-[26px] w-[26px]" strokeWidth={1.25} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Últimas noticias</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDownloadClick}
              aria-label="Descargar PDF"
              className="opacity-70 hover:opacity-100 active:opacity-40 transition-opacity"
            >
              <Download className="h-[26px] w-[26px]" strokeWidth={1.25} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Descargar PDF</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Panel Header */}
      <div className="flex-shrink-0 bg-black text-white h-11 flex items-center justify-between px-6">
        <h2 className="text-base font-bold uppercase">{artist.name} PANEL</h2>
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Más opciones">
                <MoreVertical className="h-[26px] w-[26px]" strokeWidth={1.25} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleNewsIconClick}>
                <Newspaper className="mr-2 h-4 w-4" />
                <span>Últimas noticias</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadClick}>
                <Download className="mr-2 h-4 w-4" />
                <span>Descargar PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          renderIcons()
        )}
      </div>

      {/* Sticky Tabs Bar */}
      <div className="sticky top-0 z-10 bg-white">
        <div role="tablist" aria-label="Artist panel navigation" className="flex h-7 sm:h-8">
          {(["metrics", "news"] as Tab[]).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              ref={(el) => (tabRefs.current[tab] = el)}
              role="tab"
              type="button"
              aria-controls={`panel-${tab}`}
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => handleTabClick(tab)}
              onKeyDown={handleKeyDown}
              className={`
                flex-1 py-1 sm:px-5 px-3 capitalize text-[13px] font-semibold transition-all duration-150 ease-in
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black
                ${
                  activeTab === tab
                    ? "text-gray-900 border-b-[3px] border-gray-900"
                    : "text-gray-500 border-b-[3px] border-transparent hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div ref={panelContentRef} className="flex-1 overflow-y-auto pt-2 px-4 sm:px-6">
        <div id="panel-metrics" role="tabpanel" hidden={activeTab !== "metrics"}>
          <iframe
            src={artist.reportUrls[0]}
            title={`${artist.name} - Metrics`}
            className="w-full rounded-lg min-h-[450px] sm:min-h-[600px]"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
        <div id="panel-news" role="tabpanel" hidden={activeTab !== "news"}>
          {hasMountedNews && (
            <div className="w-full">
              {newsLoadError ? (
                <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200 min-h-[450px] sm:min-h-[600px] flex items-center justify-center">
                  <p className="text-red-700">
                    Could not load the news feed.{" "}
                    <a
                      href={NEWS_IFRAME_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline hover:text-red-900"
                    >
                      Open in a new tab.
                    </a>
                  </p>
                </div>
              ) : (
                <div className="relative w-full min-h-[450px] sm:min-h-[600px]">
                  {isNewsLoading && <div className="absolute inset-0 bg-gray-200 rounded-xl animate-pulse" />}
                  <iframe
                    src={NEWS_IFRAME_URL}
                    title="Meltwater – Daddy Yankee News"
                    loading="lazy"
                    onLoad={() => setIsNewsLoading(false)}
                    onError={() => {
                      setIsNewsLoading(false)
                      setNewsLoadError(true)
                    }}
                    className={`w-full h-full absolute top-0 left-0 rounded-xl shadow-lg transition-opacity duration-300 ${
                      isNewsLoading ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ minHeight: "inherit" }}
                    allow="fullscreen"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}