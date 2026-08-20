'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type GalleryItem = {
  title: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  album: string
  thumbnailUrl?: string
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
    thumbnail_url: item.thumbnailUrl ?? null,
  }))

  const uniqueAlbums = Array.from(new Set(items.map((item) => item.album)))
  await supabase.from('albums').upsert(
    uniqueAlbums.map((name) => ({ name, year: new Date().getFullYear() })),
    { onConflict: 'name', ignoreDuplicates: true }
  )

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
  const isAdminUser = await isAdmin()

  if (isAdminUser) {
    const supabase = createAdminClient()
    const { data: row } = await supabase
      .from('gallery')
      .select('image_url, thumbnail_url')
      .eq('id', id)
      .single()
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw new Error(error.message)

    const paths = row
      ? [extractStoragePath(row.image_url), row.thumbnail_url ? extractStoragePath(row.thumbnail_url) : null].filter(
          (p): p is string => !!p
        )
      : []
    if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

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
    .select('image_url, thumbnail_url, user_id')
    .eq('id', id)
    .single()
  if (!row || row.user_id !== user.id) throw new Error('Unauthorized')

  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw new Error(error.message)

  const paths = [
    extractStoragePath(row.image_url),
    row.thumbnail_url ? extractStoragePath(row.thumbnail_url) : null,
  ].filter((p): p is string => !!p)
  if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

  revalidatePath('/gallery')
}

export async function deleteAlbumAction(album: string) {
  const isAdminUser = await isAdmin()

  if (isAdminUser) {
    const supabase = createAdminClient()
    const { data: rows } = await supabase
      .from('gallery')
      .select('id, image_url, thumbnail_url')
      .eq('album', album)

    if (rows && rows.length > 0) {
      const { error } = await supabase.from('gallery').delete().eq('album', album)
      if (error) throw new Error(error.message)
    }

    await supabase.from('albums').delete().eq('name', album)

    const paths = (rows ?? [])
      .flatMap((r) => [extractStoragePath(r.image_url), r.thumbnail_url ? extractStoragePath(r.thumbnail_url) : null])
      .filter((p): p is string => !!p)
    if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')
    redirect('/gallery')
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: rows } = await supabase
    .from('gallery')
    .select('id, image_url, thumbnail_url, user_id')
    .eq('album', album)
  if (!rows || rows.length === 0) throw new Error('삭제할 사진이 없습니다.')
  if (rows.some((r) => r.user_id !== user.id)) {
    throw new Error('본인이 올린 사진만 있는 앨범만 전체 삭제할 수 있습니다.')
  }

  const { error } = await supabase.from('gallery').delete().eq('album', album)
  if (error) throw new Error(error.message)

  await supabase.from('albums').delete().eq('name', album)

  const paths = rows
    .flatMap((r) => [extractStoragePath(r.image_url), r.thumbnail_url ? extractStoragePath(r.thumbnail_url) : null])
    .filter((p): p is string => !!p)
  if (paths.length) await supabase.storage.from('member-uploads').remove(paths)

  revalidatePath('/gallery')
  redirect('/gallery')
}

export async function updateAlbumYearAction(album: string, year: number) {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) throw new Error('Unauthorized')
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error('올바른 연도를 입력하세요.')
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('albums').upsert({ name: album, year }, { onConflict: 'name' })
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
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

  await supabase.from('albums').upsert(
    { name: input.album, year: new Date().getFullYear() },
    { onConflict: 'name', ignoreDuplicates: true }
  )

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

type AlbumMetaInput = {
  name: string
  location: string | null
  year: number
  isPublic: boolean
}

export async function updateAlbumMetaAction(currentName: string, input: AlbumMetaInput) {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) throw new Error('Unauthorized')

  const name = input.name.trim()
  if (!name) throw new Error('폴더 이름을 입력하세요.')
  if (!Number.isInteger(input.year) || input.year < 2000 || input.year > 2100) {
    throw new Error('올바른 연도를 입력하세요.')
  }

  const supabase = createAdminClient()

  if (name !== currentName) {
    const { data: existing } = await supabase
      .from('albums')
      .select('name')
      .eq('name', name)
      .maybeSingle()
    if (existing) throw new Error('이미 존재하는 폴더 이름입니다.')

    const { error: galleryError } = await supabase
      .from('gallery')
      .update({ album: name })
      .eq('album', currentName)
    if (galleryError) throw new Error(galleryError.message)
  }

  const { error } = await supabase
    .from('albums')
    .update({
      name,
      location: input.location,
      year: input.year,
      is_public: input.isPublic,
    })
    .eq('name', currentName)
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}

export async function toggleAlbumVisibilityAction(album: string, isPublic: boolean) {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) throw new Error('Unauthorized')

  const supabase = createAdminClient()
  const { error } = await supabase.from('albums').update({ is_public: isPublic }).eq('name', album)
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}
