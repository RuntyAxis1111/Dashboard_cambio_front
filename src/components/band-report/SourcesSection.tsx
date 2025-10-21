import { CheckCircle, XCircle } from 'lucide-react'

interface Source {
  fuente_clave: string
  fuente_nombre?: string
  etiqueta: string
  ok?: boolean
  status?: string
  mensaje?: string | null
}

interface SourcesSectionProps {
  sources: Source[]
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  if (sources.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6">
        <p className="text-gray-500 text-center">No sources data available yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6">
      <div className="space-y-3">
        {sources.map((source, idx) => {
          const isOk = source.ok ?? (source.status === 'ok' || source.status === 'OK')
          const displayName = source.fuente_nombre || source.etiqueta

          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {isOk ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{displayName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${isOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isOk ? 'OK' : 'Failed'}
                  </span>
                </div>
                {source.mensaje && !isOk && (
                  <p className="text-sm text-gray-600 mt-1">{source.mensaje}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
