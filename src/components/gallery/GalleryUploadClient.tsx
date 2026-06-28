'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRef, useState, useTransition } from 'react'
import { Upload, X, ImageIcon, Film, CheckCircle, Loader2 } from 'lucide-react'
import { saveGalleryItemsAction } from '@/app/actions/gallery'

type FileEntry = {
  file: File
  title: string
  mediaType: 'image' | 'video'
  status: 'pending' | 'uploading' | 'done' | 'error'
  errorMsg?: string
  url?: string
}

type Props = {
  userId: string
}

export default function GalleryUploadClient({ userId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [album, setAlbum] = useState('')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newEntries: FileEntry[] = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      status: 'pending',
    }))
    setEntries((prev) => [...prev, ...newEntries])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateTitle(idx: number, title: string) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, title } : e)))
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

    const uploaded: { title: string; mediaUrl: string; mediaType: 'image' | 'video'; album: string }[] = []

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

      setEntries((prev) =>
        prev.map((e, idx) => (idx === i ? { ...e, status: 'done', url: publicUrl } : e))
      )

      uploaded.push({
        title: entry.title || entry.file.name,
        mediaUrl: publicUrl,
        mediaType: entry.mediaType,
        album: album.trim(),
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
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                      {entry.mediaType === 'video' ? (
                        <Film size={15} className="text-stone-400" />
                      ) : (
                        <ImageIcon size={15} className="text-stone-400" />
                      )}
                    </div>
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
