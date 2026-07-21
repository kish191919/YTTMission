'use client'

import { useState, useTransition } from 'react'
import { updateGalleryItemAction } from '@/app/actions/gallery'

type Props = {
  galleryId: number
  initialTitle: string
  initialDescription: string | null
  initialAlbum: string
  initialTakenAt: string | null
  mediaUrl: string
  mediaType: 'image' | 'video'
}

export default function GalleryEditClient({
  galleryId,
  initialTitle,
  initialDescription,
  initialAlbum,
  initialTakenAt,
  mediaUrl,
  mediaType,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription ?? '')
  const [album, setAlbum] = useState(initialAlbum)
  const [takenAt, setTakenAt] = useState(initialTakenAt ?? '')
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)

    if (!title.trim() || !album.trim()) {
      setGlobalError('제목과 앨범 이름을 입력해주세요.')
      return
    }

    startTransition(async () => {
      try {
        await updateGalleryItemAction(galleryId, {
          title: title.trim(),
          description: description.trim() || null,
          album: album.trim(),
          takenAt: takenAt || null,
        })
      } catch (err: unknown) {
        setGlobalError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      }
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      <div className="bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black text-stone-800">사진·동영상 정보 수정</h1>
          <p className="text-stone-500 mt-2">제목, 앨범, 설명, 촬영일을 수정할 수 있습니다.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <p className="text-sm font-semibold text-stone-700 mb-3">미리보기</p>
            <div className="rounded-xl overflow-hidden bg-stone-50 border border-stone-100 aspect-video">
              {mediaType === 'video' ? (
                <video src={mediaUrl} className="w-full h-full object-contain" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt={title} className="w-full h-full object-contain" />
              )}
            </div>
            <p className="mt-2 text-xs text-stone-400">
              파일 자체를 교체하려면 삭제 후 다시 업로드해주세요.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">앨범 이름</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">촬영일</label>
              <input
                type="date"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {globalError && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{globalError}</p>
          )}

          <div className="flex items-center justify-end gap-3">
            <a
              href="/gallery"
              className="px-5 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-800 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              취소
            </a>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
