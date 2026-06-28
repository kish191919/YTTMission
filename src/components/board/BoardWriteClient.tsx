'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { createPostAction } from '@/app/actions/posts'

const CATEGORIES = ['선교 소식', '기도 제목', '간증', '공지']

export default function BoardWriteClient() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => createPostAction(formData))
  }

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
              disabled={isPending}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
