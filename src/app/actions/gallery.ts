'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
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
