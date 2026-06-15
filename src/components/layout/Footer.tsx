import Link from 'next/link'
import { Heart, Mail, Video, Camera } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                YT
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">YTTM</p>
                <p className="text-xs text-amber-400">양영자 탁구선교회</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              탁구로 세상을 품고,<br />
              복음으로 열방을 섬깁니다.<br />
              1988년 올림픽 금메달에서 시작된<br />
              선교의 여정은 계속됩니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">바로가기</h4>
            <ul className="space-y-2">
              {[
                { label: '선교사 소개', href: '/about' },
                { label: '선교 비전', href: '/about#vision' },
                { label: '활동 갤러리', href: '/gallery' },
                { label: '선교 소식', href: '/board' },
                { label: '후원하기', href: 'https://ihappynanum.com' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">연락 및 후원</h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@yttmission.org"
                className="flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition-colors"
              >
                <Mail size={15} />
                contact@yttmission.org
              </a>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" aria-label="YouTube" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <Video size={18} />
                </a>
                <a href="#" aria-label="SNS" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <Camera size={18} />
                </a>
              </div>
              <Link
                href="https://ihappynanum.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors mt-2"
              >
                <Heart size={13} />
                선교 후원하기
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-stone-500">© 2024 YTTM 양영자 탁구선교회. All rights reserved.</p>
          <p className="text-xs text-stone-600">Powered by Next.js + Supabase</p>
        </div>
      </div>
    </footer>
  )
}
