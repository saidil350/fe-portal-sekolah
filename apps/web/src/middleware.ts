import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractTenantFromDomain } from '@portal-sekolah/auth';
import { Role } from '@portal-sekolah/types';

// Rute yang dilewati otentikasi
const PUBLIC_PATHS = ['/login', '/api/public'];

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
  
  // Ambil sesi user dari cookie (simulasi JWT/Better-Auth session cookie)
  const token = request.cookies.get('portal_session')?.value;
  const userRoleCookie = request.cookies.get('portal_user_role')?.value as Role | undefined;
  const userTenantCookie = request.cookies.get('portal_user_tenant')?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 1. Jika rute dilindungi dan tidak ada token -> Arahkan ke Login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    if (tenantDomain) {
      loginUrl.searchParams.set('tenant', tenantDomain);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login dan mencoba masuk ke login page -> Redirect ke dashboard
  if (token && pathname === '/login') {
    const targetDashboard = getRoleDashboard(userRoleCookie || 'SISWA');
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 3. Validasi Tenant Multi-Tenant untuk rute dashboard
  if (token && pathname.startsWith('/dashboard')) {
    // SUPER_ADMIN bebas dari tenant check
    if (userRoleCookie !== 'SUPER_ADMIN') {
      // Jika pengguna adalah user sekolah biasa, pastikan domain sekolah di url cocok dengan tenant pengguna
      if (tenantDomain && userTenantCookie && tenantDomain !== userTenantCookie) {
        // Domain mismatch! Kembalikan error / unauthorized
        return new NextResponse('Unauthorized: Tenant Mismatch', { status: 403 });
      }
    }

    // 4. Validasi Peran Rute (Role-Based Route Guard)
    // /dashboard/super-admin -> Hanya SUPER_ADMIN
    // /dashboard/admin -> Hanya ADMIN_IT
    // /dashboard/kepala-sekolah -> Hanya KEPALA_SEKOLAH
    // /dashboard/guru -> Hanya GURU
    // /dashboard/staff -> Hanya STAFF
    // /dashboard/siswa -> Hanya SISWA
    if (pathname.startsWith('/dashboard/super-admin') && userRoleCookie !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/admin') && userRoleCookie !== 'ADMIN_IT') {
      return NextResponse.redirect(new URL(getRoleDashboard(userRoleCookie || 'SISWA'), request.url));
    }
    if (pathname.startsWith('/dashboard/kepala-sekolah') && userRoleCookie !== 'KEPALA_SEKOLAH') {
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

  return NextResponse.next();
}

function getRoleDashboard(role: Role): string {
  switch (role) {
    case 'SUPER_ADMIN': return '/dashboard/super-admin';
    case 'ADMIN_IT': return '/dashboard/admin';
    case 'KEPALA_SEKOLAH': return '/dashboard/kepala-sekolah';
    case 'GURU': return '/dashboard/guru';
    case 'STAFF': return '/dashboard/staff';
    case 'SISWA': return '/dashboard/siswa';
    default: return '/dashboard/siswa';
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
