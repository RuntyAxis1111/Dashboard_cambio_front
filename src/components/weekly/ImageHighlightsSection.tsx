import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface ImageHighlight {
  image_url: string
  caption: string
  source_url?: string
}

interface ImageHighlightsSectionProps {
  images: ImageHighlight[]
}

export function ImageHighlightsSection({ images }: ImageHighlightsSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageHighlight | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No image highlights for this week</p>
      </div>
    )
  }

  const openLightbox = (image: ImageHighlight) => {
    setSelectedImage(image)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border border-gray-300 cursor-pointer hover:border-blue-600 transition-colors"
            onClick={() => openLightbox(image)}
          >
            <div className="aspect-square bg-gray-100">
              <img
                src={image.image_url}
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-900 line-clamp-2">{image.caption}</p>
              {image.source_url && (
                <a
                  href={image.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Source
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white">
              <p className="text-lg">{selectedImage.caption}</p>
              {selectedImage.source_url && (
                <a
                  href={selectedImage.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
                >
                  View Source
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
