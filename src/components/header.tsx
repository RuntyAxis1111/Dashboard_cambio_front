import { useState } from "react"
import { useLocation } from "react-router-dom"
import { HoverMenu } from "./hover-menu"

interface HeaderProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  onItemSelect: (itemId: string, type: string, socialId?: string) => void
  data: any
}

export function Header({ activeTab, onTabChange, onItemSelect, data }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()

  // Ocultar header completo en /assistant
  if (location.pathname === '/assistant') {
    return null
  }

  const tabs = [
    { id: "artists", label: "ARTISTS" },
    { id: "palf", label: "PALF" },
    { id: "stbv", label: "STBV" },
    { id: "communities", label: "COMMUNITIES" },
    { id: "mmm", label: "MMM" },
  ]

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)

    if (openDropdown === tabId) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(tabId)
    }
  }

  const handleDropdownClose = () => {
    setOpenDropdown(null)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white text-black z-50 shadow-md">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex-1 flex items-center justify-center w-full px-4">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold">HYBE LATIN AMERICA – DATA HUB (alpha)</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Demo Mode</span>
            </div>
          </div>
        </div>

        <nav className="flex w-full h-8 relative">
          {tabs.map((tab, index) => (
            <div key={tab.id} className={`${tab.id === 'mmm' ? 'ml-auto' : 'flex-1'} relative flex justify-center items-center`}>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`
                  ${tab.id === 'mmm' ? 'px-8' : 'w-full'} h-full font-bold text-sm uppercase transition-all duration-300 ease-out
                  transform hover:scale-105
                  ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-lg"
                      : "bg-transparent text-black hover:bg-black/10 hover:shadow-md"
                  }
                `}
                style={{
                  clipPath: index < tabs.length - 1 && tab.id !== 'mmm' ? "polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%)" : "none",
                  marginRight: index < tabs.length - 1 ? "-15px" : "0",
                  zIndex: index + 1,
                }}
              >
                <span className="inline-block transition-transform duration-200 hover:scale-110">
                  {tab.label}
                  {openDropdown === tab.id && <span className="ml-1 text-xs">▼</span>}
                </span>
              </button>

              {openDropdown === tab.id && (
                <div>
                  <HoverMenu tabId={tab.id} data={data} onItemSelect={onItemSelect} onClose={handleDropdownClose} />
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {openDropdown && <div className="fixed inset-0 z-30" onClick={handleDropdownClose} />}
    </header>
  )
}