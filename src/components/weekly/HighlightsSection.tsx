import { ExternalLink, CheckCircle2 } from 'lucide-react'

interface Highlight {
  text: string
  link?: string
}

interface HighlightsSectionProps {
  items: Highlight[]
}

function formatTextWithColoredPercentages(text: string) {
  console.log('Original text:', text)
  // Match patterns like (+6,527,823; +318.3%) or (-1,234; -5.6%)
  const percentageRegex = /(\([+\-][\d,]+;\s*[+\-][\d.]+%\))/g
  const parts = text.split(percentageRegex)
  console.log('Split parts:', parts)

  return parts.map((part, idx) => {
    // Check if this part matches our percentage pattern by testing if it starts with (+ or (-
    if (part.startsWith('(+') || part.startsWith('(-')) {
      const isPositive = part.startsWith('(+')
      const colorClass = isPositive ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
      console.log('Matched part:', part, 'isPositive:', isPositive, 'class:', colorClass)
      return (
        <span key={idx} className={colorClass}>
          {part}
        </span>
      )
    }
    return <span key={idx}>{part}</span>
  })
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
              <span className="text-gray-900">
                {formatTextWithColoredPercentages(item.text)}
              </span>
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
