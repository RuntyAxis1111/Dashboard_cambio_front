import { ExternalLink, CheckCircle2 } from 'lucide-react'

interface Highlight {
  text: string
  link?: string
}

interface HighlightsSectionProps {
  items: Highlight[]
}

export function HighlightsSection({ items }: HighlightsSectionProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No highlights for this week</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-gray-900">{item.text}</span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
