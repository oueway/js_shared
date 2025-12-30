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
  homePage?: string;
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
  const context = useContext(AuthUIConfigContext);
  if (!context) {
    // 返回默认配置而不是抛出错误
    return {
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
      homePage: '/',
    };
  }
  return context;
}
