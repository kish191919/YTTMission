'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Upload, X, ImageIcon, Film, CheckCircle, Loader2, ImagePlus } from 'lucide-react'
import { saveGalleryItemsAction } from '@/app/actions/gallery'
import { captureVideoThumbnail } from '@/lib/captureVideoThumbnail'

type FileEntry = {
  id: string
  file: File
  title: string
  mediaType: 'image' | 'video'
  status: 'pending' | 'uploading' | 'done' | 'error'
  errorMsg?: string
  url?: string
  thumbBlob?: Blob | File
  thumbPreviewUrl?: string
  thumbSource?: 'auto' | 'custom' | 'none'
  thumbStatus?: 'generating' | 'ready' | 'error'
}

type Props = {
  userId: string
}

export default function GalleryUploadClient({ userId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const [album, setAlbum] = useState('')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [thumbTargetId, setThumbTargetId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const entriesRef = useRef(entries)
  useEffect(() => {
    entriesRef.current = entries
  }, [entries])
  useEffect(() => {
    return () => {
      entriesRef.current.forEach((entry) => {
        if (entry.thumbPreviewUrl) URL.revokeObjectURL(entry.thumbPreviewUrl)
      })
    }
  }, [])

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newEntries: FileEntry[] = files.map((file) => {
      const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
        mediaType,
        status: 'pending',
        thumbStatus: mediaType === 'video' ? 'generating' : undefined,
        thumbSource: mediaType === 'video' ? 'auto' : undefined,
      }
    })
    setEntries((prev) => [...prev, ...newEntries])
    if (fileInputRef.current) fileInputRef.current.value = ''

    for (const entry of newEntries) {
      if (entry.mediaType !== 'video') continue
      captureVideoThumbnail(entry.file, 2).then((blob) => {
        setEntries((prev) =>
          prev.map((e) => {
            if (e.id !== entry.id) return e
            if (e.thumbSource === 'custom') return e
            if (!blob) return { ...e, thumbStatus: 'error', thumbSource: 'none' }
            return {
              ...e,
              thumbBlob: blob,
              thumbPreviewUrl: URL.createObjectURL(blob),
              thumbStatus: 'ready',
              thumbSource: 'auto',
            }
          })
        )
      })
    }
  }

  function removeEntry(idx: number) {
    setEntries((prev) => {
      const target = prev[idx]
      if (target?.thumbPreviewUrl) URL.revokeObjectURL(target.thumbPreviewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }

  function updateTitle(idx: number, title: string) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, title } : e)))
  }

  function openThumbPicker(id: string) {
    setThumbTargetId(id)
    thumbInputRef.current?.click()
  }

  function handleThumbSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const targetId = thumbTargetId
    e.target.value = ''
    setThumbTargetId(null)
    if (!file || !targetId) return

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== targetId) return entry
        if (entry.thumbPreviewUrl) URL.revokeObjectURL(entry.thumbPreviewUrl)
        return {
          ...entry,
          thumbBlob: file,
          thumbPreviewUrl: URL.createObjectURL(file),
          thumbSource: 'custom',
          thumbStatus: 'ready',
        }
      })
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)

    if (!album.trim()) {
      setGlobalError('앨범 이름을 입력해주세요.')
      return
    }
    if (entries.length === 0) {
      setGlobalError('업로드할 파일을 선택해주세요.')
      return
    }

    const uploaded: {
      title: string
      mediaUrl: string
      mediaType: 'image' | 'video'
      album: string
      thumbnailUrl?: string
    }[] = []

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      setEntries((prev) =>
        prev.map((e, idx) => (idx === i ? { ...e, status: 'uploading' } : e))
      )

      const ext = entry.file.name.split('.').pop()
      const storagePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from('member-uploads')
        .upload(storagePath, entry.file, { upsert: false })

      if (error || !data) {
        setEntries((prev) =>
          prev.map((e, idx) =>
            idx === i ? { ...e, status: 'error', errorMsg: error?.message ?? '업로드 실패' } : e
          )
        )
        continue
      }

      const { data: urlData } = supabase.storage.from('member-uploads').getPublicUrl(data.path)
      const publicUrl = urlData.publicUrl

      let thumbnailUrl: string | undefined
      if (entry.mediaType === 'video' && entry.thumbBlob) {
        const thumbExt = entry.thumbBlob instanceof File ? entry.thumbBlob.name.split('.').pop() || 'jpg' : 'jpg'
        const thumbPath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}-thumb.${thumbExt}`
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from('member-uploads')
          .upload(thumbPath, entry.thumbBlob, { upsert: false })
        if (!thumbError && thumbData) {
          const { data: thumbUrlData } = supabase.storage.from('member-uploads').getPublicUrl(thumbData.path)
          thumbnailUrl = thumbUrlData.publicUrl
        }
      }

      setEntries((prev) =>
        prev.map((e, idx) => (idx === i ? { ...e, status: 'done', url: publicUrl } : e))
      )

      uploaded.push({
        title: entry.title || entry.file.name,
        mediaUrl: publicUrl,
        mediaType: entry.mediaType,
        album: album.trim(),
        thumbnailUrl,
      })
    }

    if (uploaded.length === 0) {
      setGlobalError('업로드에 성공한 파일이 없습니다.')
      return
    }

    startTransition(() => saveGalleryItemsAction(uploaded))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      <div className="bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black text-stone-800">사진·동영상 올리기</h1>
          <p className="text-stone-500 mt-2">갤러리에 사진첩을 만들어 업로드하세요.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 앨범 이름 */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-2">앨범 이름</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="예: 2025 몽골 선교, 여름 수련회"
            />
            <p className="mt-1.5 text-xs text-stone-400">
              새 앨범 이름을 입력하거나 기존 앨범에 추가하려면 같은 이름을 입력하세요.
            </p>
          </div>

          {/* 파일 선택 */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-stone-700">파일 선택</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold rounded-xl transition-colors border border-amber-200"
              >
                <Upload size={14} />
                파일 추가
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleFilesSelected}
              className="hidden"
            />
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbSelected}
              className="hidden"
            />

            {entries.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-200 rounded-xl py-12 flex flex-col items-center gap-3 text-stone-400 hover:border-amber-300 hover:text-amber-500 transition-colors"
              >
                <Upload size={32} />
                <span className="text-sm">클릭하여 사진·동영상 선택</span>
                <span className="text-xs">JPG, PNG, WebP, MP4, WebM 지원</span>
              </button>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                      {entry.mediaType === 'video' ? (
                        <Film size={15} className="text-stone-400" />
                      ) : (
                        <ImageIcon size={15} className="text-stone-400" />
                      )}
                    </div>
                    {entry.mediaType === 'video' && (
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-200 border border-stone-200 flex items-center justify-center">
                          {entry.thumbPreviewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={entry.thumbPreviewUrl}
                              alt="썸네일 미리보기"
                              className="w-full h-full object-cover"
                            />
                          ) : entry.thumbStatus === 'generating' ? (
                            <Loader2 size={14} className="text-stone-400 animate-spin" />
                          ) : (
                            <ImagePlus size={14} className="text-stone-300" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openThumbPicker(entry.id)}
                          className="text-[10px] font-medium text-amber-600 hover:text-amber-700 transition-colors whitespace-nowrap"
                        >
                          썸네일 변경
                        </button>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateTitle(idx, e.target.value)}
                        className="w-full text-sm font-medium text-stone-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                        placeholder="제목 입력"
                      />
                      <p className="text-xs text-stone-400 truncate">{entry.file.name}</p>
                    </div>
                    <div className="shrink-0">
                      {entry.status === 'uploading' && (
                        <Loader2 size={16} className="text-amber-500 animate-spin" />
                      )}
                      {entry.status === 'done' && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {entry.status === 'error' && (
                        <span className="text-xs text-red-500">{entry.errorMsg}</span>
                      )}
                      {entry.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => removeEntry(idx)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isPending || entries.some((e) => e.status === 'uploading')}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? '저장 중...' : '갤러리에 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
