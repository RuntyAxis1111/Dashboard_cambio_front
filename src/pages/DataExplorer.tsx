import { useState } from 'react'
import { Search, Database, Table, FileText, Download } from 'lucide-react'

export function DataExplorer() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Data Explorer</h1>
          <p className="text-gray-600">
            Browse datasets, explore schemas, and discover available data sources
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">Data Explorer</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium">En desarrollo</span>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Funcionalidad para explorar datasets, esquemas y fuentes de datos. 
              Estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}