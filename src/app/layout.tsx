import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'YTTM 양영자 탁구선교회',
    template: '%s | YTTM 양영자 탁구선교회',
  },
  description:
    '탁구로 세상을 품고, 복음으로 열방을 섬깁니다. 1988년 올림픽 금메달리스트 양영자 선교사가 이끄는 탁구 선교 사역입니다.',
  keywords: ['양영자', '탁구선교회', 'YTTM', '선교', '탁구', '몽골선교'],
  openGraph: {
    title: 'YTTM 양영자 탁구선교회',
    description: '탁구로 세상을 품고, 복음으로 열방을 섬깁니다.',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
