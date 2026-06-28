'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import {
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Film,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import {
  saveHeroMedia,
  deleteHeroMedia,
  toggleHeroMedia,
  reorderHeroMedia,
} from '@/app/actions/hero-media'
import type { Database } from '@/lib/supabase'

type HeroMediaRow = Database['public']['Tables']['hero_media']['Row']

interface Props {
  items: HeroMediaRow[]
}

export default function HeroAdminClient({ items }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploadProgress('업로드 중...')

    const isVideo = file.type.startsWith('video/')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const json = await res.json()

    if (!res.ok) {
      setUploadError(`업로드 실패: ${json.error ?? res.statusText}`)
      setUploadProgress(null)
      return
    }

    setUploadProgress('저장 중...')

    startTransition(async () => {
      await saveHeroMedia(
        json.publicUrl,
        json.storagePath,
        isVideo ? 'video' : 'image',
        title || file.name
      )
      setTitle('')
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      router.refresh()
    })
  }

  function handleAction(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">히어로 미디어 관리</h1>

      {/* 업로드 영역 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <Upload size={17} />
          새 미디어 업로드
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              제목 (선택)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="미디어 제목을 입력하세요"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              파일 선택 (이미지: JPG/PNG/WebP, 동영상: MP4/WebM)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleFileUpload}
              disabled={uploadProgress !== null || isPending}
              className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 disabled:opacity-50"
            />
          </div>

          {uploadProgress !== null && (
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Loader2 size={15} className="animate-spin" />
              {uploadProgress}
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>
          )}
        </div>
      </div>

      {/* 미디어 목록 */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-700">
            등록된 미디어 ({items.length}개)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">순서대로 홈페이지 슬라이드쇼에 표시됩니다</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">등록된 미디어가 없습니다</p>
            <p className="text-xs mt-1">위에서 파일을 업로드해주세요</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                {/* 썸네일 */}
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {item.media_type === 'image' ? (
                    <Image
                      src={item.media_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-800">
                      <Film size={22} className="text-white opacity-70" />
                    </div>
                  )}
                  <span className="absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                    {item.media_type === 'video' ? '동영상' : '이미지'}
                  </span>
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {item.title || '(제목 없음)'}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    순서 {item.display_order} · {item.active ? '표시중' : '숨김'}
                  </p>
                </div>

                {/* 컨트롤 */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleAction(() => reorderHeroMedia(item.id, 'up'))}
                    disabled={index === 0 || isPending}
                    title="위로"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleAction(() => reorderHeroMedia(item.id, 'down'))}
                    disabled={index === items.length - 1 || isPending}
                    title="아래로"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>

                  <button
                    onClick={() => handleAction(() => toggleHeroMedia(item.id, !item.active))}
                    disabled={isPending}
                    title={item.active ? '숨기기' : '표시하기'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.active
                        ? 'text-amber-600 hover:bg-amber-50'
                        : 'text-stone-300 hover:bg-stone-100 hover:text-stone-600'
                    }`}
                  >
                    {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm(`"${item.title || '이 항목'}"을 삭제하시겠습니까?`)) return
                      handleAction(() => deleteHeroMedia(item.id, item.storage_path))
                    }}
                    disabled={isPending}
                    title="삭제"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-4 text-center">
        변경 사항은 즉시 홈페이지에 반영됩니다
      </p>
    </div>
  )
}
