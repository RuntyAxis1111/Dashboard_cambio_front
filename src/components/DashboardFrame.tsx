interface DashboardFrameProps {
  project?: string
  source?: string
  band?: string
}

export function DashboardFrame({ project, source, band }: DashboardFrameProps) {
  // This would contain the actual dashboard embed logic
  // For now, showing a placeholder that maintains the existing dashboard structure
  
  return (
    <div className="h-[600px] bg-neutral-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-neutral-500 mb-2">Dashboard Frame</div>
        <div className="text-sm text-neutral-600">
          {band 
            ? `${project} • Band: ${band}`
            : `${project} • ${source}`
          }
        </div>
        <div className="text-xs text-neutral-700 mt-2">
          Existing dashboard embed would load here
        </div>
      </div>
    </div>
  )
}