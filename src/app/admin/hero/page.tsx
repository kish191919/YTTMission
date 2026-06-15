import { createSupabaseServerClient } from '@/lib/supabase-server'
import HeroAdminClient from '@/components/admin/HeroAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminHeroPage() {
  const supabase = await createSupabaseServerClient()

  const { data: items } = await supabase
    .from('hero_media')
    .select('*')
    .order('display_order', { ascending: true })

  return <HeroAdminClient items={items ?? []} />
}
