'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteAlbumAction } from '@/app/actions/gallery'

export default function AlbumDeleteButton({ album }: { album: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    if (
      !confirm(
        `'${album}' 앨범과 그 안의 모든 사진·동영상을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    )
      return
    setError(null)
    startTransition(async () => {
      try {
        await deleteAlbumAction(album)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-60"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        앨범 전체 삭제
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
