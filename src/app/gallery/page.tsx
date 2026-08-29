import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, ChevronRight, Upload } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin'
import AlbumDeleteButton from '@/components/gallery/AlbumDeleteButton'
import AlbumFilterSelect from '@/components/gallery/AlbumFilterSelect'
import AlbumYearEditor from '@/components/gallery/AlbumYearEditor'
import AlbumCoverResetButton from '@/components/gallery/AlbumCoverResetButton'
import GalleryPhotoGrid from '@/components/gallery/GalleryPhotoGrid'

export const metadata: Metadata = {
  title: '갤러리',
  description: 'YTTM 탁구선교회의 선교 활동 사진을 모아놓은 갤러리입니다.',
}

async function getAlbums() {
  const supabase = await createSupabaseServerClient()
  const [{ data: rows }, { data: albumRows }] = await Promise.all([
    supabase
      .from('gallery')
      .select('album, image_url, thumbnail_url, media_type, created_at')
      .order('created_at', { ascending: false }),
    supabase.from('albums').select('name, year, sort_order, cover_image_url'),
  ])
  if (!rows) return []

  const yearMap = new Map((albumRows ?? []).map((a) => [a.name, a.year]))
  const sortOrderMap = new Map((albumRows ?? []).map((a) => [a.name, a.sort_order]))
  const coverMap = new Map((albumRows ?? []).map((a) => [a.name, a.cover_image_url as string | null]))

  const map = new Map<
    string,
    { thumbnail: string; thumbnailUrl: string | null; mediaType: string; year: number }
  >()
  for (const row of rows) {
    if (row.album && !map.has(row.album)) {
      const year = yearMap.get(row.album) ?? new Date(row.created_at).getFullYear()
      map.set(row.album, {
        thumbnail: row.image_url,
        thumbnailUrl: row.thumbnail_url,
        mediaType: row.media_type ?? 'image',
        year,
      })
    }
  }
  return Array.from(map.entries())
    .map(([name, meta]) => {
      const manualCover = coverMap.get(name)
      return manualCover
        ? { name, thumbnail: manualCover, thumbnailUrl: null, mediaType: 'image', year: meta.year, hasManualCover: true }
        : { name, ...meta, hasManualCover: false }
    })
    .sort(
      (a, b) =>
        (sortOrderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER) -
        (sortOrderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER)
    )
}

async function getGalleryPhotos(album?: string) {
  const supabase = await createSupabaseServerClient()
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

async function getAlbumOwnerIds(album: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('gallery').select('user_id').eq('album', album)
  return data ?? []
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ album?: string }>
}) {
  const { album } = await searchParams
  const [albums, supabaseServer, admin] = await Promise.all([
    getAlbums(),
    createSupabaseServerClient(),
    isAdmin(),
  ])
  const photos = album ? await getGalleryPhotos(album) : []

  const albumsByYear = new Map<number, typeof albums>()
  for (const a of albums) {
    const list = albumsByYear.get(a.year) ?? []
    list.push(a)
    albumsByYear.set(a.year, list)
  }
  const sortedYears = Array.from(albumsByYear.keys()).sort((a, b) => b - a)
  const currentAlbumMeta = album ? albums.find((a) => a.name === album) : undefined
  const currentAlbumYear = currentAlbumMeta?.year
  const currentAlbumCoverUrl = currentAlbumMeta?.hasManualCover ? currentAlbumMeta.thumbnail : null

  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  let canDeleteAlbum = false
  if (album) {
    const ownerRows = await getAlbumOwnerIds(album)
    canDeleteAlbum =
      admin || (!!user && ownerRows.length > 0 && ownerRows.every((r) => r.user_id === user.id))
  }

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
            탁구를 통해 전해지는 복음의 현장을{' '}
            <br className="sm:hidden" />
            사진으로 만나보세요.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 업로드 버튼 (로그인 회원) + 앨범 전체 삭제 버튼 */}
        {(user || (album && canDeleteAlbum)) && (
          <div className="flex justify-end items-center gap-2 mb-4">
            {user && (
              <Link
                href="/gallery/upload"
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                <Upload size={14} />
                사진·동영상 올리기
              </Link>
            )}
            {album && canDeleteAlbum && <AlbumDeleteButton album={album} />}
          </div>
        )}

        {/* 앨범 필터 */}
        {albums.length > 0 && (
          <AlbumFilterSelect albums={albums} currentAlbum={album} />
        )}

        {/* 앨범 카드 (전체 보기일 때, 연도별 그룹핑) */}
        {!album && albums.length > 0 && (
          <div className="space-y-12 mb-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="text-lg font-bold text-amber-600 mb-5">{year} 년</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {albumsByYear.get(year)!.map((a) => (
                    <Link
                      key={a.name}
                      href={`/gallery?album=${encodeURIComponent(a.name)}`}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 overflow-hidden group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
                        {a.thumbnail ? (
                          a.mediaType === 'video' ? (
                            <video
                              src={a.thumbnail}
                              poster={a.thumbnailUrl ?? undefined}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.thumbnail}
                              alt={a.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )
                        ) : (
                          <Camera size={36} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-1">
                          {a.name}
                        </h3>
                        <div className="mt-3 flex items-center gap-1 text-amber-600 text-sm font-medium">
                          사진 보기 <ChevronRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 특정 앨범 사진 그리드 */}
        {album && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-bold text-stone-800">{album}</h2>
              {admin && currentAlbumYear !== undefined && (
                <AlbumYearEditor album={album} year={currentAlbumYear} />
              )}
              {admin && currentAlbumCoverUrl && <AlbumCoverResetButton album={album} />}
            </div>
            <GalleryPhotoGrid
              photos={photos}
              admin={admin}
              currentUserId={user?.id ?? null}
              zipFileName={`${album}.zip`}
              album={album}
              currentCoverUrl={currentAlbumCoverUrl}
            />
          </>
        )}

        {!album && albums.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <Camera size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">선교 사진이 곧 업로드됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
