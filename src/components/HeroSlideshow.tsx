'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Award, Heart, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type HeroMediaRow = Pick<
  Database['public']['Tables']['hero_media']['Row'],
  'id' | 'title' | 'media_url' | 'media_type' | 'display_order'
>

interface Props {
  items: HeroMediaRow[]
}

// admin이 미디어를 아직 올리지 않았을 때 보여주는 기존 디자인
function FallbackHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border-2 border-amber-300 rounded-full" />
        <div className="absolute top-40 left-20 w-40 h-40 border border-amber-300 rounded-full" />
        <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-amber-300 rounded-full" />
        <div className="absolute bottom-40 right-20 w-48 h-48 border border-amber-300 rounded-full" />
      </div>
      <HeroOverlay />
    </section>
  )
}

// 슬라이드쇼 위에 올라가는 텍스트+버튼 오버레이
function HeroOverlay() {
  return (
    <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-amber-600/30 border border-amber-500/50 text-amber-200 text-sm px-4 py-1.5 rounded-full mb-8">
        <Award size={14} />
        1988 서울 올림픽 탁구 금메달리스트
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
        탁구로 세상을 품고,<br />
        <span className="text-amber-400">복음으로 열방을 섬깁니다</span>
      </h1>

      <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        메달을 넘어 더 큰 사명으로 —<br />
        양영자 선교사와 함께하는 탁구 선교의 여정에 동참하세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="https://ihappynanum.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:-translate-y-0.5 text-lg"
        >
          <Heart size={18} />
          선교 후원하기
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white/10 text-lg"
        >
          선교사 소개
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  )
}

export default function HeroSlideshow({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const hasVideo = items.some((item) => item.media_type === 'video')

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length)
    }, 5000)
    return () => clearInterval(id)
  }, [items.length])

  // 현재 슬라이드의 영상만 재생, 나머지는 정지
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === current) {
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [current])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    videoRefs.current.forEach((video) => {
      if (video) video.muted = next
    })
  }

  if (items.length === 0) {
    return <FallbackHero />
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* 미디어 레이어 */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          {item.media_type === 'image' ? (
            <Image
              src={item.media_url}
              alt={item.title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={(el) => { videoRefs.current[i] = el }}
              src={item.media_url}
              autoPlay={i === 0}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* 어두운 오버레이 — 텍스트 가독성 */}
      <div className="absolute inset-0 bg-black/50" style={{ zIndex: 2 }} />

      {/* 텍스트 + CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <HeroOverlay />
      </div>

      {/* 소리 토글 버튼 (영상이 있을 때만) */}
      {hasVideo && (
        <button
          onClick={toggleMute}
          aria-label={muted ? '소리 켜기' : '소리 끄기'}
          className="absolute bottom-8 right-8 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full transition-colors duration-200"
          style={{ zIndex: 4 }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* 닷 네비게이션 (2개 이상일 때만) */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 4 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`슬라이드 ${i + 1}`}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                transform: i === current ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
