import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthConfig, useSupabase } from './context';
import { createMockSupabaseClient } from '../test/mocks';
import type { AuthConfig } from './context';

describe('AuthContext', () => {
  const mockConfig: AuthConfig = {
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-key',
  };

  const mockSupabase = createMockSupabaseClient();

  describe('AuthProvider', () => {
    it('应该渲染children', () => {
      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <div>Test Content</div>
        </AuthProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该提供context值给children', () => {
      const TestComponent = () => {
        const { config } = useAuthConfig();
        return <div>{config.supabaseUrl}</div>;
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('https://test.supabase.co')).toBeInTheDocument();
    });
  });

  describe('useAuthConfig', () => {
    it('应该返回config和supabase实例', () => {
      const TestComponent = () => {
        const { config, supabase } = useAuthConfig();
        return (
          <div>
            <div>{config.supabaseUrl}</div>
            <div>{supabase ? 'Supabase Available' : 'No Supabase'}</div>
          </div>
        );
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('https://test.supabase.co')).toBeInTheDocument();
      expect(screen.getByText('Supabase Available')).toBeInTheDocument();
    });

    it('在Provider外使用时应该抛出错误', () => {
      // 捕获console.error以避免测试输出中出现错误信息
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const TestComponent = () => {
        useAuthConfig();
        return <div>Should not render</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useAuthConfig must be used within AuthProvider'
      );

      consoleError.mockRestore();
    });

    it('应该返回完整的配置对象', () => {
      const TestComponent = () => {
        const { config } = useAuthConfig();
        return (
          <div>
            <div data-testid="url">{config.supabaseUrl}</div>
            <div data-testid="key">{config.supabaseAnonKey}</div>
          </div>
        );
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('url')).toHaveTextContent('https://test.supabase.co');
      expect(screen.getByTestId('key')).toHaveTextContent('test-key');
    });
  });

  describe('useSupabase', () => {
    it('应该返回supabase客户端实例', () => {
      const TestComponent = () => {
        const supabase = useSupabase();
        return <div>{supabase ? 'Client Available' : 'No Client'}</div>;
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Client Available')).toBeInTheDocument();
    });

    it('在Provider外使用时应该抛出错误', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const TestComponent = () => {
        useSupabase();
        return <div>Should not render</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useAuthConfig must be used within AuthProvider'
      );

      consoleError.mockRestore();
    });

    it('应该返回与AuthProvider中相同的supabase实例', () => {
      const TestComponent = () => {
        const supabase = useSupabase();
        const { supabase: configSupabase } = useAuthConfig();
        return (
          <div>{supabase === configSupabase ? 'Same Instance' : 'Different Instance'}</div>
        );
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Same Instance')).toBeInTheDocument();
    });
  });

  describe('嵌套Provider', () => {
    it('应该支持嵌套Provider并使用最近的context', () => {
      const innerConfig: AuthConfig = {
        supabaseUrl: 'https://inner.supabase.co',
        supabaseAnonKey: 'inner-key',
      };

      const mockSupabase2 = createMockSupabaseClient();

      const TestComponent = () => {
        const { config } = useAuthConfig();
        return <div>{config.supabaseUrl}</div>;
      };

      render(
        <AuthProvider config={mockConfig} supabase={mockSupabase}>
          <div>
            <TestComponent />
            <AuthProvider config={innerConfig} supabase={mockSupabase2}>
              <TestComponent />
            </AuthProvider>
          </div>
        </AuthProvider>
      );

      expect(screen.getByText('https://test.supabase.co')).toBeInTheDocument();
      expect(screen.getByText('https://inner.supabase.co')).toBeInTheDocument();
    });
  });
});
