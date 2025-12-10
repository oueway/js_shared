import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Redirect to dashboard after successful OAuth
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if no code
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
