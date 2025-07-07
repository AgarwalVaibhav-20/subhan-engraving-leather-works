import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthRoute =
    url.pathname === '/' ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/verify');

  const isAdminRoute = url.pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  // Protect admin routes
  if (isAdminRoute && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verify/:path*',
    '/admin/:path*',
  ],
};
