'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { updatePostAction } from '@/app/actions/posts'

const CATEGORIES = ['선교 소식', '기도 제목', '간증', '공지']

export default function EditPostPage() {
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('선교 소식')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/post/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setTitle(data.title)
        setContent(data.content)
        setCategory(data.category)
        setLoading(false)
      })
      .catch(() => { setError('게시글을 불러오지 못했습니다.'); setLoading(false) })
  }, [id])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('제목과 내용을 입력해주세요.'); return }
    startTransition(async () => {
      try {
        await updatePostAction(id, { title: title.trim(), content: content.trim(), category })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdfaf6' }}>
        <Loader2 size={24} className="animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href={`/board/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          돌아가기
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h1 className="text-xl font-bold text-stone-800 mb-6">게시글 수정</h1>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={14}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link
                href={`/board/${id}`}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
