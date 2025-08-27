import { useNavigate } from 'react-router-dom'

export default function RobynResults() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header con navegación */}
      <div className="px-4 md:px-6 py-6 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-black hover:underline font-medium mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          
          <h1 className="text-3xl font-bold text-black mb-2">
            Resultados del modelo – Pase a la Fama
          </h1>
          <p className="text-sm text-gray-500">
            Última corrida de nuestro Marketing-Mix Model
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Barra de progreso */}
          <section aria-labelledby="training-progress">
            <h2 id="training-progress" className="text-lg font-semibold text-black mb-4">
              Entrenamiento en curso: 31% completado
            </h2>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div 
                className="bg-black h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: '31%' }}
                role="progressbar"
                aria-valuenow={31}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progreso del entrenamiento del modelo"
              />
            </div>
            
            <p className="text-sm text-gray-600">
              Estimación: ~7 días restantes.
            </p>
          </section>

          {/* KPIs clave - Sección vacía */}
          <section aria-labelledby="kpis-section">
            <h2 id="kpis-section" className="text-xl font-bold text-black mb-4 border-b-2 border-black pb-2">
              KPIs clave
            </h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 italic">
                La información aparecerá automáticamente cuando el entrenamiento llegue al 100%
              </p>
            </div>
          </section>

          {/* ROI por canal - Sección vacía */}
          <section aria-labelledby="roi-section">
            <h2 id="roi-section" className="text-xl font-bold text-black mb-4 border-b-2 border-black pb-2">
              ROI por canal
            </h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 italic">
                La información aparecerá automáticamente cuando el entrenamiento llegue al 100%
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}