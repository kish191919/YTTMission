'use client'

import { useState, useTransition } from 'react'
import { Pencil, Loader2 } from 'lucide-react'
import { updateAlbumYearAction } from '@/app/actions/gallery'

export default function AlbumYearEditor({ album, year }: { album: string; year: number }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(year)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (!isEditing) {
    return (
      <button
        onClick={() => {
          setValue(year)
          setIsEditing(true)
        }}
        className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-amber-600 transition-colors"
      >
        <Pencil size={12} />
        {year}년
      </button>
    )
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      try {
        await updateAlbumYearAction(album, value)
        setIsEditing(false)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-20 border border-stone-300 rounded px-2 py-1 text-sm"
      />
      <button
        onClick={handleSave}
        disabled={isPending}
        className="text-sm text-amber-600 font-semibold disabled:opacity-60"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : '저장'}
      </button>
      <button onClick={() => setIsEditing(false)} className="text-sm text-stone-400">
        취소
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
