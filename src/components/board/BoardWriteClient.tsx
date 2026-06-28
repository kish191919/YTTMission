'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { createPostAction } from '@/app/actions/posts'

const CATEGORIES = ['선교 소식', '기도 제목', '간증', '공지']

type ImageEntry = {
  file: File
  previewUrl: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  errorMsg?: string
}

type Props = {
  userId: string
}

export default function BoardWriteClient({ userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState<ImageEntry[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newEntries: ImageEntry[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }))
    setImages((prev) => [...prev, ...newEntries])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploadError(null)
    const formData = new FormData(e.currentTarget)

    if (images.length > 0) {
      setIsUploading(true)
      const urls: string[] = []

      for (let i = 0; i < images.length; i++) {
        setImages((prev) =>
          prev.map((entry, idx) => (idx === i ? { ...entry, status: 'uploading' } : entry))
        )

        const entry = images[i]
        const ext = entry.file.name.split('.').pop()
        const storagePath = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { data, error } = await supabase.storage
          .from('member-uploads')
          .upload(storagePath, entry.file, { upsert: false })

        if (error || !data) {
          setImages((prev) =>
            prev.map((e, idx) =>
              idx === i ? { ...e, status: 'error', errorMsg: error?.message ?? '업로드 실패' } : e
            )
          )
          setUploadError('일부 사진 업로드에 실패했습니다. 다시 시도해주세요.')
          setIsUploading(false)
          return
        }

        const { data: urlData } = supabase.storage.from('member-uploads').getPublicUrl(data.path)
        urls.push(urlData.publicUrl)

        setImages((prev) =>
          prev.map((e, idx) => (idx === i ? { ...e, status: 'done' } : e))
        )
      }

      formData.append('images', JSON.stringify(urls))
      setIsUploading(false)
    }

    startTransition(() => createPostAction(formData))
  }

  const isBusy = isUploading || isPending

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      <div className="bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black text-stone-800">글쓰기</h1>
          <p className="text-stone-500 mt-2">선교 소식, 기도 제목, 간증을 나눠주세요.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 space-y-6">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">카테고리</label>
            <select
              name="category"
              defaultValue="선교 소식"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">제목</label>
            <input
              type="text"
              name="title"
              required
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="제목을 입력해주세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">내용</label>
            <textarea
              name="content"
              required
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y leading-relaxed"
              placeholder="내용을 입력해주세요"
            />
          </div>

          {/* 사진 첨부 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-stone-700">
                사진 첨부 <span className="font-normal text-stone-400">(선택, 최대 10장)</span>
              </label>
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg transition-colors border border-amber-200"
                >
                  <ImagePlus size={13} />
                  사진 추가
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFilesSelected}
              className="hidden"
            />

            {images.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-200 rounded-xl py-8 flex flex-col items-center gap-2 text-stone-400 hover:border-amber-300 hover:text-amber-500 transition-colors"
              >
                <ImagePlus size={24} />
                <span className="text-sm">클릭하여 사진 추가</span>
                <span className="text-xs">JPG, PNG, WebP</span>
              </button>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((entry, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src={entry.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {entry.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={20} className="text-white animate-spin" />
                      </div>
                    )}
                    {entry.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold px-1 text-center">실패</span>
                      </div>
                    )}
                    {entry.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X size={11} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-amber-300 hover:text-amber-500 text-stone-400 flex items-center justify-center transition-colors"
                  >
                    <ImagePlus size={20} />
                  </button>
                )}
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{uploadError}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/board"
              className="px-5 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-800 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isBusy}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isUploading ? '업로드 중...' : isPending ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
