import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createLoginPage } from './LoginPage';
import { createMockSupabaseClient } from '../../test/mocks';
import { renderWithAuth } from '../../test/utils';

describe('LoginPage', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;
  let LoginPage: ReturnType<typeof createLoginPage>;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
    
    // Reset window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: '',
        origin: 'http://localhost:3000',
      },
    });
    
    LoginPage = createLoginPage();
  });

  describe('基本渲染', () => {
    it('应该渲染登录表单', () => {
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('应该显示自定义公司名称', () => {
      renderWithAuth(<LoginPage />, {
        uiConfig: { appName: 'TestCompany' },
        supabase: mockSupabase,
      });

      expect(screen.getByText(/Welcome to TestCompany/i)).toBeInTheDocument();
    });

    it('应该显示自定义logo字母', () => {
      renderWithAuth(<LoginPage />, {
        uiConfig: { logo: 'T' },
        supabase: mockSupabase,
      });

      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('应该默认启用OAuth登录选项', () => {
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    it('应该可以禁用OAuth登录', () => {
      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { enableOAuth: false },
      });

      expect(screen.queryByRole('button', { name: /google/i })).not.toBeInTheDocument();
    });
  });

  describe('邮箱密码登录', () => {
    it('应该成功登录', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({ 
        data: { user: { id: '123' } }, 
        error: null 
      });

      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { redirectAfterLogin: '/dashboard' },
      });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      await waitFor(() => {
        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
      });
    });

    it('应该显示登录错误', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('应该在提交时显示加载状态', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100))
      );

      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // 应该显示加载指示器
      expect(submitButton).toBeDisabled();
    });

    it('应该支持切换密码可见性', async () => {
      const user = userEvent.setup();
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement;
      // Find all buttons and get the toggle button (not the submit button)
      const buttons = screen.getAllByRole('button');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      const toggleButton = buttons.find(btn => btn !== submitButton && btn.getAttribute('type') === 'button');

      expect(passwordInput.type).toBe('password');

      if (toggleButton) {
        await user.click(toggleButton);
        expect(passwordInput.type).toBe('text');

        await user.click(toggleButton);
        expect(passwordInput.type).toBe('password');
      }
    });
  });

  describe('OAuth登录', () => {
    it('应该使用Google登录', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithOAuth = vi.fn().mockResolvedValue({ 
        data: { url: 'https://google.com/oauth' }, 
        error: null 
      });

      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      });
    });

    it('应该使用自定义callback URL', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithOAuth = vi.fn().mockResolvedValue({ 
        data: { url: 'https://google.com/oauth' }, 
        error: null 
      });

      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { authCallbackUrl: 'https://example.com/custom-callback' },
      });

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://example.com/custom-callback',
        },
      });
    });

    it('应该显示OAuth错误', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithOAuth = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'OAuth provider error' },
      });

      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText(/OAuth provider error/i)).toBeInTheDocument();
      });
    });

    it('应该只显示配置的OAuth providers', () => {
      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { oauthProviders: ['google'] },
      });

      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /apple/i })).not.toBeInTheDocument();
    });
  });

  describe('导航链接', () => {
    it('应该显示忘记密码链接', () => {
      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { forgotPasswordLink: '/forgot-password' },
      });

      const forgotLink = screen.getByText(/forgot password/i).closest('a');
      expect(forgotLink).toHaveAttribute('href', '/forgot-password');
    });

    it('应该显示注册链接', () => {
      renderWithAuth(<LoginPage />, {
        supabase: mockSupabase,
        uiConfig: { registerLink: '/register' },
      });

      const registerLink = screen.getByText(/sign up/i).closest('a');
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('表单验证', () => {
    it('应该不能提交空表单', async () => {
      const user = userEvent.setup();
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // 由于是空表单,不应该调用API
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('应该清除之前的错误消息', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword = vi.fn()
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'First error' },
        })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Second error' },
        });

      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const emailInput = screen.getByPlaceholderText(/name@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // 第一次提交
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/First error/i)).toBeInTheDocument();
      });

      // 第二次提交应该清除第一个错误
      await user.clear(passwordInput);
      await user.type(passwordInput, 'newpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/First error/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Second error/i)).toBeInTheDocument();
      });
    });
  });

  describe('可访问性', () => {
    it('应该有正确的表单输入', () => {
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
    });

    it('应该有正确的按钮角色', () => {
      renderWithAuth(<LoginPage />, { supabase: mockSupabase });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
