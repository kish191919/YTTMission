import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { baseUrl } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/vision`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/board`, changeFrequency: 'daily', priority: 0.7 },
  ]

  const { data: posts } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/board/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes]
}
