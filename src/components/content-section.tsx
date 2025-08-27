import { useState } from "react"
import { ArtistPanel } from "./artist-panel"

interface ContentSectionProps {
  activeTab: string
  selectedItem: {
    id: string
    type: string
    socialId?: string
  } | null
  data: any
}

export function ContentSection({ activeTab, selectedItem, data }: ContentSectionProps) {
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  const getReportUrl = () => {
    if (!selectedItem || activeTab === "artists") return null

    if (activeTab === "mmm") return null // MMM has custom content, no iframe

    const { id, type, socialId } = selectedItem

    if (type === "palf-social") {
      const social = data.palf.socialMedia.find((s: any) => s.id === id)
      return social?.palfReportUrl || null
    }

    if (type === "palf-band-social") {
      const social = data.palf.socialMedia.find((s: any) => s.id === socialId)
      return social?.palfReportUrl || data.stbv[0]?.stbvReportUrl || null
    }

    if (type === "stbv-social") {
      const social = data.stbv.find((s: any) => s.id === id)
      return social?.stbvReportUrl || null
    }

    if (type === "community-social") {
      const social = data.communities.socialMedia.find((s: any) => s.id === socialId)
      if (social?.isDisabled) return null

      if (social?.communityReportUrls && social.communityReportUrls[id]) {
        return social.communityReportUrls[id]
      }
      return null
    }

    return null
  }

  const generateShareableUrl = () => {
    if (!selectedItem) return null
    
    const { id, type, socialId } = selectedItem
    const baseUrl = window.location.origin
    
    if (type === "artist") {
      return `${baseUrl}/artists/${id}`
    }
    
    if (type === "palf-social") {
      return `${baseUrl}/palf/${id}`
    }
    
    if (type === "palf-band-social") {
      return `${baseUrl}/palf/${socialId}`
    }
    
    if (type === "stbv-social") {
      return `${baseUrl}/stbv/${id}`
    }
    
    if (type === "community-social") {
      return `${baseUrl}/communities/${id}/${socialId}`
    }
    
    return null
  }

  const handleShareReport = async () => {
    const shareUrl = generateShareableUrl()
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    }
  }

  const reportUrl = getReportUrl()

  const selectedArtist =
    activeTab === "artists" && selectedItem?.type === "artist"
      ? data.artists.find((a: any) => a.id === selectedItem.id)
      : null

  const renderQueEsContent = () => (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-8 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <header>
          <h1 id="mmm-title" className="text-3xl font-bold text-black mb-2">
            Robyn – Marketing-Mix Model
          </h1>
        </header>


        <section id="que-es" aria-labelledby="que-es-section">
          <h2 id="que-es-section" className="text-2xl font-bold text-black mb-4 border-b-2 border-black pb-2">
            ¿Qué es?
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Robyn es un <strong>modelo de Marketing-Mix open-source</strong> desarrollado por Meta. Estima la contribución real de cada canal de marketing a un KPI (ventas, streams, leads) y, además, sugiere el reparto de presupuesto que maximiza tu retorno.
          </p>

          <h3 className="text-xl font-semibold text-black mt-10 mb-4">1. Concepto</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              <strong>Regresión ridge + GA optimization</strong>: prueba miles de combinaciones de adstock y saturación para hallar el ajuste con mejor R<sup>2</sup>.
            </li>
            <li>
              <strong>Análisis incremental</strong>: separa la «marea base» (tendencias y estacionalidad) del impacto de cada gasto publicitario.
            </li>
            <li>
              <strong>Explainable</strong>: expone hiper-parámetros y métricas de error para auditar cada corrida.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-black mt-10 mb-4">2. ¿Cómo funciona?</h3>
          <ol className="list-decimal ml-6 space-y-2 text-gray-700">
            <li>
              <em>Input</em>: (Min 32) se recomiendan 104 semanas de datos sobre los KPI + inversión por canal + variables de control (feriados, precio dólar).
            </li>
            <li>
              <em>Modelado</em>: genera &gt;10 000 modelos; selecciona el óptimo con NSGA-II (trade-off entre error y complejidad).
            </li>
            <li>
              <em>Outputs</em>: ROI, curvas de saturación, adstock half-life, recomendación de presupuesto y serie de tendencia.
            </li>
          </ol>

          <h3 className="text-xl font-semibold text-black mt-10 mb-4">3. ¿Por qué nos sirve en HYBE?</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              <strong>Optimizar campañas</strong>: mover budget ~15-20 % hacia canales con ROI alto.
            </li>
            <li>
              <strong>Alertas tempranas</strong>: detector de inflexiones de tendencia para reaccionar a hype o crisis.
            </li>
            <li>
              <strong>Cero lock-in</strong>: al ser open-source, controlamos datos, lógica y costos.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-black mt-10 mb-4">4. Limitaciones a considerar</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              Requiere datos limpios y continuos; huecos &gt; 8 sem deforman resultados.
            </li>
            <li>
              No reemplaza experimentos A/B para causalidad perfecta.
            </li>
            <li>
              Carga computacional alta: una corrida completa puede tardar 30-60 min.
            </li>
          </ul>

          <hr className="my-12 border-t-2 border-gray-200" role="presentation" />
          
          {/* Tabla de ejemplo */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-2 border-black bg-white">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-black px-4 py-3 text-left font-bold">Canal</th>
                  <th className="border border-black px-4 py-3 text-left font-bold">Inversión Mensual</th>
                  <th className="border border-black px-4 py-3 text-left font-bold">ROI</th>
                  <th className="border border-black px-4 py-3 text-left font-bold">Punto de Saturación</th>
                  <th className="border border-black px-4 py-3 text-left font-bold">Recomendación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-3 font-semibold">Meta Ads</td>
                  <td className="border border-black px-4 py-3">50 000 USD</td>
                  <td className="border border-black px-4 py-3 text-green-600 font-semibold">2.8×</td>
                  <td className="border border-black px-4 py-3">60 000 USD</td>
                  <td className="border border-black px-4 py-3 text-green-600 font-semibold">↑ 10 %</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-3 font-semibold">YouTube</td>
                  <td className="border border-black px-4 py-3">30 000 USD</td>
                  <td className="border border-black px-4 py-3 text-yellow-600 font-semibold">1.6×</td>
                  <td className="border border-black px-4 py-3">35 000 USD</td>
                  <td className="border border-black px-4 py-3 text-gray-600 font-semibold">=</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-3 font-semibold">TikTok</td>
                  <td className="border border-black px-4 py-3">15 000 USD</td>
                  <td className="border border-black px-4 py-3 text-green-600 font-semibold">4.2×</td>
                  <td className="border border-black px-4 py-3">25 000 USD</td>
                  <td className="border border-black px-4 py-3 text-green-600 font-semibold">↑ 25 %</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-3 font-semibold">OOH</td>
                  <td className="border border-black px-4 py-3">20 000 USD</td>
                  <td className="border border-black px-4 py-3 text-red-600 font-semibold">0.9×</td>
                  <td className="border border-black px-4 py-3">22 000 USD</td>
                  <td className="border border-black px-4 py-3 text-red-600 font-semibold">↓ 50 %</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 italic">
            *Datos ficticios para ilustración.
          </p>

          {/* CTA Section */}
          <section className="text-center py-8">
            <a
              href="/mmm/results"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = '/mmm/results'
              }}
              className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Ver resultados del modelo Robyn MMM"
            >
              Ver resultados del modelo
            </a>
          </section>
        </section>
      </div>
    </div>
  )

  const renderComoLoUsamosContent = () => (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-8 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <header>
          <h1 id="mmm-title" className="text-3xl font-bold text-black mb-2">
            Robyn – Marketing-Mix Model
          </h1>
        </header>

        <section id="como-lo-usamos" aria-labelledby="como-usamos-section">
          <h2 id="como-usamos-section" className="text-2xl font-bold text-black mb-4 border-b-2 border-black pb-2">
            ¿Cómo lo estamos usando?
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Estamos implementando Robyn como <strong>motor analítico central</strong> del Data Hub.
            A continuación se detalla el flujo operativo:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
            <li className="leading-relaxed">
              Extraemos métricas semanales de cada red social y gasto publicitario.
            </li>
            <li className="leading-relaxed">
              Alimentamos a Robyn con <strong>2 años</strong> de historia por canal.
            </li>
            <li className="leading-relaxed">
              Re-entrenamos todos los lunes 02:00 a.m.; si detecta un cambio de tendencia ±30 % envía alerta a Slack.
            </li>
            <li className="leading-relaxed">
              Los resultados (ROI, curvas y recomendación de presupuesto) se publican en el sub-tab "Resultados".
            </li>
          </ol>

          <hr className="my-12 border-t-2 border-gray-200" role="presentation" />

          {/* Datasets Section */}
          <h3 className="text-xl font-bold text-black mb-4">
            Datasets iniciales en BigQuery
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            <em>Project ID = `dashboards-api-chartmetric`</em>
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {data.mmm.datasets.map((dataset: any, index: number) => (
              <div key={index} className="border-2 border-black rounded-lg p-4 bg-gray-50">
                <h4 className="font-bold text-black mb-2">{dataset.canal}</h4>
                <p className="text-sm text-gray-600 mb-2 font-mono">
                  {dataset.tabla}
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">Campos:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {dataset.campos.map((campo: string, campoIndex: number) => (
                      <li key={campoIndex} className="font-mono bg-white px-2 py-1 rounded border">
                        {campo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* CTA Section */}
        <section className="text-center py-8">
          <a
            href="/mmm/results"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = '/mmm/results'
            }}
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Ver resultados del modelo Robyn MMM"
          >
            Ver resultados del modelo
          </a>
        </section>
      </div>
    </div>
  )

  const renderMMMContent = () => {
    if (!selectedItem || selectedItem.type !== "mmm-section") {
      return renderQueEsContent() // Default to "¿Qué es?" when no section is selected
    }

    if (selectedItem.id === "que-es") {
      return renderQueEsContent()
    }

    if (selectedItem.id === "como-lo-usamos") {
      return renderComoLoUsamosContent()
    }

    return renderQueEsContent() // Fallback
  }

  return (
    <div className={activeTab === "mmm" ? "h-[calc(100vh-4rem)] bg-white" : "p-4 h-[calc(100vh-4rem)]"}>
      {activeTab === "mmm" ? (
        renderMMMContent()
      ) : (
        <div className="w-full h-full bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg flex flex-col">
        {activeTab === "artists" ? (
          <ArtistPanel artist={selectedArtist} />
        ) : reportUrl ? (
          <>
            <div className="bg-black text-white p-3 flex justify-between items-center flex-shrink-0 h-16 relative">
              <span className="font-bold uppercase">{`${activeTab.toUpperCase()} Data Panel`}</span>
              
              {/* Share Report Button */}
              <button
                onClick={handleShareReport}
                className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative group"
                title="Share Report"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Share Report
                </div>
              </button>
              
              {/* Success Message */}
              {showCopyMessage && (
                <div className="absolute top-full right-0 mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                  ✓ URL copiada al portapapeles
                </div>
              )}
            </div>
            <div className="flex-1 h-full overflow-y-auto">
              <iframe
                src={reportUrl}
                title={`${activeTab.toUpperCase()} Data Panel`}
                className="w-full h-full border-0"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              title={`${activeTab.toUpperCase()} Video`}
              key={activeTab}
            >
              <source src={`/${activeTab}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      )}
    </div>
  )
}