'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Pencil, Loader2 } from 'lucide-react'
import { deletePostAction } from '@/app/actions/posts'

interface Props {
  postId: number
}

export default function PostAdminControls({ postId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return
    startTransition(async () => {
      await deletePostAction(postId)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <Link
        href={`/board/${postId}/edit`}
        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Pencil size={12} />
        수정
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-600 bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        삭제
      </button>
    </div>
  )
}
