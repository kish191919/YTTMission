'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, CheckSquare, Download, Loader2, Trash2 } from 'lucide-react'
import PhotoItemControls from '@/components/gallery/PhotoItemControls'
import PhotoLightbox from '@/components/gallery/PhotoLightbox'
import { deleteGalleryItemAction } from '@/app/actions/gallery'

export type GalleryPhoto = {
  id: number
  title: string
  description: string | null
  image_url: string
  album: string
  taken_at: string | null
  created_at: string
  media_type: 'image' | 'video'
  user_id: string | null
}

type Props = {
  photos: GalleryPhoto[]
  admin: boolean
  currentUserId: string | null
  zipFileName: string
}

function filenameFor(photo: GalleryPhoto, index?: number) {
  const ext =
    photo.image_url.split('?')[0].split('.').pop() || (photo.media_type === 'video' ? 'mp4' : 'jpg')
  const safeTitle = photo.title.replace(/[\\/:*?"<>|]/g, '').trim() || `photo-${photo.id}`
  const prefix = index !== undefined ? `${String(index + 1).padStart(2, '0')}_` : ''
  return `${prefix}${safeTitle}.${ext}`
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function GalleryPhotoGrid({ photos, admin, currentUserId, zipFileName }: Props) {
  const router = useRouter()
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const deletablePhotos = photos.filter(
    (p) => selectedIds.has(p.id) && (admin || p.user_id === currentUserId)
  )

  function toggleSelected(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => (prev.size === photos.length ? new Set() : new Set(photos.map((p) => p.id))))
  }

  function exitSelectionMode() {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }

  function handleTileClick(photoId: number, index: number) {
    if (selectionMode) toggleSelected(photoId)
    else setLightboxIndex(index)
  }

  async function handleDownload() {
    const targets = photos.filter((p) => selectedIds.has(p.id))
    if (targets.length === 0) return

    setIsDownloading(true)
    try {
      if (targets.length === 1) {
        const blob = await fetch(targets[0].image_url).then((r) => r.blob())
        triggerBlobDownload(blob, filenameFor(targets[0]))
      } else {
        const { default: JSZip } = await import('jszip')
        const zip = new JSZip()
        const results = await Promise.allSettled(
          targets.map(async (p, i) => {
            const blob = await fetch(p.image_url).then((r) => r.blob())
            zip.file(filenameFor(p, i), blob)
          })
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        const blob = await zip.generateAsync({ type: 'blob' })
        triggerBlobDownload(blob, zipFileName)
        if (failed > 0) alert(`${failed}개 파일은 다운로드에 실패했습니다.`)
      }
    } catch {
      alert('다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  async function handleBulkDelete() {
    if (deletablePhotos.length === 0) return
    const skipped = selectedIds.size - deletablePhotos.length
    const confirmMsg =
      skipped > 0
        ? `선택한 사진 중 본인이 올린 ${deletablePhotos.length}개만 삭제됩니다. 계속하시겠습니까?`
        : `선택한 사진 ${deletablePhotos.length}개를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    if (!confirm(confirmMsg)) return

    setIsDeleting(true)
    try {
      const results = await Promise.allSettled(
        deletablePhotos.map((p) => deleteGalleryItemAction(p.id))
      )
      const failed = results.filter((r) => r.status === 'rejected').length
      setSelectedIds(new Set())
      router.refresh()
      if (failed > 0) alert(`${failed}개 삭제에 실패했습니다.`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <Camera size={48} className="mx-auto mb-4 opacity-40" />
        <p className="text-lg font-medium">아직 등록된 사진이 없습니다</p>
        <p className="text-sm mt-1">곧 선교 현장의 사진이 업로드될 예정입니다.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        {selectionMode ? (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="text-sm font-semibold text-stone-600 hover:text-amber-700 transition-colors"
              >
                {selectedIds.size === photos.length ? '전체 해제' : '전체 선택'}
              </button>
              <span className="text-sm text-stone-400">{selectedIds.size}개 선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={selectedIds.size === 0 || isDownloading || isDeleting}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    다운로드 준비 중...
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    선택 다운로드
                  </>
                )}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deletablePhotos.length === 0 || isDeleting || isDownloading}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    선택 사진삭제
                  </>
                )}
              </button>
              <button
                onClick={exitSelectionMode}
                disabled={isDownloading || isDeleting}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700 px-3 py-2 disabled:opacity-40 transition-colors"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <button
              onClick={() => setSelectionMode(true)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-600 text-sm font-semibold px-4 py-2 rounded-full transition-colors border border-stone-200"
            >
              <CheckSquare size={14} />
              사진 선택
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, index) => {
          const selected = selectedIds.has(photo.id)
          return (
            <div
              key={photo.id}
              onClick={() => handleTileClick(photo.id, index)}
              className={`group relative aspect-square bg-amber-50 rounded-xl overflow-hidden border transition-shadow duration-200 cursor-pointer ${
                selected ? 'ring-2 ring-amber-500 border-transparent' : 'border-stone-100 hover:shadow-md'
              }`}
            >
              {photo.media_type === 'video' ? (
                <video
                  src={photo.image_url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                <p className="text-white text-xs font-medium line-clamp-2">{photo.title}</p>
              </div>
              {selectionMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelected(photo.id)
                  }}
                  title={selected ? '선택 해제' : '선택'}
                  className={`absolute top-1.5 left-1.5 z-10 w-6 h-6 flex items-center justify-center rounded-lg border transition-colors ${
                    selected
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-black/40 border-white/70 text-transparent hover:bg-black/60'
                  }`}
                >
                  <Check size={13} />
                </button>
              )}
              {!selectionMode && (admin || photo.user_id === currentUserId) && (
                <div onClick={(e) => e.stopPropagation()}>
                  <PhotoItemControls
                    photoId={photo.id}
                    canEdit={photo.user_id === currentUserId}
                    canDelete={admin || photo.user_id === currentUserId}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}
