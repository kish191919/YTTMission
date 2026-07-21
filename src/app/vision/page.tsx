import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '비전',
  description: '양영자탁구선교회(YTTM)의 비전, 미션, 선서와 전도 및 선교활동을 소개합니다.',
}

const MAROON = '#7B1818'

const pledges = [
  {
    title: '대사명',
    english: 'Great Commission',
    desc: '우리는 하나님께 영광을 드리기 위해 탁구를 비롯한 우리의 자원을 적극 활용하여 주님의 대사명에 순종하겠습니다.',
  },
  {
    title: '대계명',
    english: 'Great Commandment',
    desc: '우리는 세상의 소금과 빛으로 살기 위해 하나님을 사랑하고 이웃을 사랑하라는 주님의 대명령에 순종하겠습니다.',
  },
  {
    title: '구원',
    english: 'Salvation',
    desc: '우리는 예수 그리스도께서 우리 각 사람의 죄를 대신하여 십자가에서 죽었고 다시 살아나셨음을 믿으며 그분을 우리의 유일한 구주로 고백합니다.',
  },
  {
    title: '성화',
    english: 'Sanctification',
    desc: '우리는 삶의 모든 영역에서 예수님을 닮아가도록 성경에 기록된 대로 하나님의 뜻에 순종하는 삶을 살겠습니다.',
  },
]

const activities = [
  '전국/기독교/목회자/선교지 탁구대회 개최',
  '국내 및 해외 탁구캠프 개최',
  '국제적 교류 및 친선경기 개최',
  '기독교탁구단체와 동호인들의 협력 촉진',
  '체육인들의 교제와 협력 촉진',
  '전도 및 선교용 탁구용품 후원',
  '해외 한인 및 현지인교회 탁구행사 지원',
  '탁구 유망주 발굴 및 지원',
  '국내 이주민 선교',
  '선교자원 동원',
  '기독교 문서와 전도지 배포',
  '신앙간증',
]

export default function VisionPage() {
  return (
    <main className="bg-[#faf8f5]">
      {/* 우리의 비전 & 미션 */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-4 space-y-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: MAROON }}>
            우리의 비전
          </h1>
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
            하나님 나라를 전하는 축복의 통로되기 (눅 13:19)
          </p>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: MAROON }}>
            우리의 미션
          </h2>
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
            금보다 더 귀한 복음을 탁구공에 담아 전달하며 섬기며
          </p>
        </div>
      </section>

      {/* 우리의 선서 */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: MAROON }}>
              우리의 선서
            </h2>
            <ol className="space-y-7">
              {pledges.map((item, i) => (
                <li key={i}>
                  <p className="font-bold text-stone-800 mb-1.5">
                    {i + 1}. {item.title}{' '}
                    <span className="font-semibold">({item.english})</span>
                  </p>
                  <p className="text-stone-600 leading-relaxed pl-5 text-sm">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md bg-stone-200">
            <Image
              src="/images/vision-hall.jpg"
              alt="탁구 선교 활동"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 전도 및 선교활동 */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: MAROON }}>
              전도 및 선교활동
            </h2>
            <ul className="space-y-2.5">
              {activities.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-700 text-sm">
                  <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-stone-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md bg-stone-200">
            <Image
              src="/images/vision-prayer.jpg"
              alt="선교 활동 기도"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 성경 말씀 인용 */}
      <section className="py-16 mt-8 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg pt-12 pb-20 px-10 min-h-[460px] md:min-h-[560px]">
            <div className="absolute inset-0 bg-amber-50">
              <Image
                src="/images/tree.jpg"
                alt="겨자씨 나무"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-white/65" />
            </div>
            <div className="relative ml-auto max-w-2xl text-right">
              <p className="font-serif font-medium text-stone-800 text-xl md:text-2xl leading-relaxed tracking-wide break-keep">
                (하나님의 나라는) 마치 겨자씨와 같다.
                <br />
                어떤 사람이 그것을 가져다가 자기 정원에 심었더니,
                <br />
                자라서 나무가 되어, 공중의 새들이 그 가지에 깃들었다.
              </p>
              <p className="mt-4 font-serif italic text-sm text-stone-500 tracking-wide">
                (누가복음 13:19 표준새번역)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
