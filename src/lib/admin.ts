import { cookies } from 'next/headers'

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('yttm_admin')?.value === '1'
}
