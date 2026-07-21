import Link from 'next/link'
import Image from 'next/image'
import { Heart, Camera, ChevronRight, Award, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import HeroSlideshow from '@/components/HeroSlideshow'

/* ── 히어로 CTA 섹션 ─────────────────────────── */
function HeroCtaSection() {
  return (
    <section className="py-12 text-center bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/40 text-amber-700 text-sm px-4 py-1.5 rounded-full mb-4">
          <Award size={14} />
          1988 서울 올림픽 탁구 금메달리스트
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-800 mb-3 leading-tight">
          탁구로 세상을 품고,<br />
          <span className="text-amber-600">복음으로 열방을 섬깁니다</span>
        </h1>
        <p className="text-sm md:text-base text-stone-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          메달을 넘어 더 큰 사명으로 —<br />
          양영자 선교사와 함께하는 탁구 선교의 여정에 동참하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:-translate-y-0.5 text-base"
          >
            <Heart size={16} />
            선교 후원하기
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 text-base"
          >
            선교사 소개
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}


/* ── 선교사 인사말 섹션 ──────────────────────── */
function MissionaryGreeting() {
  return (
    <section className="py-20" style={{ backgroundColor: '#faf5eb' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* 텍스트 */}
          <div className="md:col-span-3 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8 leading-snug">
              우리를 사랑하시는 주님 안에서 인사드립니다.
            </h2>
            <div className="space-y-5 text-stone-600 leading-relaxed">
              <p>
                1988년 9월 30일. 그 날은 제가 평생 잊을 수 없는 날입니다. 그 날은 올림픽에서
                제가 현정화 선수와 함께 탁구 역사상 최초의 올림픽 탁구 금메달을 딴 날입니다.
              </p>
              <p>
                그 메달은 하루 아침에 이루어진 것이 아니었습니다. 어렸을 때에 탁구일지에
                대한민국을 빛내는 국가대표선수가 되고 싶다는 꿈을 적었고, 국제대회에서
                메달을 따고 싶다는 꿈을 적었습니다.
              </p>
              <p>
                그러나, 그 꿈을 이루는 데에는 고된 훈련이 따랐고, 몸은 몸대로 너무 아팠고,
                탁구를 그만둬야 하나라는 생각이 들 정도로 힘든 시간들도 있었습니다. 그러나
                결국 제가 꿈꿨던 국가대표가 되었고, 국제대회에서도 각종 메달들을 땄습니다.
                그리고, 온 국민의 응원과 성원으로 올림픽 금메달도 땄습니다.
              </p>
              <p>
                1983년 여름의 어느 날을 저는 또 잊을 수가 없습니다...(계속)
              </p>
            </div>
          </div>

          {/* 사진 */}
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/yttm.jpeg"
                alt="양영자 선교사"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="text-center mt-12">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 text-white font-semibold px-8 py-3 rounded-sm transition-all duration-200"
          >
            양영자 선교사 인사말
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 최근 선교 활동 ───────────────────────────── */
type RecentAlbum = { name: string; thumbnail: string | null; mediaType: string }

function RecentActivities({ albums }: { albums: RecentAlbum[] }) {
  if (albums.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Activities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">최근 선교 현장</h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            탁구를 통해 열방에 복음을 전하는 현장의 이야기를 만나보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {albums.map((album) => {
            const year = album.name.match(/^\d{4}/)?.[0] ?? ''
            return (
              <Link
                key={album.name}
                href={`/gallery?album=${encodeURIComponent(album.name)}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group border border-stone-100"
              >
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
                  {album.thumbnail ? (
                    album.mediaType === 'video' ? (
                      <video
                        src={album.thumbnail}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={album.thumbnail}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )
                  ) : (
                    <Camera size={40} className="text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </div>
                <div className="p-5">
                  {year && <span className="text-xs font-bold text-stone-400 block mb-2">{year}</span>}
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                    {album.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-amber-600 text-sm font-medium">
                    사진 보기 <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold px-6 py-3 rounded-full transition-all duration-200"
          >
            전체 갤러리 보기
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 비전 섹션 ───────────────────────────────── */
function Vision() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #1c1917 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
          우리의 비전
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
          탁구 하나로<br />
          <span className="text-amber-400">온 열방을 품는 꿈</span>
        </h2>
        <p className="text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          탁구는 언어를 초월합니다. 국경도, 문화도 넘어서는 탁구공 하나가
          복음의 다리가 되어 모든 민족에게 하나님의 사랑을 전하는 것,
          그것이 YTTM의 비전입니다.
        </p>
        <Link
          href="/about#vision"
          className="inline-flex items-center gap-2 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 font-semibold px-8 py-3 rounded-full transition-all duration-200"
        >
          비전 자세히 보기
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}

/* ── 후원 CTA 섹션 ───────────────────────────── */
function SupportCTA() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={28} className="text-amber-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-stone-800 mb-4">
          선교를 함께 만들어가세요
        </h2>
        <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto break-keep">
          여러분의 기도와 후원이 탁구공 하나를 통해 열방에 복음을 전하는
          귀한 통로가 됩니다.
        </p>
        <div className="flex justify-center">
          <Link
            href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            <Heart size={18} />
            정기 후원하기
          </Link>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const [{ data: heroItems }, { data: galleryRows }, admin] = await Promise.all([
    supabase
      .from('hero_media')
      .select('id, title, media_url, media_type, display_order')
      .eq('active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('gallery')
      .select('album, image_url, media_type')
      .order('created_at', { ascending: false }),
    isAdmin(),
  ])

  const albumMap = new Map<string, { thumbnail: string; mediaType: string }>()
  for (const row of galleryRows ?? []) {
    if (row.album && !albumMap.has(row.album)) {
      albumMap.set(row.album, { thumbnail: row.image_url, mediaType: row.media_type ?? 'image' })
    }
  }
  const recentAlbums = Array.from(albumMap.entries())
    .slice(0, 3)
    .map(([name, meta]) => ({ name, ...meta }))

  return (
    <>
      <div className="relative">
        <HeroSlideshow items={heroItems ?? []} />
        {admin && (
          <Link
            href="/admin/hero"
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-semibold px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <Settings size={13} />
            슬라이드 관리
          </Link>
        )}
      </div>
      <MissionaryGreeting />
      <RecentActivities albums={recentAlbums} />
      <SupportCTA />
    </>
  )
}
