'use client';

import React, { createContext, useContext } from 'react';

export interface AuthUIConfig {
  logo?: React.ReactNode;
  appName?: string;
  enableOAuth?: boolean;
  oauthProviders?: Array<'google' | 'apple'>;
  redirectAfterLogin: string;
  redirectAfterRegister: string;
  forgotPasswordLink: string;
  registerLink: string;
  loginLink: string;
  authCallbackUrl: string;
  resetPasswordLink: string;
  homePageUrl?: string;
  legalLinks?: Array<{
    label: string;
    href: string;
  }>;
}

const AuthUIConfigContext = createContext<AuthUIConfig | null>(null);

export interface AuthUIProviderProps {
  children: React.ReactNode;
  config: AuthUIConfig;
}

export function AuthUIProvider({ children, config }: AuthUIProviderProps) {
  return (
    <AuthUIConfigContext.Provider value={config}>
      {children}
    </AuthUIConfigContext.Provider>
  );
}

export function useAuthUIConfig(): AuthUIConfig {
  const context = useContext(AuthUIConfigContext) || {
    logo: 'O',
    appName: 'Unnamed App',
    enableOAuth: true,
    oauthProviders: [],
    redirectAfterLogin: '/app',
    redirectAfterRegister: '/auth/login',
    forgotPasswordLink: '/auth/forgot-password',
    registerLink: '/auth/register',
    loginLink: '/auth/login',
    authCallbackUrl: '/auth/callback',
    resetPasswordLink: '/auth/reset-password',
  };

  // Helper to ensure URLs passed to Supabase are absolute
  // This is critical for redirects to work correctly across different environments (localhost vs prod)
  const toAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  };

  return {
    ...context,
    authCallbackUrl: toAbsoluteUrl(context.authCallbackUrl),
    resetPasswordLink: toAbsoluteUrl(context.resetPasswordLink),
    homePageUrl: context.homePageUrl ? toAbsoluteUrl(context.homePageUrl) : undefined,
  };
}
