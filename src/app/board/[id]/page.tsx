import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('posts')
    .select('title')
    .eq('id', Number(id))
    .eq('published', true)
    .maybeSingle()

  return { title: data?.title ?? '게시글' }
}

export default async function BoardPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, category, images, created_at, user_id')
    .eq('id', Number(id))
    .eq('published', true)
    .maybeSingle()

  if (!post) notFound()

  let authorName = '관리자'
  if (post.user_id) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', post.user_id)
      .maybeSingle()
    if (profile?.display_name) authorName = profile.display_name
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/board"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          게시판으로 돌아가기
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          {/* 메타 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              <Tag size={11} />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-stone-400">
              <Calendar size={11} />
              {formatDate(post.created_at)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-stone-400">
              <User size={11} />
              {authorName}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-black text-stone-800 mb-6 leading-snug">{post.title}</h1>

          {/* 본문 */}
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 첨부 사진 */}
          {post.images && post.images.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">첨부 사진</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {post.images.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={url}
                      alt=""
                      className="w-full aspect-square object-cover rounded-xl hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
