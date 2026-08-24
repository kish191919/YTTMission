import { supabase } from '@/lib/supabase'
import { baseUrl, siteName } from '@/lib/site-config'

export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, content, category, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(30)

  const items = (posts ?? [])
    .map((post) => {
      const link = `${baseUrl}/board/${post.id}`
      const description = post.content.slice(0, 300)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(description)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>탁구로 세상을 품고, 복음으로 열방을 섬깁니다.</description>
    <language>ko-KR</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
