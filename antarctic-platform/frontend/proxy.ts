import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16: proxy.ts must export a named "proxy" function (renamed from "middleware")
export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Redirect root to dashboard or login
  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/dashboard' : '/login', request.url))
  }

  // Redirect unauthenticated users to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run on app pages — skip _next static files, images, and favicon
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
