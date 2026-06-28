'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Heart, LogIn, LogOut, User } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'

const navItems = [
  { label: '홈', href: '/' },
  { label: '소개', href: '/about' },
  { label: '비전', href: '/vision' },
  {
    label: '갤러리',
    href: '/gallery',
    children: [
      { label: '2025 선교 활동', href: '/gallery?album=2025' },
      { label: '2024 몽골 선교', href: '/gallery?album=2024-mongolia' },
      { label: '2024 선교 기록', href: '/gallery?album=2024' },
    ],
  },
  { label: '게시판', href: '/board' },
]

type Props = {
  user: { id: string; email: string } | null
  displayName: string | null
}

export default function HeaderClient({ user, displayName }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/Logo.png"
            alt="YTTM 로고"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="text-base font-bold text-stone-800">YTTM</p>
            <p className="text-sm text-amber-600 font-medium">양영자 탁구선교회</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setDropdownOpen(item.href)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button className="px-4 py-2 text-base font-medium text-stone-700 hover:text-amber-700 transition-colors rounded-lg hover:bg-amber-50">
                  {item.label}
                </button>
                {dropdownOpen === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-amber-50 py-1 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-base font-medium text-stone-700 hover:text-amber-700 transition-colors rounded-lg hover:bg-amber-50"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + Auth + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-base font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Heart size={14} />
            후원하기
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-stone-600 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                <User size={13} />
                {displayName ?? user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors"
                >
                  <LogOut size={13} />
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors border border-stone-200"
            >
              <LogIn size={13} />
              로그인
            </Link>
          )}

          <button
            className="md:hidden p-2 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-amber-100 bg-white py-3">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block px-6 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-10 py-2 text-sm text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="px-6 pt-3 pb-1 border-t border-amber-50 mt-2 space-y-2">
            <Link
              href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              <Heart size={14} />
              후원하기
            </Link>
            {user ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 border border-stone-200 text-stone-600 text-sm font-medium px-4 py-2.5 rounded-full hover:bg-stone-50 transition-colors"
                >
                  <LogOut size={14} />
                  로그아웃 ({displayName ?? user.email})
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-amber-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={14} />
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
