import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import BoardWriteClient from '@/components/board/BoardWriteClient'

export const metadata: Metadata = { title: '글쓰기' }

export default async function BoardWritePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/board/write')

  return <BoardWriteClient userId={user.id} />
}
