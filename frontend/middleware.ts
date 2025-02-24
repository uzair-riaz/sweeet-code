import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isHomePage = request.nextUrl.pathname === '/';

  if (token) {
    // If user is logged in and tries to access auth pages or home, redirect to dashboard
    if (isAuthPage || isHomePage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If user is not logged in and tries to access protected routes
    if (!isAuthPage && !isHomePage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
}; 