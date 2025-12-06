'use client';

import React, { createContext, useContext } from 'react';

export interface AuthUIConfig {
  logo?: React.ReactNode;
  appName?: string;
  enableOAuth?: boolean;
  oauthProviders?: Array<'google' | 'apple'>;
  redirectAfterLogin?: string;
  redirectAfterRegister?: string;
  forgotPasswordLink?: string;
  registerLink?: string;
  loginLink?: string;
  authCallbackUrl?: string;
  homePage?: string;
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
      appName: undefined,
      enableOAuth: true,
      oauthProviders: undefined,
      redirectAfterLogin: '/app',
      redirectAfterRegister: '/auth/login',
      forgotPasswordLink: '/auth/forgot-password',
      registerLink: '/auth/register',
      loginLink: '/auth/login',
      authCallbackUrl: '/auth/callback',
      homePage: '/',
    };
  }
  return context;
}
