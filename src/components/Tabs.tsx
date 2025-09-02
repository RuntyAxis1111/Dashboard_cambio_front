import { useState } from 'react'

interface TabsProps {
  tabs: string[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0])

  return (
    <div className="border-b border-gray-300">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}