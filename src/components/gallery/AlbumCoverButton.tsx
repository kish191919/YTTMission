'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Loader2 } from 'lucide-react'
import { setAlbumCoverAction } from '@/app/actions/gallery'

interface Props {
  album: string
  photoId: number
  isCover: boolean
}

export default function AlbumCoverButton({ album, photoId, isCover }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (isCover || isPending) return
    startTransition(async () => {
      await setAlbumCoverAction(album, photoId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isCover ? '현재 폴더 대표 이미지' : '폴더 대표 이미지로 설정'}
      className={`absolute top-1.5 left-1.5 z-10 p-1.5 rounded-lg transition-colors ${
        isCover
          ? 'bg-amber-500 text-white'
          : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-amber-600'
      }`}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Star size={13} fill={isCover ? 'currentColor' : 'none'} />
      )}
    </button>
  )
}
