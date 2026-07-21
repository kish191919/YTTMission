import { cookies } from 'next/headers'
import { createSupabaseServerClient } from './supabase-server'

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  if (cookieStore.get('yttm_admin')?.value === '1') return true

  const emails = adminEmails()
  if (emails.length === 0) return false

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return !!user?.email && emails.includes(user.email.toLowerCase())
}
