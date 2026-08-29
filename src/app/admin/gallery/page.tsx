import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdmin } from '@/lib/admin'
import GalleryFolderAdminClient from '@/components/admin/GalleryFolderAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  if (!(await isAdmin())) redirect('/admin/login')

  const supabase = createAdminClient()
  const [{ data: albums }, { data: galleryRows }] = await Promise.all([
    supabase.from('albums').select('*').order('sort_order', { ascending: true }),
    supabase.from('gallery').select('album, image_url, thumbnail_url, media_type'),
  ])

  const countMap = new Map<string, number>()
  const thumbMap = new Map<string, string | null>()
  for (const row of galleryRows ?? []) {
    countMap.set(row.album, (countMap.get(row.album) ?? 0) + 1)
    if (!thumbMap.has(row.album)) {
      thumbMap.set(row.album, row.thumbnail_url ?? row.image_url)
    }
  }

  const folders = (albums ?? []).map((a) => ({
    name: a.name,
    year: a.year,
    location: a.location,
    isPublic: a.is_public,
    photoCount: countMap.get(a.name) ?? 0,
    thumbnail: a.cover_image_url ?? thumbMap.get(a.name) ?? null,
  }))

  return <GalleryFolderAdminClient folders={folders} />
}
