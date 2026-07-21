'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type HeroMediaRow = Pick<
  Database['public']['Tables']['hero_media']['Row'],
  'id' | 'title' | 'media_url' | 'media_type' | 'display_order'
>

interface Props {
  items: HeroMediaRow[]
}

function FallbackHero() {
  return (
    <section className="relative h-[calc(100dvh-72px)] overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border-2 border-amber-300 rounded-full" />
        <div className="absolute top-40 left-20 w-40 h-40 border border-amber-300 rounded-full" />
        <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-amber-300 rounded-full" />
        <div className="absolute bottom-40 right-20 w-48 h-48 border border-amber-300 rounded-full" />
      </div>
    </section>
  )
}

export default function HeroSlideshow({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(true)
  const mutedRef = useRef(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasVideo = items.some((item) => item.media_type === 'video')

  const goNext = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length])
  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length])

  useEffect(() => {
    if (imageTimerRef.current) clearTimeout(imageTimerRef.current)

    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === current) {
        video.currentTime = 0
        // 브라우저 autoplay 정책상 사용자 제스처 없이 음소거 해제 시 자동으로 일시정지됨 — 항상 음소거로 시작
        video.muted = mutedRef.current
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })

    if (items[current]?.media_type === 'image' && items.length > 1) {
      imageTimerRef.current = setTimeout(goNext, 5000)
    }

    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current)
    }
  }, [current, items, goNext])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    mutedRef.current = next
    videoRefs.current.forEach((video) => {
      if (video) video.muted = next
    })
  }

  if (items.length === 0) {
    return <FallbackHero />
  }

  return (
    <section className="relative h-[calc(100dvh-72px)] overflow-hidden">
      {/* 미디어 레이어 */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          {item.media_type === 'image' ? (
            <>
              {/* 블러 배경: 잘리는 부분 없이 여백을 흐린 확대 이미지로 채움 */}
              <Image
                src={item.media_url}
                alt=""
                fill
                aria-hidden
                className="object-cover blur-2xl scale-110 opacity-70"
              />
              <Image
                src={item.media_url}
                alt={item.title}
                fill
                className="object-contain"
                priority={i === 0}
                sizes="100vw"
              />
            </>
          ) : (
            <>
              {/* 배경: 영상을 2중으로 로드하면 모바일에서 재생이 멎는 문제가 있어 정적 그라디언트로 대체 */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900"
              />
              <video
                ref={(el) => { videoRefs.current[i] = el }}
                src={item.media_url}
                autoPlay={i === 0}
                muted
                playsInline
                onEnded={goNext}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </>
          )}
        </div>
      ))}

      {/* 좌우 화살표 버튼 (2개 이상일 때만) */}
      {items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="이전 슬라이드"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
            style={{ zIndex: 4 }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            aria-label="다음 슬라이드"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
            style={{ zIndex: 4 }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* 소리 토글 버튼 (영상이 있을 때만) */}
      {hasVideo && (
        <button
          onClick={toggleMute}
          aria-label={muted ? '소리 켜기' : '소리 끄기'}
          className="absolute bottom-6 right-6 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full transition-colors duration-200"
          style={{ zIndex: 4 }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* 닷 네비게이션 (2개 이상일 때만) */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 4 }}>
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
