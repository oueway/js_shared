import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AuthProvider } from '../lib/context';
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
  supabase?: any;
}

export function renderWithAuth(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { config = {}, supabase = createMockSupabaseClient(), ...renderOptions } = options || {};
  
  const mergedConfig = { ...defaultConfig, ...config };

  return render(
    <AuthProvider config={mergedConfig} supabase={supabase}>
      {ui}
    </AuthProvider>,
    renderOptions
  );
}

export * from '@testing-library/react';
export { renderWithAuth as render };
