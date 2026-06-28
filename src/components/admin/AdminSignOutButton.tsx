'use client'

import { LogOut } from 'lucide-react'
import { adminSignOutAction } from '@/app/actions/admin-auth'

export default function AdminSignOutButton() {
  return (
    <form action={adminSignOutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-red-600 transition-colors"
      >
        <LogOut size={15} />
        로그아웃
      </button>
    </form>
  )
}
