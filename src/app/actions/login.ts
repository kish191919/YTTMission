'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function loginAction(email: string, password: string): Promise<{ error: string | null }> {
  const trimmed = email.trim()
  const resolvedEmail =
    trimmed.toLowerCase() === 'admin'
      ? (process.env.ADMIN_EMAILS ?? '').split(',')[0]?.trim()
      : trimmed

  if (!resolvedEmail) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  return { error: null }
}
