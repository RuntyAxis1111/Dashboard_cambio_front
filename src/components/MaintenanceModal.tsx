import { X } from 'lucide-react'

interface MaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MaintenanceModal({ isOpen, onClose }: MaintenanceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <img
              src="/assets/hybelogo.png"
              alt="HYBE Logo"
              className="h-16 w-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            System Under Maintenance
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We have successfully indexed all artists into a streamlined workflow.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Maintenance Window:
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Start:</span> November 4, 2025 at 1:00 PM
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">End:</span> November 5, 2025 at 2:00 AM
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Thank you for your patience and understanding.
          </p>
        </div>
      </div>
    </div>
  )
}
