import Link from 'next/link'
import { Heart, Globe, Camera, ChevronRight, Users, MapPin, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import HeroSlideshow from '@/components/HeroSlideshow'

/* ── 임팩트 숫자 섹션 ─────────────────────────── */
function ImpactStats() {
  const stats = [
    { icon: Award, value: '1개', label: '올림픽 금메달', sub: '1988 서울 올림픽' },
    { icon: Globe, value: '5개국+', label: '선교 방문국', sub: '몽골·중국·아시아' },
    { icon: Users, value: '30년+', label: '선교 사역', sub: '꾸준한 헌신' },
    { icon: MapPin, value: '열방', label: '향한 비전', sub: '탁구를 통한 복음' },
  ]

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-700 mb-1">{value}</div>
              <div className="text-sm font-semibold text-stone-700 mb-0.5">{label}</div>
              <div className="text-xs text-stone-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 스토리 섹션 ─────────────────────────────── */
function Story() {
  return (
    <section className="py-20" style={{ backgroundColor: '#faf5eb' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-amber-200 to-amber-400 rounded-3xl flex items-center justify-center shadow-xl">
              <div className="text-center text-amber-800">
                <div className="text-6xl mb-3">🏓</div>
                <p className="text-sm font-medium opacity-70">양영자 선교사</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-amber-600 text-white rounded-2xl px-5 py-3 shadow-lg">
              <div className="text-2xl font-black">1988</div>
              <div className="text-xs font-medium opacity-80">서울 올림픽 금메달</div>
            </div>
          </div>

          <div>
            <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
              선교사의 이야기
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-800 mb-6 leading-tight">
              메달을 넘어,<br />
              더 큰 사명으로
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                1988년 9월 30일, 서울 올림픽 탁구 경기장. 현정화 선수와 함께 역사상 최초의
                올림픽 탁구 금메달을 목에 건 그 순간, 양영자 선수의 인생은 영원히 바뀌었습니다.
              </p>
              <p>
                그러나 더 큰 변화는 그 이후에 찾아왔습니다. 하나님의 부르심 앞에 선 양영자
                선교사는 탁구채를 내려놓는 대신, 탁구를 통해 세상에 복음을 전하는
                새로운 여정을 시작했습니다.
              </p>
              <p>
                오늘도 몽골과 아시아 각지에서, 탁구공 하나가 다리가 되어
                마음과 마음을 연결하고 있습니다.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
              >
                전체 이야기 보기
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 최근 선교 활동 ───────────────────────────── */
function RecentActivities() {
  const activities = [
    {
      year: '2025',
      title: '2025 선교 활동',
      description: '새해를 맞아 시작된 탁구 선교의 새로운 장. 지역 사회와 함께하는 선교의 현장을 만나보세요.',
      tag: '진행중',
      tagColor: 'bg-green-100 text-green-700',
      href: '/gallery?album=2025',
    },
    {
      year: '2024',
      title: '2024 몽골 선교',
      description: '몽골의 광활한 초원 위에서 탁구공이 전한 복음의 이야기. 현지 청소년들과 함께한 소중한 시간.',
      tag: '몽골',
      tagColor: 'bg-blue-100 text-blue-700',
      href: '/gallery?album=2024-mongolia',
    },
    {
      year: '2024',
      title: '2024 선교 기록',
      description: '한 해를 돌아보며 정리한 선교 사역의 열매들. 기도와 후원으로 함께해주신 모든 분께 감사드립니다.',
      tag: '아카이브',
      tagColor: 'bg-amber-100 text-amber-700',
      href: '/gallery?album=2024',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            선교 활동
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">최근 선교 현장</h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            탁구를 통해 열방에 복음을 전하는 현장의 이야기를 만나보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Link
              key={activity.title}
              href={activity.href}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group border border-stone-100"
            >
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <Camera size={40} className="text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400">{activity.year}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activity.tagColor}`}>
                    {activity.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">{activity.description}</p>
                <div className="mt-4 flex items-center gap-1 text-amber-600 text-sm font-medium">
                  사진 보기 <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
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
        <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto">
          여러분의 기도와 후원이 탁구공 하나를 통해 열방에 복음을 전하는
          귀한 통로가 됩니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://ihappynanum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            <Heart size={18} />
            정기 후원하기
          </Link>
          <Link
            href="/board"
            className="inline-flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-100 font-semibold px-8 py-4 rounded-full transition-all duration-200 text-base"
          >
            선교 소식 보기
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const { data: heroItems } = await supabase
    .from('hero_media')
    .select('id, title, media_url, media_type, display_order')
    .eq('active', true)
    .order('display_order', { ascending: true })

  return (
    <>
      <HeroSlideshow items={heroItems ?? []} />
      <ImpactStats />
      <Story />
      <RecentActivities />
      <Vision />
      <SupportCTA />
    </>
  )
}
