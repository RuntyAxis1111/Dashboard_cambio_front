interface DashboardFrameProps {
  url: string
  title: string
}

export function DashboardFrame({ url, title }: DashboardFrameProps) {
  const isLookerStudio = url.includes('lookerstudio.google.com')
  const isExternal = !isLookerStudio

  if (isExternal) {
    return (
      <div className="h-[600px] bg-neutral-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-neutral-300 mb-2">External Dashboard</div>
          <div className="text-sm text-neutral-500 mb-4">{title}</div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] bg-neutral-800 rounded-lg overflow-hidden">
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
        onError={() => {
          console.error('Failed to load dashboard:', url)
        }}
      />
    </div>
  )
}