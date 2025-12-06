import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AuthProvider } from '../lib/context';
import { AuthUIProvider, AuthUIConfig } from '../lib/auth-ui-config';
import { createMockSupabaseClient } from './mocks';
import type { AuthConfig } from '../lib/context';

const defaultConfig: AuthConfig = {
  supabaseUrl: 'https://test.supabase.co',
  supabaseAnonKey: 'test-key',
  companyName: 'Test Company',
  logoLetter: 'T',
  redirectAfterLogin: '/dashboard',
  enableOAuth: true,
  oauthProviders: ['google', 'github'],
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  config?: Partial<AuthConfig>;
  uiConfig?: Partial<AuthUIConfig>;
  supabase?: any;
}

export function renderWithAuth(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { config = {}, uiConfig = {}, supabase = createMockSupabaseClient(), ...renderOptions } = options || {};
  
  const mergedConfig = { ...defaultConfig, ...config };
  const defaultUIConfig: AuthUIConfig = {
    logo: 'O',
    appName: undefined,
    enableOAuth: true,
    oauthProviders: ['google', 'apple'],
    redirectAfterLogin: '/dashboard',
    redirectAfterRegister: '/dashboard',
    forgotPasswordLink: '/forgot-password',
    registerLink: '/register',
    loginLink: '/login',
    authCallbackUrl: undefined,
    homePage: '/',
  };
  const mergedUIConfig = { ...defaultUIConfig, ...uiConfig };

  return render(
    <AuthProvider config={mergedConfig} supabase={supabase}>
      <AuthUIProvider config={mergedUIConfig}>
        {ui}
      </AuthUIProvider>
    </AuthProvider>,
    renderOptions
  );
}

export * from '@testing-library/react';
export { renderWithAuth as render };
