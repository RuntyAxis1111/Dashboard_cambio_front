import { Bell, Download, Share, Database } from 'lucide-react'

export function ActionBar() {
  return (
    <div className="flex gap-2">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
        <Bell className="w-4 h-4" />
        Subscribe
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg transition-colors text-black">
        <Download className="w-4 h-4" />
        Export
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg transition-colors text-black">
        <Database className="w-4 h-4" />
        Open in Data Explorer
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg transition-colors text-black">
        <Share className="w-4 h-4" />
        Share
      </button>
    </div>
  )
}