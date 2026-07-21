'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Heart, LogIn, LogOut, User, ShieldCheck } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'
import { adminSignOutAction } from '@/app/actions/admin-auth'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '소개', href: '/about' },
  { label: '비전', href: '/vision' },
  { label: '갤러리', href: '/gallery' },
]

type Props = {
  user: { id: string; email: string } | null
  displayName: string | null
  isAdmin?: boolean
}

export default function HeaderClient({ user, displayName, isAdmin }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileOpen])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
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
            <p className="text-sm text-amber-600 font-medium">양영자탁구선교회</p>
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
                <Link
                  href={item.href}
                  className="px-4 py-2 text-base font-medium text-stone-700 hover:text-amber-700 transition-colors rounded-lg hover:bg-amber-50"
                >
                  {item.label}
                </Link>
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

          {/* 어드민 상태 */}
          {isAdmin ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/admin/hero"
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
              >
                <ShieldCheck size={13} />
                관리자
              </Link>
              <form action={adminSignOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                >
                  <LogOut size={13} />
                  로그아웃
                </button>
              </form>
            </div>
          ) : user ? (
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
        <div className="md:hidden border-t border-amber-100 bg-white shadow-xl rounded-b-3xl">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center px-4 py-3.5 text-base font-semibold text-stone-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl text-center transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center justify-center px-4 py-2.5 text-sm text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-center transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-amber-100 space-y-3">
            <Link
              href="https://www.ihappynanum.com/Nanum/B/4ZOM149MCQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-base font-semibold px-4 py-3 rounded-full transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Heart size={16} />
              후원하기
            </Link>

            {isAdmin ? (
              <>
                <Link
                  href="/admin/hero"
                  className="flex items-center justify-center gap-2 border border-amber-200 text-amber-700 text-base font-semibold px-4 py-3 rounded-full hover:bg-amber-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <ShieldCheck size={16} />
                  관리자 페이지
                </Link>
                <form action={adminSignOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-600 text-base font-medium px-4 py-3 rounded-full hover:bg-stone-50 transition-colors"
                  >
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </form>
              </>
            ) : user ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-600 text-base font-medium px-4 py-3 rounded-full hover:bg-stone-50 transition-colors"
                >
                  <LogOut size={16} />
                  로그아웃 ({displayName ?? user.email})
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 border border-amber-200 text-amber-700 text-base font-semibold px-4 py-3 rounded-full hover:bg-amber-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
