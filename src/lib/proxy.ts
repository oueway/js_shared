import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export interface ProxyConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  protectedRoutes?: string[];
  authRoutes?: string[];
  redirectAfterLogin?: string;
  redirectAfterLogout?: string;
}

export function createProxy(config: ProxyConfig) {
  const {
    supabaseUrl,
    supabaseAnonKey,
    protectedRoutes = ['/dashboard', '/account'],
    authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'],
    redirectAfterLogin = '/dashboard',
    redirectAfterLogout = '/login',
  } = config;

  return async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const url = request.nextUrl.clone();

    // Check if current path matches protected routes
    const isProtectedRoute = protectedRoutes.some((route) =>
      url.pathname.startsWith(route)
    );

    // Check if current path matches auth routes
    const isAuthPage = authRoutes.some((route) => url.pathname === route);

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !user) {
      const loginUrl = new URL(redirectAfterLogout, request.url);
      loginUrl.searchParams.set('redirect_to', url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages to dashboard
    if (isAuthPage && user) {
      return NextResponse.redirect(new URL(redirectAfterLogin, request.url));
    }

    return supabaseResponse;
  };
}
