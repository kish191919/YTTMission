'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/board/write')

  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const category = (formData.get('category') as string) ?? '선교 소식'
  const imagesJson = formData.get('images') as string | null
  const images: string[] = imagesJson ? JSON.parse(imagesJson) : []

  if (!title || !content) {
    throw new Error('제목과 내용을 입력해주세요.')
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, category, images, user_id: user.id, published: true })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/board')
  redirect(`/board/${data.id}`)
}
