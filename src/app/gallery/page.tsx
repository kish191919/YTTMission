import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, ChevronRight, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: '갤러리',
  description: 'YTTM 탁구선교회의 선교 활동 사진을 모아놓은 갤러리입니다.',
}

type Album = {
  key: string
  label: string
  description: string
  year: string
  tag: string
  tagColor: string
}

const albums: Album[] = [
  {
    key: '2025',
    label: '2025 선교 활동',
    description: '2025년 진행 중인 탁구 선교 활동의 현장을 담았습니다.',
    year: '2025',
    tag: '진행중',
    tagColor: 'bg-green-100 text-green-700',
  },
  {
    key: '2024-mongolia',
    label: '2024 몽골 선교',
    description: '몽골 청소년들과 함께한 탁구 선교의 아름다운 순간들입니다.',
    year: '2024',
    tag: '몽골',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    key: '2024',
    label: '2024 선교 기록',
    description: '2024년 한 해 동안의 선교 활동을 돌아보는 사진들입니다.',
    year: '2024',
    tag: '아카이브',
    tagColor: 'bg-amber-100 text-amber-700',
  },
]

async function getGalleryPhotos(album?: string) {
  let query = supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)

  if (album) {
    query = query.eq('album', album)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

type GalleryPhoto = {
  id: number
  title: string
  description: string | null
  image_url: string
  album: string
  taken_at: string | null
  created_at: string
  media_type: 'image' | 'video'
}

function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <Camera size={48} className="mx-auto mb-4 opacity-40" />
        <p className="text-lg font-medium">아직 등록된 사진이 없습니다</p>
        <p className="text-sm mt-1">곧 선교 현장의 사진이 업로드될 예정입니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square bg-amber-50 rounded-xl overflow-hidden border border-stone-100 hover:shadow-md transition-shadow duration-200"
        >
          {photo.media_type === 'video' ? (
            <video
              src={photo.image_url}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.image_url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
            <p className="text-white text-xs font-medium line-clamp-2">{photo.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ album?: string }>
}) {
  const { album } = await searchParams
  const photos = await getGalleryPhotos(album)

  const supabaseServer = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf6' }}>
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Gallery
          </span>
          <h1 className="text-4xl font-black text-stone-800 mb-4">선교 활동 갤러리</h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            탁구를 통해 전해지는 복음의 현장을 사진으로 만나보세요.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 업로드 버튼 (로그인 회원) */}
        {user && (
          <div className="flex justify-end mb-4">
            <Link
              href="/gallery/upload"
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              <Upload size={14} />
              사진·동영상 올리기
            </Link>
          </div>
        )}

        {/* 앨범 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              !album
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            전체
          </Link>
          {albums.map((a) => (
            <Link
              key={a.key}
              href={`/gallery?album=${a.key}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                album === a.key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              {a.label}
            </Link>
          ))}
        </div>

        {/* 앨범 카드 (전체 보기일 때) */}
        {!album && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {albums.map((a) => (
              <Link
                key={a.key}
                href={`/gallery?album=${a.key}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 overflow-hidden group"
              >
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <Camera size={36} className="text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-stone-400 font-bold">{a.year}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.tagColor}`}>
                      {a.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-1">
                    {a.label}
                  </h3>
                  <p className="text-sm text-stone-500">{a.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-amber-600 text-sm font-medium">
                    사진 보기 <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 사진 그리드 */}
        {album && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-800">
                {albums.find((a) => a.key === album)?.label ?? album}
              </h2>
            </div>
            <PhotoGrid photos={photos} />
          </>
        )}

        {/* 전체 보기에서도 최신 사진 표시 */}
        {!album && photos.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-stone-800 mb-5">최근 사진</h2>
            <PhotoGrid photos={photos} />
          </div>
        )}

        {!album && photos.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <Camera size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">선교 사진이 곧 업로드됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
