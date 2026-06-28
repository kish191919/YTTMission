import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import GalleryUploadClient from '@/components/gallery/GalleryUploadClient'

export const metadata: Metadata = { title: '사진·동영상 올리기' }

export default async function GalleryUploadPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/gallery/upload')

  return <GalleryUploadClient userId={user.id} />
}
