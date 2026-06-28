import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ChevronRight, Calendar, PenSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: '게시판',
  description: 'YTTM 탁구선교회의 선교 소식과 기도 제목을 나눕니다.',
}

const CATEGORIES = ['전체', '선교 소식', '기도 제목', '간증', '공지']

async function getPosts(category?: string) {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (category && category !== '전체') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

type Post = {
  id: number
  title: string
  content: string
  category: string
  image_url: string | null
  created_at: string
  published: boolean
}

function PostCard({ post }: { post: Post }) {
  const preview = post.content.replace(/<[^>]*>/g, '').slice(0, 120)

  return (
    <Link
      href={`/board/${post.id}`}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100 group block"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(post.created_at)}
            </span>
          </div>
          <h3 className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-1 truncate">
            {post.title}
          </h3>
          <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{preview}</p>
        </div>
        <ChevronRight size={18} className="text-stone-300 group-hover:text-amber-500 flex-shrink-0 mt-1 transition-colors" />
      </div>
    </Link>
  )
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const posts = await getPosts(category)

  const supabaseServer = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Board
          </span>
          <h1 className="text-4xl font-black text-stone-800 mb-4">선교 소식</h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            YTTM 탁구선교회의 최신 소식과 기도 제목, 선교 간증을 나눕니다.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 카테고리 탭 + 글쓰기 버튼 */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {user && (
            <Link
              href="/board/write"
              className="ml-auto inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>
        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = cat === '전체' ? !category : category === cat
            return (
              <Link
                key={cat}
                href={cat === '전체' ? '/board' : `/board?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <FileText size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">아직 등록된 게시글이 없습니다</p>
            <p className="text-sm mt-1">곧 선교 소식이 업로드될 예정입니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
