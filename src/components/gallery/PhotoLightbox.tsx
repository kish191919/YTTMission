'use client'

import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/components/gallery/GalleryPhotoGrid'

type Props = {
  photos: GalleryPhoto[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function PhotoLightbox({ photos, index, onClose, onNavigate }: Props) {
  const photo = photos[index]

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, photos.length, onClose, onNavigate])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        title="닫기"
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 transition-colors"
      >
        <X size={28} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index - 1 + photos.length) % photos.length)
            }}
            title="이전 사진"
            className="absolute left-2 md:left-6 z-10 text-white/80 hover:text-white p-2 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index + 1) % photos.length)
            }}
            title="다음 사진"
            className="absolute right-2 md:right-6 z-10 text-white/80 hover:text-white p-2 transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div
        className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {photo.media_type === 'video' ? (
          <video
            src={photo.image_url}
            className="max-w-[90vw] max-h-[80vh] rounded-lg"
            controls
            autoPlay
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.image_url}
            alt={photo.title}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
          />
        )}
        {photo.title && <p className="text-white text-sm mt-3 text-center">{photo.title}</p>}
      </div>
    </div>
  )
}
