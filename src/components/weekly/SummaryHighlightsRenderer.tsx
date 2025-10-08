import { ExternalLink, CheckCircle } from 'lucide-react'

interface SummaryHighlightsProps {
  data: {
    highlights?: string[]
    links?: { url: string; label: string }[]
    summary?: string
  }
}

export function SummaryHighlightsRenderer({ data }: SummaryHighlightsProps) {
  return (
    <div className="space-y-4">
      {data.summary && (
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      )}

      {data.highlights && data.highlights.length > 0 && (
        <div className="space-y-2">
          {data.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-800">{highlight}</span>
            </div>
          ))}
        </div>
      )}

      {data.links && data.links.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {link.label}
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
