import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value)
          )
        },
      },
    }
  )

  // getUser()는 서버 검증을 수행 (getSession()은 쿠키만 읽으므로 인증에 사용 불가)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 미인증 상태에서 /admin/* 접근 → /admin/login 리디렉트
  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // 이미 로그인된 상태에서 /admin/login 접근 → /admin/hero 리디렉트
  if (path === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin/hero', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
