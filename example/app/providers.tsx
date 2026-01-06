'use client';

import React from 'react';
import { AuthProvider, AuthUIProvider } from '@oueway/js-shared/lib';
import { useSupabaseClient } from '../lib/supabase-client';
import { AppLogo } from './components/AppLogo';

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient();

  return (
    <AuthProvider
      config={{
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      }}
      supabase={supabase}
    >
      <AuthUIProvider
        config={{
          logo: <AppLogo /> as any,
          appName: 'JS Shared Example',
          enableOAuth: true,
          oauthProviders: ['google', 'apple'],
          redirectAfterLogin: '/dashboard',
          redirectAfterRegister: '/dashboard',
          forgotPasswordLink: '/auth/forgot-password',
          registerLink: '/auth/register',
          loginLink: '/auth/login',
          authCallbackUrl: '/auth/callback',
          resetPasswordLink: '/auth/reset-password',
          homePageUrl: '/',
          security: {
            captcha: {
              provider: 'turnstile',
              siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
            },
          },
          legalLinks: [
            { label: 'Terms', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
          ],
        }}
      >
        {children as any}
      </AuthUIProvider>
    </AuthProvider>
  );
}
