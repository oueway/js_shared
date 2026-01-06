'use client';

import React, { createContext, useContext } from 'react';
import { useSearchParams } from 'next/navigation';

export interface AuthUIConfig {
  logo?: React.ReactNode;
  appName?: string;
  apps?: Record<string, string>;
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
  security?: {
    captcha?: {
      provider: 'turnstile';
      siteKey: string;
    };
  };
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
    apps: {},
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

  let searchParams = null;
  try {
    searchParams = useSearchParams();
  } catch (e) {
    // Ignore if not in a valid context
  }
  
  const appId = searchParams?.get('appId');

  // Determine the effective app name
  const effectiveAppName = (appId && context.apps?.[appId]) || context.appName;

  // Helper to append appId to URLs to maintain context during navigation
  const appendAppId = (url: string) => {
    if (!url || !appId) return url;
    if (url.includes('appId=')) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}appId=${encodeURIComponent(appId)}`;
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
    appName: effectiveAppName,
    loginLink: appendAppId(context.loginLink),
    registerLink: appendAppId(context.registerLink),
    forgotPasswordLink: appendAppId(context.forgotPasswordLink),
    authCallbackUrl: appendAppId(toAbsoluteUrl(context.authCallbackUrl)),
    resetPasswordLink: appendAppId(toAbsoluteUrl(context.resetPasswordLink)),
    homePageUrl: context.homePageUrl ? appendAppId(context.homePageUrl) : undefined,
  };
}
