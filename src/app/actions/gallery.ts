'use server'

import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type GalleryItem = {
  title: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  album: string
}

export async function saveGalleryItemsAction(items: GalleryItem[]) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/gallery/upload')
  if (!items.length) throw new Error('업로드할 파일이 없습니다.')

  const rows = items.map((item) => ({
    title: item.title,
    image_url: item.mediaUrl,
    media_type: item.mediaType,
    album: item.album,
    user_id: user.id,
  }))

  const { error } = await supabase.from('gallery').insert(rows)
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  redirect('/gallery')
}

function extractStoragePath(imageUrl: string) {
  const marker = '/member-uploads/'
  const idx = imageUrl.indexOf(marker)
  if (idx === -1) return null
  return imageUrl.slice(idx + marker.length)
}

export async function deleteGalleryItemAction(id: number) {
  const cookieStore = await cookies()
  const isAdminUser = cookieStore.get('yttm_admin')?.value === '1'

  if (isAdminUser) {
    const supabase = createAdminClient()
    const { data: row } = await supabase.from('gallery').select('image_url').eq('id', id).single()
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw new Error(error.message)

    const storagePath = row ? extractStoragePath(row.image_url) : null
    if (storagePath) await supabase.storage.from('member-uploads').remove([storagePath])

    revalidatePath('/gallery')
    return
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: row } = await supabase
    .from('gallery')
    .select('image_url, user_id')
    .eq('id', id)
    .single()
  if (!row || row.user_id !== user.id) throw new Error('Unauthorized')

  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw new Error(error.message)

  const storagePath = extractStoragePath(row.image_url)
  if (storagePath) await supabase.storage.from('member-uploads').remove([storagePath])

  revalidatePath('/gallery')
}

export async function deleteAlbumAction(album: string) {
  const cookieStore = await cookies()
  const isAdminUser = cookieStore.get('yttm_admin')?.value === '1'

  if (isAdminUser) {
    const supabase = createAdminClient()
    const { data: rows } = await supabase.from('gallery').select('id, image_url').eq('album', album)
    if (!rows || rows.length === 0) throw new Error('삭제할 사진이 없습니다.')

    const { error } = await supabase.from('gallery').delete().eq('album', album)
    if (error) throw new Error(error.message)

    const paths = rows.map((r) => extractStoragePath(r.image_url)).filter((p): p is string => !!p)
    if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

    revalidatePath('/gallery')
    redirect('/gallery')
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: rows } = await supabase
    .from('gallery')
    .select('id, image_url, user_id')
    .eq('album', album)
  if (!rows || rows.length === 0) throw new Error('삭제할 사진이 없습니다.')
  if (rows.some((r) => r.user_id !== user.id)) {
    throw new Error('본인이 올린 사진만 있는 앨범만 전체 삭제할 수 있습니다.')
  }

  const { error } = await supabase.from('gallery').delete().eq('album', album)
  if (error) throw new Error(error.message)

  const paths = rows.map((r) => extractStoragePath(r.image_url)).filter((p): p is string => !!p)
  if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

  revalidatePath('/gallery')
  redirect('/gallery')
}

type GalleryUpdateInput = {
  title: string
  description: string | null
  album: string
  takenAt: string | null
}

export async function updateGalleryItemAction(id: number, input: GalleryUpdateInput) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/gallery')

  const { error } = await supabase
    .from('gallery')
    .update({
      title: input.title,
      description: input.description,
      album: input.album,
      taken_at: input.takenAt,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  redirect('/gallery')
}
