import { createSupabaseServerClient } from '@/lib/supabase-server'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let displayName: string | null = null
  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()
    displayName = data?.display_name ?? null
  }

  return (
    <HeaderClient
      user={user ? { id: user.id, email: user.email! } : null}
      displayName={displayName}
    />
  )
}
