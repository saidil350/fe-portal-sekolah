import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractTenantFromDomain } from '@/lib/auth';
import { Role } from '@/types';

// Rute yang dilewati otentikasi
const PUBLIC_PATHS = ['/', '/login', '/api/public'];

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Lewati file statis, next internal, dll
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Ekstrak subdomain tenant (jika ada)
  const tenantDomain = extractTenantFromDomain(hostname);

  // Ambil sesi user dari cookie
  const token = request.cookies.get('portal_session')?.value;
  const userRoleCookie = request.cookies.get('portal_user_role')?.value as Role | undefined;
  const userTenantCookie = request.cookies.get('portal_user_tenant')?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  // 1. Jika rute dilindungi dan tidak ada token -> Arahkan ke Login
  // Middleware hanya cek cookie existence sebagai first-pass gate.
  // Client-side AuthProvider menangani validasi token dan redirect jika sudah login.
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    if (tenantDomain) {
      loginUrl.searchParams.set('tenant', tenantDomain);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah punya token dan di /login, BIARKAN render login page.
  // AuthProvider di client-side akan validate session dan redirect ke dashboard jika valid.
  // Ini menghindari auto-skip yang terjadi karena cookie stale/expired.

  // 3. Validasi Tenant Multi-Tenant untuk rute dashboard
  if (token && pathname.startsWith('/dashboard')) {
    // ADMIN_IT bebas dari tenant check (karena sekarang bertindak global)
    if (userRoleCookie !== 'ADMIN_IT') {
      if (tenantDomain && userTenantCookie && tenantDomain !== userTenantCookie) {
        return new NextResponse('Unauthorized: Tenant Mismatch', { status: 403 });
      }
    }

    // 4. Validasi Peran Rute (Role-Based Route Guard)
    if (pathname.startsWith('/dashboard/admin') && userRoleCookie !== 'ADMIN_IT') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/kepala-sekolah') && userRoleCookie !== 'KEPALA_SEKOLAH') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/guru') && userRoleCookie !== 'GURU') {
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
    case 'GURU': return '/dashboard/guru';
    case 'SISWA': return '/dashboard/siswa';
    default: return '/dashboard/siswa';
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
