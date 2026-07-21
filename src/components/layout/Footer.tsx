import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

const NAV_LINKS = [
  { label: '홈', href: '/' },
  { label: '소개', href: '/about' },
  { label: '비전', href: '/vision' },
  { label: '갤러리', href: '/gallery' },
]

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/Logo.png"
              alt="YTTM 로고"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">YTTM</p>
              <p className="text-xs text-amber-400">양영자탁구선교회</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex w-full justify-between sm:w-auto sm:flex-wrap sm:justify-start gap-x-6 gap-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Support CTA */}
          <Link
            href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shrink-0"
          >
            <Heart size={13} />
            선교 후원하기
          </Link>
        </div>

        <div className="border-t border-stone-800 mt-6 pt-4 flex flex-col sm:flex-row justify-center items-center gap-1">
          <p className="text-xs text-white">© 2024 YTTM 양영자탁구선교회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
