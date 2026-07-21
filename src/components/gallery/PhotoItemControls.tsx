'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Pencil, Loader2 } from 'lucide-react'
import { deleteGalleryItemAction } from '@/app/actions/gallery'

interface Props {
  photoId: number
  canEdit: boolean
  canDelete: boolean
}

export default function PhotoItemControls({ photoId, canEdit, canDelete }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return
    startTransition(async () => {
      await deleteGalleryItemAction(photoId)
      router.refresh()
    })
  }

  return (
    <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
      {canEdit && (
        <Link
          href={`/gallery/${photoId}/edit`}
          title="수정"
          className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-amber-600 transition-colors"
        >
          <Pencil size={13} />
        </Link>
      )}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          title="삭제"
          className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>
      )}
    </div>
  )
}
