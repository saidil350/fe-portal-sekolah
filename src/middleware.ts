import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from '@/types';

// Rute yang dilewati otentikasi
const PUBLIC_PATHS = ['/', '/login', '/api/public'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati file statis, next internal, dll
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Ambil sesi user dari cookie
  const token = request.cookies.get('portal_session')?.value;
  const userRoleCookie = request.cookies.get('portal_user_role')?.value as Role | undefined;

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  // 1. Jika rute dilindungi dan tidak ada token -> Arahkan ke Login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Validasi Peran Rute (Role-Based Route Guard) untuk rute dashboard
  if (token && pathname.startsWith('/dashboard')) {
    if (pathname.startsWith('/dashboard/admin') && userRoleCookie !== 'ADMIN_IT') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/kepala-sekolah') && userRoleCookie !== 'KEPALA_SEKOLAH') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/bendahara') && userRoleCookie !== 'BENDAHARA') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/guru') && userRoleCookie !== 'GURU') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/staff') && userRoleCookie !== 'STAFF') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/siswa') && userRoleCookie !== 'SISWA') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith('/dashboard')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
}

function getRoleDashboard(role: Role): string {
  switch (role) {
    case 'ADMIN_IT': return '/dashboard/admin';
    case 'KEPALA_SEKOLAH': return '/dashboard/kepala-sekolah';
    case 'BENDAHARA': return '/dashboard/bendahara';
    case 'GURU': return '/dashboard/guru';
    case 'STAFF': return '/dashboard/staff';
    case 'SISWA': return '/dashboard/siswa';
    default: return '/dashboard/siswa';
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
