import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import GalleryEditClient from '@/components/gallery/GalleryEditClient'

export default async function GalleryEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const galleryId = Number(id)
  if (!Number.isFinite(galleryId)) notFound()

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/gallery/${galleryId}/edit`)

  const { data: row } = await supabase.from('gallery').select('*').eq('id', galleryId).single()
  if (!row) notFound()
  if (row.user_id !== user.id) redirect('/gallery')

  return (
    <GalleryEditClient
      galleryId={row.id}
      initialTitle={row.title}
      initialDescription={row.description}
      initialAlbum={row.album}
      initialTakenAt={row.taken_at}
      mediaUrl={row.image_url}
      mediaType={row.media_type}
    />
  )
}
