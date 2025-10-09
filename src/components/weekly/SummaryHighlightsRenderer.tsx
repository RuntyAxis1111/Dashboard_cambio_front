import { ExternalLink } from 'lucide-react'

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
        <p className="text-gray-900 leading-relaxed">{data.summary}</p>
      )}

      {data.highlights && data.highlights.length > 0 && (
        <ul className="space-y-2 list-none">
          {data.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-black font-bold mt-1">•</span>
              <span className="text-gray-900 flex-1">{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      {data.links && data.links.length > 0 && (
        <div className="mt-4">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
