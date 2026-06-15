import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ChevronRight, Award, Globe, Target, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: '소개',
  description: '1988년 올림픽 금메달리스트 양영자 선교사의 이야기와 YTTM의 선교 비전을 만나보세요.',
}

/* ── 소개 히어로 ─────────────────────────────── */
function AboutHero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-4">
          About YTTM
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-stone-800 mb-6 leading-tight">
          양영자 선교사를<br />소개합니다
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
          올림픽 금메달의 영광에서 선교사의 사명으로 — 탁구를 통해 하나님의 사랑을 전하는
          양영자 선교사의 이야기입니다.
        </p>
      </div>
    </section>
  )
}

/* ── 선교사 이야기 ───────────────────────────── */
function MissionaryStory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* 이미지 */}
          <div className="sticky top-24">
            <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-amber-300 rounded-3xl flex items-center justify-center shadow-xl">
              <div className="text-center text-amber-800 p-8">
                <div className="text-7xl mb-4">🏓</div>
                <p className="font-bold text-lg">양영자 선교사</p>
                <p className="text-sm opacity-70 mt-1">YTTM 탁구선교회 대표</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                <div className="text-2xl font-black text-amber-700">1988</div>
                <div className="text-xs text-stone-500 mt-0.5">올림픽 금메달</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                <div className="text-2xl font-black text-amber-700">5개국+</div>
                <div className="text-xs text-stone-500 mt-0.5">선교 방문국</div>
              </div>
            </div>
          </div>

          {/* 이야기 */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
                <Award size={22} className="text-amber-600" />
                올림픽의 영광
              </h2>
              <div className="space-y-3 text-stone-600 leading-relaxed">
                <p>
                  어린 시절부터 탁구를 시작한 양영자는 누구보다 간절한 마음으로 국가대표의 꿈을
                  키워왔습니다. 새벽부터 밤까지 이어지는 고된 훈련, 수없이 반복된 연습 끝에
                  마침내 국가대표 선수의 자리에 올랐습니다.
                </p>
                <p>
                  1988년 9월 30일, 서울 올림픽 탁구 경기장. 현정화 선수와 함께 복식 경기에서
                  올림픽 탁구 역사상 최초의 금메달을 획득했습니다. 대한민국 전체가 함께
                  울고 웃었던 그 순간은 영원히 역사에 기록되었습니다.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
                <Globe size={22} className="text-amber-600" />
                새로운 부르심
              </h2>
              <div className="space-y-3 text-stone-600 leading-relaxed">
                <p>
                  선수 생활을 마친 후, 양영자는 더 큰 부르심을 경험했습니다. 탁구 코치와
                  지도자로 활동하면서 하나님의 인도하심 가운데 선교사로서의 사명을 깨달았습니다.
                </p>
                <p>
                  "탁구는 국경이 없습니다. 언어가 통하지 않아도, 문화가 달라도, 탁구대 앞에서는
                  모두가 하나가 됩니다. 저는 그 탁구를 통해 복음을 전하고 싶었습니다."
                </p>
                <p>
                  이렇게 시작된 탁구 선교의 여정은 몽골, 중국, 아시아 각지로 이어졌고,
                  오늘도 계속되고 있습니다.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
                <Heart size={22} className="text-amber-600" />
                YTTM의 시작
              </h2>
              <div className="space-y-3 text-stone-600 leading-relaxed">
                <p>
                  YTTM(양영자 탁구선교회)은 탁구를 통한 복음 전파라는 비전 아래 설립되었습니다.
                  스포츠라는 공통 언어를 통해 복음을 접하기 어려운 지역과 사람들에게
                  다가가는 독특한 선교 방식을 추구합니다.
                </p>
                <p>
                  매년 국내외 선교 여행을 통해 탁구 클리닉을 운영하고, 현지 청소년들과
                  교류하며 자연스럽게 복음을 전합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 비전 섹션 ───────────────────────────────── */
function VisionSection() {
  const visions = [
    {
      icon: Target,
      title: '탁구를 통한 복음 전파',
      description: '스포츠라는 공통 언어를 통해 복음을 접하기 어려운 지역과 사람들에게 다가갑니다.',
    },
    {
      icon: Globe,
      title: '열방을 향한 선교',
      description: '국경을 넘어 아시아와 전 세계를 향해, 탁구로 연결되는 선교의 다리를 놓습니다.',
    },
    {
      icon: Zap,
      title: '차세대 리더 양성',
      description: '현지 청소년들에게 탁구를 가르치며, 미래 지역 교회와 선교의 씨앗을 심습니다.',
    },
    {
      icon: Heart,
      title: '지속 가능한 사역',
      description: '단기 방문에 그치지 않고 현지와 지속적인 관계를 이어가는 사역을 지향합니다.',
    },
  ]

  return (
    <section id="vision" className="py-20" style={{ backgroundColor: '#faf5eb' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Vision
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-800 mb-4">
            YTTM의 선교 비전
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            탁구공 하나가 복음의 씨앗이 되는 세상을 꿈꿉니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {visions.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl p-7 shadow-sm border border-amber-50 flex gap-5">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 후원 CTA ───────────────────────────────── */
function AboutCTA() {
  return (
    <section className="py-16 bg-amber-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
          이 사역에 함께 하시겠습니까?
        </h2>
        <p className="text-amber-100 mb-8 max-w-xl mx-auto">
          기도와 후원으로 양영자 선교사의 탁구 선교 사역을 함께 지원해주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://ihappynanum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-bold px-8 py-3.5 rounded-full hover:bg-amber-50 transition-colors shadow-md"
          >
            <Heart size={16} />
            후원하기
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            선교 사진 보기
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionaryStory />
      <VisionSection />
      <AboutCTA />
    </>
  )
}
