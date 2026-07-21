import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ChevronRight, Award, Globe, Target, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: '소개',
  description: '1988년 올림픽 금메달리스트 양영자 선교사의 이야기와 YTTM의 선교 비전을 만나보세요.',
}

/* ── 소개 히어로 ─────────────────────────────── */
function AboutHero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-4">
          Welcome Message
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-stone-800 mb-6 leading-tight">
          양영자 선교사를<br />소개합니다
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
          우리를 사랑하시는 주님 안에서 인사드립니다
        </p>
      </div>
    </section>
  )
}

/* ── 인사말 & 간증 ───────────────────────────── */
function GreetingSection() {
  return (
    <section className="pt-10 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          {/* 사진 */}
          <div className="pt-12">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/yttm.jpeg"
                alt="양영자 선교사"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 인사말 & 간증 */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-stone-800 mb-5">
                인사말
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  우리를 사랑하시는 주님 안에서 인사드립니다.
                </p>
                <p>
                  1988년 9월 30일. 그 날은 제가 평생 잊을 수 없는 날입니다. 그 날은 올림픽에서 제가 현정화 선수와 함께 탁구 역사상 최초의 올림픽 탁구 금메달을 딴 날입니다. 그 메달은 하루 아침에 이루어진 것이 아니었습니다. 어렸을 때에 탁구일지에 대한민국을 빛내는 국가대표선수가 되고 싶다는 꿈을 적었고, 국제대회에서 메달을 따고 싶다는 꿈을 적었습니다. 그러나, 그 꿈을 이루는 데에는 고된 훈련이 따랐고, 몸은 몸대로 너무 아팠고, 탁구를 그만둬야 하나라는 생각이 들 정도로 힘든 시간들도 있었습니다. 그러나 결국 제가 꿈꿨던 국가대표가 되었고, 국제대회에서도 각종 메달들을 땄습니다. 그리고, 온 국민의 응원과 성원으로 올림픽 금메달도 땄습니다.
                </p>
                <p>
                  1983년 여름의 어느 날을 저는 또 잊을 수가 없습니다. 그 날은 제가 예수님을 저의 구주로 영접한 날입니다. 그 날 저는 저같은 죄인을 위해 예수그리스도께서 십자가에서 못박혀 죽으시고 다시 사셨다는 사실을 접하고 한없이 울었습니다. 그 이후 제가 국가대표가 되어 국제대회에서 메달들을 따기까지 하나님은 저와 함께 하셨고, 때마다 성경말씀으로 인도하셨고, 깨닫게 하셨습니다. 탁구채조차 들 수 없었던 저의 팔을 치유해 주셨고, 병상에 누워 간절히 간구하던 저를 탁구대회에 설 수 있게 해 주셨습니다. 하나님은 그렇게 제가 금메달을 딸 수 있게 해 주셨습니다.
                </p>
                <p>
                  저는 고백합니다. 나의 나 된 것은 오직 주님의 은혜라고! 하나님은 제가 탁구에서 은퇴한 후 아주 심한 우울증에 빠졌을 때에도 저를 건져주셨습니다. 그리고, 14년간 몽골선교사로 보내주셔서 그 곳의 영혼들을 위해 섬기는 특권을 주셨습니다. 이제는 가는 곳마다 서는 곳마다 복음을 전하도록 인도하고 계십니다. 저는 또 고백합니다. 금메달이 귀하지만 하나님을 믿는 믿음은 더욱 귀하다고!
                </p>
                <p>
                  YTTM은 탁구를 통해 섬기며 복음을 전합니다. 기도해 주시고, 동참해 주십시오. 이 땅에 있는 모든 이들이 예수그리스도를 구주로 고백하는 날이 오기를 바랍니다.
                </p>
                <p>
                  감사합니다.
                </p>
                <p className="text-right font-semibold text-stone-700 pt-2">
                  대표&nbsp;&nbsp;&nbsp;양 영 자
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 선수의 길 / 선교사의 길 ─────────────────── */
function CareerSection() {
  const athletePath = [
    { year: '1983', desc: '동경세계탁구선수권대회 여자단식 은메달' },
    { year: '1986', desc: '서울아시안게임 여자단체전탁구 금메달' },
    { year: '1987', desc: '뉴델리세계탁구선수권대회 여자단식 은메달, 여자복식 금메달' },
    { year: '1988', desc: '서울올림픽 여자복식탁구 금메달' },
    { year: '1988', desc: '대한민국 체육훈장 청룡장 수상' },
  ]

  const missionaryPath = [
    { desc: '양영자탁구선교회 대표' },
    { desc: 'WEC 국제선교회 선교사' },
    { desc: '세계성시화운동본부 홍보대사' },
    { desc: '사랑의교회 파송 몽골선교사 역임' },
  ]

  return (
    <section className="py-20" style={{ backgroundColor: '#faf5eb' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Profile
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-800">
            양영자 선교사의 길
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 선수의 길 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-50">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award size={22} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-stone-800">선수의 길</h3>
            </div>
            <ul className="space-y-4">
              {athletePath.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5">
                    {item.year}
                  </span>
                  <span className="text-stone-600 leading-relaxed">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 선교사의 길 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-50">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe size={22} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-stone-800">선교사의 길</h3>
            </div>
            <ul className="space-y-4">
              {missionaryPath.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                  <span className="text-stone-600 leading-relaxed">{item.desc}</span>
                </li>
              ))}
            </ul>
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
      description: '국경을 넘어 전 세계를 향해, 탁구로 연결되는 선교의 다리를 놓습니다.',
    },
    {
      icon: Zap,
      title: '차세대 리더 양성',
      description: '현지 청소년들에게 탁구를 가르치며, 미래 지역 교회와 선교의 씨앗을 심습니다.',
    },
    {
      icon: Heart,
      title: '국제탁구캠프 및 대회',
      description: '해외의 청소년선수들을 초청해 탁구를 가르치며 복음을 전하고 국제 크리스천 탁구대회를 개최합니다',
    },
  ]

  return (
    <section id="vision" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Missions
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-800 mb-4">
            YTTM의 선교
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
            href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
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
      <GreetingSection />
      <CareerSection />
      <VisionSection />
      <AboutCTA />
    </>
  )
}
