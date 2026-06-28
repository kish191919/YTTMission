'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOutAction() {
  const cookieStore = await cookies()

  // 어드민 쿠키 삭제
  if (cookieStore.get('yttm_admin')?.value === '1') {
    cookieStore.delete('yttm_admin')
    redirect('/')
  }

  // 일반 Supabase 로그아웃
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
