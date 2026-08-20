import { createSupabaseServerClient } from './supabase-server'
import { adminEmails } from './admin-emails'

export async function isAdmin(): Promise<boolean> {
  const emails = adminEmails()
  if (emails.length === 0) return false

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return !!user?.email && emails.includes(user.email.toLowerCase())
}
