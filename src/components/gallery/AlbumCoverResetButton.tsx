'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Loader2 } from 'lucide-react'
import { resetAlbumCoverAction } from '@/app/actions/gallery'

export default function AlbumCoverResetButton({ album }: { album: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleReset() {
    if (!confirm('대표 이미지를 자동(최근 업로드) 방식으로 되돌리시겠습니까?')) return
    startTransition(async () => {
      await resetAlbumCoverAction(album)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleReset}
      disabled={isPending}
      title="대표 이미지 자동으로 되돌리기"
      className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-amber-600 disabled:opacity-60 transition-colors"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
      대표 이미지 초기화
    </button>
  )
}
