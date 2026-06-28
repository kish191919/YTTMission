'use server'

import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

async function requireAdminOrAuth() {
  const cookieStore = await cookies()
  if (cookieStore.get('yttm_admin')?.value === '1') {
    return createAdminClient()
  }
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return supabase
}

export async function saveHeroMedia(
  mediaUrl: string,
  storagePath: string,
  mediaType: 'image' | 'video',
  title: string
) {
  const supabase = await requireAdminOrAuth()

  const { data: last } = await supabase
    .from('hero_media')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (last?.display_order ?? 0) + 1

  const { error } = await supabase.from('hero_media').insert({
    media_url: mediaUrl,
    storage_path: storagePath,
    media_type: mediaType,
    title,
    display_order: nextOrder,
    active: true,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/hero')
}

export async function deleteHeroMedia(id: number, storagePath: string) {
  const supabase = await requireAdminOrAuth()

  if (storagePath) {
    await supabase.storage.from('hero-media').remove([storagePath])
  }

  const { error } = await supabase.from('hero_media').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/hero')
}

export async function toggleHeroMedia(id: number, active: boolean) {
  const supabase = await requireAdminOrAuth()

  const { error } = await supabase
    .from('hero_media')
    .update({ active })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/hero')
}

export async function reorderHeroMedia(id: number, direction: 'up' | 'down') {
  const supabase = await requireAdminOrAuth()

  const { data: current } = await supabase
    .from('hero_media')
    .select('id, display_order')
    .eq('id', id)
    .single()

  if (!current) return

  const { data: neighbor } = await supabase
    .from('hero_media')
    .select('id, display_order')
    .eq('display_order', direction === 'up' ? current.display_order - 1 : current.display_order + 1)
    .maybeSingle()

  if (!neighbor) return

  const { error: e1 } = await supabase
    .from('hero_media')
    .update({ display_order: neighbor.display_order })
    .eq('id', current.id)

  const { error: e2 } = await supabase
    .from('hero_media')
    .update({ display_order: current.display_order })
    .eq('id', neighbor.id)

  if (e1 || e2) throw new Error('순서 변경 실패')

  revalidatePath('/')
  revalidatePath('/admin/hero')
}
