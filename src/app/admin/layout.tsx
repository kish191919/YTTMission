import Link from 'next/link'
import AdminSignOutButton from '@/components/admin/AdminSignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-stone-800 text-sm">YTTM 관리자</span>
          <Link
            href="/admin/hero"
            className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            히어로 미디어
          </Link>
        </div>
        <AdminSignOutButton />
      </nav>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  )
}
