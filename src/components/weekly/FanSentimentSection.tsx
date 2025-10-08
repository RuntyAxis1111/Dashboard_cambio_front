import { ExternalLink, Quote } from 'lucide-react'

interface FanSentimentItem {
  image_url?: string
  quote?: string
  source_url?: string
}

interface FanSentimentSectionProps {
  items: FanSentimentItem[]
}

export function FanSentimentSection({ items }: FanSentimentSectionProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No fan sentiment data for this week</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-600 transition-colors">
          {item.image_url && (
            <div className="aspect-video bg-gray-100">
              <img
                src={item.image_url}
                alt={item.quote || 'Fan content'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            {item.quote && (
              <div className="flex gap-2 mb-2">
                <Quote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-900 italic">{item.quote}</p>
              </div>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
              >
                View Source
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
