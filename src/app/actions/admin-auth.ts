'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminSignInAction(next: string = '/') {
  const cookieStore = await cookies()
  cookieStore.set('yttm_admin', '1', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
    sameSite: 'lax',
  })
  redirect(next)
}

export async function adminSignOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('yttm_admin')
  redirect('/')
}
