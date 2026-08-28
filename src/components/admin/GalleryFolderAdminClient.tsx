'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera, ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react'
import {
  deleteAlbumAction,
  reorderAlbumAction,
  toggleAlbumVisibilityAction,
  updateAlbumMetaAction,
} from '@/app/actions/gallery'

type Folder = {
  name: string
  year: number
  location: string | null
  isPublic: boolean
  photoCount: number
  thumbnail: string | null
}

interface Props {
  folders: Folder[]
}

export default function GalleryFolderAdminClient({ folders }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingName, setEditingName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleAction(fn: () => Promise<void>) {
    setError(null)
    startTransition(async () => {
      try {
        await fn()
        router.refresh()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '작업에 실패했습니다.')
      }
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">갤러리 폴더 관리</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-4">{error}</p>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-700">
            등록된 폴더 ({folders.length}개)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            이름·위치·연도를 수정하거나 방문자에게 숨기고, 삭제할 수 있습니다
          </p>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Camera size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">등록된 폴더가 없습니다</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {folders.map((folder, index) =>
              editingName === folder.name ? (
                <FolderEditRow
                  key={folder.name}
                  folder={folder}
                  isPending={isPending}
                  onCancel={() => setEditingName(null)}
                  onSave={(input) =>
                    handleAction(async () => {
                      await updateAlbumMetaAction(folder.name, input)
                      setEditingName(null)
                    })
                  }
                />
              ) : (
                <li key={folder.name} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {folder.thumbnail ? (
                      <Image
                        src={folder.thumbnail}
                        alt={folder.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera size={20} className="text-stone-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{folder.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {folder.year}년
                      {folder.location ? ` · ${folder.location}` : ''} · 사진 {folder.photoCount}장
                      · {folder.isPublic ? '공개' : '숨김'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleAction(() => reorderAlbumAction(folder.name, 'up'))}
                      disabled={index === 0 || isPending}
                      title="위로"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => handleAction(() => reorderAlbumAction(folder.name, 'down'))}
                      disabled={index === folders.length - 1 || isPending}
                      title="아래로"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>

                    <button
                      onClick={() => setEditingName(folder.name)}
                      disabled={isPending}
                      title="수정"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleAction(() =>
                          toggleAlbumVisibilityAction(folder.name, !folder.isPublic)
                        )
                      }
                      disabled={isPending}
                      title={folder.isPublic ? '숨기기' : '공개하기'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        folder.isPublic
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-stone-300 hover:bg-stone-100 hover:text-stone-600'
                      }`}
                    >
                      {folder.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    <button
                      onClick={() => {
                        if (
                          !confirm(
                            `'${folder.name}' 폴더와 그 안의 모든 사진·동영상을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
                          )
                        )
                          return
                        handleAction(() => deleteAlbumAction(folder.name))
                      }}
                      disabled={isPending}
                      title="삭제"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors"
                    >
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

function FolderEditRow({
  folder,
  isPending,
  onCancel,
  onSave,
}: {
  folder: Folder
  isPending: boolean
  onCancel: () => void
  onSave: (input: { name: string; location: string | null; year: number; isPublic: boolean }) => void
}) {
  const [name, setName] = useState(folder.name)
  const [location, setLocation] = useState(folder.location ?? '')
  const [year, setYear] = useState(folder.year)

  return (
    <li className="px-6 py-4 bg-amber-50/40">
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">위치</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 필리핀 마닐라"
            className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">연도</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            onSave({ name, location: location.trim() || null, year, isPublic: folder.isPublic })
          }
          disabled={isPending}
          className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          저장
        </button>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          취소
        </button>
      </div>
    </li>
  )
}
