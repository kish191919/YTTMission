import Link from 'next/link'
import AdminSignOutButton from '@/components/admin/AdminSignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/hero"
            className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            메인 화면 관리
          </Link>
          <Link
            href="/admin/gallery"
            className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            갤러리 폴더
          </Link>
        </div>
        <AdminSignOutButton />
      </nav>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  )
}
