'use server'

import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('yttm_admin')?.value !== '1') throw new Error('Unauthorized')
  return createAdminClient()
}

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

export async function deletePostAction(id: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/board')
  redirect('/board')
}

export async function updatePostAction(
  id: number,
  data: { title: string; content: string; category: string }
) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('posts')
    .update({ title: data.title, content: data.content, category: data.category })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/board')
  revalidatePath(`/board/${id}`)
  redirect(`/board/${id}`)
}
